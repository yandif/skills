---
name: coding-agent-harness
description: Design, review, and harden coding-agent runtimes and agent harnesses (agent loops, tool protocols, streaming events, session logs, compaction, permissions, product shells, extensions). Use when building or optimizing a coding agent, when a model "ignores" instructions or loses state, when tool calls fail or loop, when adding JSON/RPC/SDK modes, or when auditing an agent for safety and recoverability.
---

# Coding Agent Harness Engineering

A coding agent is not one API call; it is a **recoverable runtime around a model**. The hard
problem is never "what does the model say" but "when the model decides to act, how does the
system execute, record, feed back, and continue reliably".

This skill distills the `learn-agent-from-pi` course (17 chapters) into an actionable playbook.
Source material lives in the target repo at `learn-agent-from-pi/*.md` when present.

## The five-layer model (keep dependencies pointing down)

1. **Protocol layer** — internal message types, tool definitions, normalized `stopReason`,
   `usage`, and streaming events. Vendor differences live only in adapters.
2. **Agent loop** — a state machine driven by the model response: execute tools, return
   results, handle errors/abort, decide whether to ask again.
3. **Agent core / harness** — state ownership, turn snapshots, queues, lifecycle, and event
   settlement. This is where "Harness Engineering" lives.
4. **Product shells** — interactive TUI, print mode, JSON mode, RPC, SDK. All are projections of
   the *same* event stream, never separate agents.
5. **Extension layer** — third parties register tools, commands, and hooks through a controlled
   API instead of editing the core.

Corollary: if a new output mode requires touching the loop, or a vendor change requires touching
the UI, the layering is broken.

## Non-negotiable invariants

These are the rules that prevent the classic production failures. Check them first in any review.

- **Control flow follows message content, not stop reason.** Execute every `toolCall` block even
  if `stopReason === "stop"`; otherwise you emit an assistant message with tool calls and no
  results, and the next provider request is rejected.
- **Every tool call gets exactly one tool result**, in declaration order, immediately after the
  assistant message. Tool name missing, args invalid, throw, permission denied, aborted — all
  become `isError: true` tool results, never uncaught exceptions.
- **Log is the source of truth; context is a projection.** Never treat the current prompt as
  system state. Compression, branching, resume, replay, and UI are all projections of the log.
- **One kernel, many shells.** Permissions, logging, compaction, and queues are core concerns;
  interfaces only serialize and render.
- **All state changes happen at an explicit safe point**, and completion means "listeners and
  pending writes are settled", not "the model stream ended".

## Protocol layer

Normalized assistant message must carry more than text:

```ts
type StopReason = "stop" | "toolUse" | "length" | "error" | "aborted";

type AssistantMessage = {
  role: "assistant";
  content: Array<TextBlock | ThinkingBlock | ToolCallBlock | ImageBlock>;
  stopReason: StopReason;
  model: string;              // the model that actually answered
  provider?: string;
  usage: { input; output; cacheRead; cacheWrite; reasoning };  // five fields, from day one
  errorMessage?: string;
  timestamp: string;
};
```

- Record `usage` with **all five token classes**. A single total can never be decomposed later,
  and cache-read is typically ~0.1x the input price.
- `toolCallId` is an internal correlation key, not a business id. Providers differ wildly (some
  >450 chars with `|`; some `^[a-zA-Z0-9_-]{1,64}$`). Normalize at the provider boundary and
  rewrite assistant ids **and** matching tool results together — never one without the other.
- Adapters absorb: system vs developer role, `max_tokens` vs `max_completion_tokens`, merging
  consecutive tool results, empty-text rejection, thinking-signature replay, image support,
  and lone-surrogate stripping before JSON serialization.
- Classify provider errors into retryable (429, 5xx, gateway timeouts, overloaded, socket reset,
  stream cut before terminator) vs terminal (quota, billing, auth, malformed request). Back off
  with a cap; if the server asks you to wait too long, surface it instead of hanging.
- A **faux/scripted provider is a first-class citizen.** It returns full assistant messages,
  tool calls, usage, and stop reasons, so loop/compaction/resume tests are cheap and
  deterministic. Real models are only for smoke tests.

## Agent loop

```text
user goal -> context builder -> provider adapter -> assistant response
   -> tool calls? -> executor -> tool results -> assistant message history -> ask again
   -> no tool calls -> end turn
```

- A **turn** = one model response + the tools it triggered. A **run** = one user input through all
  turns until no tool calls and no queued input remain.
- Always bound the loop (`maxTurns`), or expose a pluggable `shouldStopAfterTurn` plus good
  observability. Unbounded agents always find a way to spin.
- Error feedback must be **actionable**: `File not found: src/maths.ts. Did you mean src/math.ts?`
  beats `ENOENT`. The model can fix fixable errors; it cannot fix opaque ones.
- Decide retry-vs-stop by "can more reasoning fix this?". Bad path/args → tool result. Auth,
  quota, user cancel → log and stop.
- `abort` is not a thrown exception leaking to the top. Run cleanup, emit `stopReason: "aborted"`
  with partial content, write the log, and let UI explain where it stopped.

## Tool design

Each tool answers four questions in its description: when to use it, how to express args, what
the output contains and how it truncates, and how to recover from failure. **Every number in the
description must match runtime behavior.**

- Validate args at the runtime even if the provider claims schema enforcement. But be
  **tolerant on input, strict on output**: strip harmless extra fields and coerce numeric strings
  before failing. Hard-rejecting unknown fields manufactures avoidable retry turns.
- Two result layers: a short text `content` for the model, structured `details` (diff, exit code,
  timings, truncation) for UI/logs.
- Truncate deliberately and say so: `read` keeps the head (imports/types); `bash` keeps the tail
  (errors/summaries are last); `grep` caps match count and line length; search caps results and
  tells the model to narrow. Always state that truncation happened and how to get more.
- Paths resolve inside the workspace; resolve symlinks (realpath) before the boundary check.
  Reject binary files instead of dumping mojibake. Strip BOM on read, restore it on write.
- `edit` = exact `oldText` match (must be unique), with a normalization fallback (NFKC, trim
  line-end whitespace, curly→straight quotes, Unicode dash/space→ASCII) and a "closest snippet"
  hint on failure. Detect CRLF/LF and restore the original on write, or one edit rewrites the
  whole file. Support multi-edit atomically: all succeed or none apply.
- `write` requires the file to have been read (or explicit confirmation); prefer `edit` for small
  changes. `bash` needs cwd pinning, timeout, tail truncation, real exit codes, abort, and
  **process-tree kill**.
- Serialize writes to the same **real path** through one queue; parallel readers are fine.
- Abstract the world behind an `operations` interface (`readText`, `writeText`, `realpath`,
  `exec`) so local/SSH/container/memory backends are swappable.
- Tools declare execution mode (parallel-safe vs must-serialize); the executor schedules, not
  each tool.

## Streaming and events

Define a stable, framework-free event union. Every event should be a domain fact, e.g.
`text_delta`, not `appendToChatBubble`.

```text
start / text_start / text_delta / text_end
toolcall_start / toolcall_delta / toolcall_end
done{stop|length|toolUse} | error{error|aborted}
```

- Each streaming event carries a `partial` assistant message and a `contentIndex`, so consumers
  can render current state without accumulating deltas themselves.
- **Never execute half-parsed tool args.** Partial JSON is for rendering only; execution waits
  for the completed, validated object. A repair/partial parser may feed the UI, never the runner.
- `done` and `error` are the mutually exclusive terminators; `error` still carries the partial
  assistant message so "stream broke" and "finished" share one exit type.
- Expose both views from one underlying stream: an async-iterable of events for UI and a
  promise of the final message for the loop.
- Throttle high-frequency tool progress (e.g. ≤1 update / 100ms) and drop late updates after a
  tool is marked finished.

## Agent core & lifecycle guarantees

- **Turn snapshots**: a model request freezes the model, tools, resources, system prompt, and
  request options. Live config may change during a turn; it only affects the **next** request.
- Four state classes, never one blob: **live config** (latest), **turn snapshot** (immutable per
  request), **persisted session** (facts), **pending writes** (deferred, flushed at safe points).
- Make `phase` explicit: `idle | turn | compaction | branch_summary | retry`. Check and set phase
  before the first `await` to avoid two callers passing the `idle` gate concurrently.
- Operation admission is per-kind, not one rule: structural ops (new prompt, compaction, tree
  navigation) reject when busy with a stable `busy` error; steering/follow-up queue; config
  setters update live config; abort cancels and still runs cleanup.
- **Save point order** (this is what makes the log trustworthy):
  1. `message_end` persists the agent message *then* notifies observers (they see committed state).
  2. After `turn_end`, flush pending writes in request order; `shift()` only after a successful
     append so a mid-flush failure keeps the tail.
  3. Emit `save_point`; if continuing, rebuild a fresh snapshot.
  4. After `agent_end`, flush remaining writes and await async listeners; then `settled`.
- `waitForIdle()` resolves only after the last async listener and pending write. Never `await
  waitForIdle()` inside a listener — that deadlocks; provide `runWhenIdle()` instead.
- Hook failure semantics are per-event: permission/security hooks **fail closed**; statistics or
  logging observers must not break the turn. Public methods return stable error codes
  (`busy`, `invalid_argument`, `session`, `hook`, `auth`), not stringly-typed errors.
- `transformContext` / `convertToLlm` must never throw; on failure return the original input.

## Steering, follow-up, and interrupt

Three distinct inputs, three behaviors:

- **Stop/abort** — cancel provider + running tools, mark `aborted`, log it.
- **Steering** — "adjust the current direction". Inject at a consistent boundary: current
  assistant complete, started tools finished or cleanly cancelled, tool results logged, next
  request not yet sent. The next request then sees tool results *and* the steering together.
- **Follow-up** — "after this is done". Only consumed when the task is about to end naturally.

Maintain two queues, expose drain mode (`one` vs `all`, default `one`), keep original text and
timestamps, and emit queue events so the UI can say "queued; applies after the current tools".
Handle the double-consume trap: if `prompt()` enqueues the initial message, the first loop
iteration must not consume it again.

## Session log & recoverability

- Append-only **JSONL**: one entry per line, each with `id`, `parentId`, `timestamp`, `type`.
  `parentId` makes the session a tree (fork/branch), not an array.
- Entry types beyond messages: `model_change`, `compaction`, `custom`, `label`, session header,
  reasoning-strength changes. Rule: **anything that changes how the session later runs is
  logged; transient process state is not.**
- Storage: group sessions by project (encode cwd), one file per session, header carries `cwd` and
  `version`. List by reading only the header; resume by id prefix (scoped first, then global).
- Resume rebuilds active branch + model + compaction state + queues, and **never re-executes**
  historical tool calls.
- Version the format and ship idempotent migrations with old-format fixtures in tests. The first
  breaking change without migrations destroys every user's history.

## Context engineering & compaction

- Trigger when `context_tokens > context_window - reserve` (reserve ~16k and keep ~20k recent
  is a proven default). Handle three paths: threshold, manual, and overflow-recovery (compact
  then automatically retry the rejected request).
- Estimate tokens with a conservative heuristic (`chars/4`) for messages lacking usage; calibrate
  with real usage from assistant responses.
- Cut only at **complete turn boundaries**. A `toolResult` may never be the cut point; it travels
  with its `toolCall`.
- A compaction entry records `summary`, `tokensBefore`, `firstKeptEntryId`, and mechanically
  extracted read/modified file lists. **Never delete history** — compaction only changes the
  projection.
- A good agent summary is not meeting minutes; it is a work-continuation brief:
  `Goal / Current status / Constraints / Files observed / Files modified / Open tool results /
  Next step`. Wrap it in explicit delimiters ("earlier history was compressed into...") so the
  model does not mistake it for a fresh user instruction.
- Run an **amnesia test**: read a file, learn a constraint, modify another, compact, then assert
  the goal/constraint/modified-file/next-step survive in the projected context (checkable with a
  faux provider, no real model needed).
- Don't hoard context. High signal-to-noise beats "lossless"; if the summary can't cover a fact,
  tell the model to re-read rather than pretend it remembers.

## Safety, permissions, and trust

- Prompt is a soft constraint; tools are the hard boundary. "Don't edit unread files" belongs in
  both the prompt and the `edit` runtime.
- A permission gate is a mechanism (a pre-execution decision point returning
  `allow | deny | confirm`), not a hardcoded string blacklist. Policy is injected; deny produces
  an error tool result so the model can adapt.
- **The gate lives in the kernel**, so CLI, JSON, RPC, and SDK cannot bypass it.
- **Project trust is the first gate**: project-local configs, extensions, skills, and prompt
  files are executable code. On first entry, ask; persist the decision per normalized path;
  support "this session / this dir / parent dir / never"; untrusted ⇒ read-only + no project
  extensions.
- Treat repo text as untrusted input; label it as such in the prompt. Layer defenses: prompt
  provenance + permission gate + trust decision.
- Session logs are a data-exfiltration surface: consider storage permissions, redaction on
  export, and a dedicated policy for reading/echoing `.env`, keys, and credential files.
- For strong isolation, swap the `operations` backend to a container/VM/remote sandbox; don't
  rewrite tools.

## Product surfaces

- Interactive TUI, `--print`, JSON, RPC, and SDK all consume the same event stream.
- **stdout discipline** in machine modes: only machine-readable lines on stdout; human logs and
  warnings on stderr. Each event has `type` + `timestamp`; there is a clear terminal event.
- Exit codes are part of the contract: success 0, failure 1, signal codes as appropriate. CI
  depends on them.
- The SDK exposes stable methods (`prompt`, `steer`, `followUp`, `abort`, `subscribe`,
  `setModel`, `compact`), never raw internal mutable arrays.
- The TUI's difficulty is rendering (diffs, wide chars, throttled streaming), not logic. Keep
  that complexity inside the shell; never let the shell decide the next step.

## Extensions

- Provide lifecycle hooks (`session_start`, `before_model_request`, `tool_call`, `tool_result`,
  `session_before_compact`, `session_shutdown`), registration (tools, commands, renderers,
  status), and a context (cwd, session, events, UI, config, safety API).
- Hooks are typed per event; only mutating hooks return a result type. Observers don't.
- Blocking hooks fail closed; observer hooks fail open (isolated + reported).
- Registration-based extension: declarative `SKILL.md`, slash commands, and prompt templates are
  data, easier to distribute and constrain — but still untrusted project content, and any extra
  context must only be injected when the tool it depends on is active.
- Self-hosting test: if built-in features can't be implemented as extensions, the extension API
  is incomplete. Extension tools still pass the same permission gate.

## Evaluation & debugging

Three test layers: unit (validation, paths, truncation, write queue, BOM/CRLF), loop (faux
provider: tool use, error self-correction, steering, compaction, abort), and replay (parse a
real session log, rebuild context, assert projection).

Harness/race tests use explicit barriers (deferred promises) instead of `sleep`: freeze provider,
snapshot config, append writes, abort, then assert request 1 kept the old snapshot and request 2
saw the new one, and that listener writes land after the agent message.

Cost formula (record it, don't guess):

```text
turn_cost = input*price_input + output*price_output
          + cache_read*price_cache_read + cache_write*price_cache_write
          + reasoning*price_output
```

When behavior is wrong, debug in this order — deterministic layers first, model last:

1. Session log: was the fact written?
2. Harness timeline: phase, snapshot, save point, pending writes, settled.
3. Context projection: is the constraint actually in the request? (Build an assembly view with
   per-section token counts.)
4. Provider adapter: stop reason, tool calls, cross-model id/thinking handling.
5. Tool result: is the error actionable?
6. System prompt: section order and conflicts.
7. Only then the model.

## System prompt assembly

Build it in code, in a fixed order, stable content first (for prompt caching):

1. Identity and top-level discipline (not user-overridable).
2. Active tools only, each with usage guidance — never mention a tool that isn't enabled.
3. General behavior (concise, show paths, explain failures).
4. Project context (AGENTS.md/CLAUDE.md, global→specific, with source labels, untrusted).
5. Environment facts last (date, cwd) because they change and would break the cache prefix.

Keep system rules and project context **out of** compaction: rebuild them every request from
current files rather than letting a summary carry them.

## Anti-patterns

| Smell | Why it breaks | Fix |
|---|---|---|
| Cutting the loop on `stopReason !== "toolUse"` | Drops tool calls; illegal next request | Branch on presence of tool calls |
| Throwing on bad tool args | Model can't self-correct; run dies | Return error tool result |
| One giant `state` object mutated everywhere | Log/UI/request disagree | Split live/snapshot/persisted/pending |
| `sleep()` in race tests | Passes on fast machines only | Deferred-promise barriers |
| Saving only the final messages | Loses progress, branching, audit | Append-only event log |
| Deleting history on compaction | Can't fork or audit | Summary entry + projection rule |
| Blocking hook that fails open on throw | Security extension becomes a no-op | Fail closed |
| Human logs on stdout in JSON mode | Breaks every downstream parser | stdout = machine only |
| Fire-and-forget listeners | Last writes lost on exit | Count listeners in settlement |
| Hardcoded command blacklist as "security" | Bypassable and over-broad | Gate mechanism + injected policy |

## Review checklist

- [ ] Tool calls drive control flow; every call has a result in declaration order.
- [ ] Five-class usage recorded; cost computable per turn.
- [ ] Provider errors classified; retry with backoff and a cap; abort is a typed outcome.
- [ ] Tool args re-validated and normalized; results truncated with an explicit continue hint.
- [ ] Writes serialized per real path; symlink/BOM/CRLF handled.
- [ ] Streaming: partial args never executed; throttled progress; typed terminal event.
- [ ] Session log is append-only JSONL with ids/parents/version; resume never re-runs tools.
- [ ] Compaction cuts only at turn boundaries, never deletes history, passes the amnesia test.
- [ ] Steering/follow-up have separate queues and defined consumption points.
- [ ] Turn snapshots; live config changes apply at the next safe point; `busy` on structural ops.
- [ ] `waitForIdle()` includes async listeners and pending writes.
- [ ] Permission gate + project trust enforced in the kernel across every shell.
- [ ] Machine mode keeps stdout clean and defines exit codes.
- [ ] Every custom/extension tool passes the same gate and participates in the write queue.
- [ ] Tests: unit + faux-provider loop + session replay; races use barriers, not sleeps.
