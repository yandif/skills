---
name: artifact-template-interview
description: "Create an image using the Interview 面试题理解图解 template and its retained reference file. Use when the user selects this template, names Interview 面试题理解图解, or explicitly invokes $artifact-template-interview. 把技术、产品、业务或系统设计面试题转化为高可读性的手绘知识图解，突出考察意图、理解链路、关键误区和可口述的回答骨架。"
---

# Interview 面试题理解图解

Create an image from this template. Keep the reference file unchanged.

## Workflow

1. Read `artifact-template.json` and resolve its paths relative to this skill directory.
2. Read the user's source content before drawing. Identify the interview question, question type, tested competency, central judgment, reasoning chain, common misconception, and spoken-answer structure. If the source does not support one of these, omit it instead of inventing it.
3. Compress the source into a visual brief. Do not copy long paragraphs verbatim. Preserve exact technical names, protocols, ports, code paths, numbers, components, arrow directions, causal relationships, data flow, and action semantics.
4. Invoke $imagegen with the retained PNG as a style and layout reference, the user's requested content, and the template contract below. Treat this as a new generation unless the user explicitly asks to edit an existing image.
5. Preserve the reference's visual language unless the user explicitly requests a deviation. Adapt the middle layout to the question type instead of forcing every topic into the TCP example's exact boxes.
6. Visually inspect the generated image for content accuracy, text legibility, hierarchy, clipping, and fidelity. If a critical label, arrow, or judgment is wrong, make one targeted correction and inspect again before returning the final image.

## Template contract

### Purpose

Turn technical, product, business, case, or system-design interview material into a high-readability hand-drawn knowledge explainer. The image must help the candidate understand the question first and organize a spoken answer second. It should not merely summarize notes.

### Required information hierarchy

- Top: a strong question-style title, one-sentence central judgment, and a short `面试官在考` label.
- Middle: three to six modules chosen from the source's logic. Prefer a causal chain for principle questions, a timeline for process questions, side-by-side criteria for comparison questions, a decision tree for scenario questions, and layers plus trade-offs for system-design questions.
- Within each module: at most three to five short points and no more than six lines of body text.
- Bottom: a concise `口述答案骨架` or equivalent in the user's language, followed by one memorable final conclusion.
- When content is dense, keep only the eight to ten most important judgments. Preserve the main reasoning chain, key difference, and final judgment before secondary explanation.

### Interview-understanding rules

- Make the tested competency explicit: what the interviewer is actually probing, not just the literal topic.
- Separate `事实/机制`, `为什么`, `常见误区`, and `怎么回答` when the source supports them.
- Prefer explanatory relationships such as cause -> mechanism -> consequence -> trade-off over disconnected facts.
- Include a spoken-answer skeleton that can be delivered in roughly 30 to 90 seconds; do not write a full memorized script unless requested.
- For open-ended questions, show assumptions, decision criteria, trade-offs, and a conditional conclusion. Do not pretend there is one universal answer.

### Language and text

- Determine the image language from the user's input. Use one primary language consistently.
- Do not mix languages except for necessary technical terms, product names, protocol names, code paths, and numeric metrics.
- Use short, natural phrases rather than document prose. The title must be largest; module titles must be clearly ordered; body text must remain readable at normal viewing size.
- Do not add English section names such as `Flow Summary` or `Bottom Line` to a Chinese image. Localize structural labels to the image's primary language.

### Canvas and visual system

- Default to 16:9 landscape when the user does not specify a ratio. Accept 5:4, 4:3, or 21:9 when requested, and reflow the layout rather than cropping.
- Use a warm off-white or light warm-gray background with subtle paper grain and stable whitespace.
- Combine a carefully organized creative notebook, whiteboard reasoning, and consulting-report infographic. Use deep-ink hand-drawn lines, rounded groups, thin frames, light shadows, numbering, arrows, labels, and small wayfinding icons.
- Allow slight hand-drawn irregularity while keeping alignment, margins, grouping, and reading order disciplined.
- Use restrained marker colors: muted teal, sage green, pale purple, soft orange, and light blue. Color should guide modules, paths, correctness, warnings, and answer structure; it should not dominate the page.
- Avoid neon, strong gradients, glossy 3D, excessive commercial effects, full-page solid color, decorative doodle overload, dense microtype, and tiny tables.

### Accuracy and exclusions

- Never introduce an unsupported component, protocol, port, state, metric, claim, or causal link merely to fill space.
- Do not reverse arrows or change verbs. For example, `读取日志` must not become `生成日志`.
- Keep uncertainty, assumptions, and source disagreements visible when they matter.
- If space is insufficient, remove secondary explanation before shrinking text.
- No logos, watermarks, or unrelated decoration unless the user explicitly requests them.

## Recommended invocation

Ask the user for the source material or interview question. Helpful optional inputs are the target role or seniority, the part they find difficult, the desired ratio, and whether the image is for personal review, interview rehearsal, sharing, or presentation. Do not block on optional inputs; infer sensible defaults from context.

## Fidelity

Preserve the reference image's composition, visual hierarchy, palette, typography, material treatment, lighting, and recurring brand elements.

User instructions control requested content and explicit deviations. The retained reference controls layout and formatting where the user has not requested a change.
