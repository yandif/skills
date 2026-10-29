#!/usr/bin/env python3
"""Query and audit the bundled CC:Tweaked reference; Python stdlib only."""
import argparse
import hashlib
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1] / "references"


def load_catalog():
    return json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))


def api_matches(pages, query):
    if ":" in query:
        owner, name = query.split(":", 1)
        owners = [p for p in pages if owner in (p["name"], p["category"] + "/" + p["name"])]
        return [(p, m) for p in owners for m in p["members"] if m["name"] == name]
    return [(p, m) for p in pages for m in p["members"]
            if query in (p["name"] + "." + m["name"], m["name"])]


def audit(catalog):
    errors = []
    pages = catalog["pages"]
    urls = [p["url"] for p in pages]
    if len(urls) != len(set(urls)):
        errors.append("Duplicate source URLs")
    if len(pages) != catalog["page_count"]:
        errors.append("Page count does not match manifest")
    actual = set(path.relative_to(ROOT).as_posix() for path in (ROOT / "pages").glob("*.md"))
    expected = {p["path"] for p in pages}
    if actual != expected:
        errors.append("Page file set differs from manifest")
    callable_count = member_count = 0
    for page in pages:
        path = ROOT / page["path"]
        if not path.is_file():
            errors.append("Missing page: " + page["path"])
            continue
        data = path.read_bytes()
        text = data.decode("utf-8")
        lines = text.splitlines()
        if hashlib.sha256(data).hexdigest() != page["sha256"]:
            errors.append("Hash mismatch: " + page["path"])
        if page["total_source_lines"] < 2 or page["covered_source_lines"] != page["total_source_lines"]:
            errors.append("Incomplete source coverage: " + page["path"])
        if "Last updated on " + page["last_updated"] not in text:
            errors.append("Missing source footer: " + page["path"])
        if "Source: " + page["url"] not in text:
            errors.append("Wrong provenance: " + page["path"])
        if "Failed to fetch" in text or "cite" in text:
            errors.append("Invalid reference text: " + page["path"])
        for member in page["members"]:
            member_count += 1
            callable_count += member["kind"] == "callable"
            if not (1 <= member["line"] <= member["end_line"] <= len(lines)):
                errors.append("Invalid member bounds: " + member["name"])
            elif lines[member["line"] - 1] != "## " + member["signature"]:
                errors.append("Invalid member location: " + page["name"] + "." + member["name"])
    if member_count != catalog["member_count"] or callable_count != catalog["callable_count"]:
        errors.append("Member counts do not match manifest")
    result = {"ok": not errors, "pages": len(pages), "members": member_count,
              "callables_including_aliases_and_object_methods": callable_count,
              "categories": catalog["category_counts"], "snapshot_date": catalog["snapshot_date"],
              "errors": errors}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if not errors else 1


def emit_page(page):
    print((ROOT / page["path"]).read_text(encoding="utf-8"), end="")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--api", help="turtle.forward or peripheral/monitor:write")
    group.add_argument("--event", help="event name, without event/ prefix")
    group.add_argument("--page", help="category/name, or an unambiguous page name")
    group.add_argument("--search", help="case-insensitive literal text search")
    group.add_argument("--audit", action="store_true", help="check coverage metadata, files and hashes")
    parser.add_argument("--limit", type=int, default=20, help="maximum search matches (1-200)")
    args = parser.parse_args()
    catalog = load_catalog()
    pages = catalog["pages"]
    if args.audit:
        return audit(catalog)
    if args.api:
        matches = api_matches(pages, args.api)
        if not matches:
            print("API not found; search the page or verify an extension/version.", file=sys.stderr)
            return 2
        if len(matches) > 1:
            print("Ambiguous API. Use one of:", file=sys.stderr)
            for page, member in matches:
                print(page["category"] + "/" + page["name"] + ":" + member["name"], file=sys.stderr)
            return 2
        page, member = matches[0]
        lines = (ROOT / page["path"]).read_text(encoding="utf-8").splitlines()
        print("Source: " + page["url"])
        print("Reference: " + str(ROOT / page["path"]) + ":" + str(member["line"]))
        print("Page updated: " + page["last_updated"] + "; snapshot: " + catalog["snapshot_date"])
        first_member_line = page["members"][0]["line"]
        version_notes = [line.strip() for line in lines[:first_member_line - 1]
                         if line.strip().startswith(("* New in version ", "* Changed in version "))]
        for note in version_notes:
            print("Page/module version: " + note[2:])
        print("\n".join(lines[member["line"] - 1:member["end_line"]]))
        return 0
    if args.page or args.event:
        query = "event/" + args.event if args.event else args.page
        matches = [p for p in pages if query in (p["name"], p["category"] + "/" + p["name"])]
        if len(matches) != 1:
            print("Page missing or ambiguous. Use category/name from references/index.md.", file=sys.stderr)
            for page in matches:
                print(page["category"] + "/" + page["name"], file=sys.stderr)
            return 2
        emit_page(matches[0])
        return 0
    if not 1 <= args.limit <= 200:
        parser.error("--limit must be between 1 and 200")
    needle = args.search.casefold()
    if not needle:
        parser.error("--search cannot be empty")
    found = 0
    for page in pages:
        lines = (ROOT / page["path"]).read_text(encoding="utf-8").splitlines()
        for index, line in enumerate(lines, start=1):
            if needle in line.casefold():
                print(page["path"] + ":" + str(index) + ": " + line.strip())
                found += 1
                if found >= args.limit:
                    print("Reached search limit; narrow the query or read a full page.", file=sys.stderr)
                    return 0
    return 0 if found else 2


if __name__ == "__main__":
    raise SystemExit(main())
