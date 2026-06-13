---
name: html-ppt-editable
description: Create template-driven static HTML presentations with browser inline text editing and save/export support. Use whenever the user asks for a PPT, deck, slides, keynote, talk, presentation, HTML slideshow, speaker-note deck, pitch deck, report deck, course slides, Xiaohongshu-style carousel, or wants an existing outline/content turned into editable browser slides. Prefer this skill when the deck should be polished, keyboard-navigable, template-based, and directly editable in the browser after generation.
license: MIT
---

# html-ppt-editable

Build polished static HTML presentations from bundled templates, then make the
visible text editable in the browser. This skill combines the template system
from `html-ppt` with the inline-editing behavior specified by
`frontend-slides`: hover the top-left corner or press `E`, edit text directly,
auto-save locally, and press `Ctrl+S` / `Cmd+S` to save a complete edited HTML
copy.

## Use This Workflow

1. Clarify the deck goal, audience, slide count, language, and desired tone.
   If the user's request is already specific, choose a strong default instead
   of asking extra questions.
2. Choose a bundled template before writing slide markup:
   - `templates/deck-editable.html` for a clean editable starter.
   - `templates/deck.html` for the original html-ppt starter.
   - `templates/full-decks/<name>/index.html` for complete scenario decks.
   - `templates/single-page/*.html` for page-level layouts.
3. Copy the closest template into the user's target output folder, then replace
   demo content with the user's content.
4. Keep both runtimes at the bottom of every generated deck:
   ```html
   <script src="../assets/runtime.js"></script>
   <script src="../assets/editable-runtime.js"></script>
   ```
   Adjust the `../` depth to match the deck's location.
5. Open or tell the user how to open the resulting `index.html`. Mention the
   post-draft controls only after the deck exists:
   - Arrow keys / space navigate.
   - `T` cycles themes.
   - `S` opens presenter mode.
   - `O` opens overview.
   - `E` toggles inline text editing.
   - `Ctrl+S` / `Cmd+S` saves the edited HTML file.

## Template Inventory

The skill includes the original html-ppt template library:

- 36 themes in `assets/themes/*.css`.
- 15 full-deck templates in `templates/full-decks/`.
- 31 single-page layouts in `templates/single-page/`.
- Showcase decks for themes, layouts, animations, and full decks.
- `templates/deck-editable.html`, a new starter wired for browser editing.

Load catalog references only when needed:

- `references/themes.md` for theme choice.
- `references/layouts.md` for page layout choice.
- `references/full-decks.md` for full-deck template choice.
- `references/animations.md` for CSS and canvas effects.
- `references/presenter-mode.md` for speaker notes and presenter view.
- `references/editable-runtime.md` for editing/save implementation details.

## Authoring Rules

- Start from an existing template. Do not invent a full structure from scratch
  when a bundled layout already matches the slide.
- Use design tokens from `assets/base.css` and theme files. Prefer
  `var(--text-1)`, `var(--accent)`, `var(--surface)`, and layout primitives
  like `.grid`, `.card`, `.kicker`, `.h1`, `.h2`, and `.lede`.
- Keep speaker-only text inside `.notes`, `aside.notes`, or `.speaker-notes`.
  The editing runtime intentionally ignores notes so presenter scripts are not
  accidentally exposed or edited as slide text.
- Add `data-edit-lock` to any visible text that should not become editable,
  such as slide counters, generated labels, fixed legal copy, or decorative
  chrome.
- Add `data-editable` to custom text elements that are not covered by normal
  selectors like headings, paragraphs, list items, table cells, captions, and
  small text.
- Do not use the CSS sibling-selector hover trick for edit controls. The
  included `editable-runtime.js` uses the safer JS hotzone with a 400ms grace
  period, matching the frontend-slides interaction requirement.

## Browser Editing Contract

`assets/editable-runtime.js` initializes only in normal audience view. It skips
`?preview=N` iframes used by presenter mode, so the presenter preview remains
clean.

The runtime provides:

- Top-left invisible hotzone that reveals the edit button.
- `E` keyboard shortcut, ignored while the cursor is inside editable text.
- `contenteditable` toggling for visible slide text.
- Local draft persistence via `localStorage`.
- Save/export via `showSaveFilePicker` when available, with download fallback.
- `Ctrl+S` / `Cmd+S` interception to save a standalone edited HTML file.
- Reset button for local drafts.

When generating decks, keep this runtime as an external script instead of
inlining it. That makes templates smaller and lets future edits improve all
decks consistently.

## Scaffold

From the skill folder:

```bash
./scripts/new-deck.sh my-talk
```

This creates `examples/my-talk/index.html` from `templates/deck.html`; the
starter already includes `editable-runtime.js`. For a cleaner English starter,
copy `templates/deck-editable.html` manually and adjust asset paths.

## Source Lineage

This skill is an integration and enhancement based on two prior open-source
projects / skills:

- `lewislulu/html-ppt-skill` for the HTML presentation template system,
  keyboard runtime, presenter mode, themes, layouts, animations, and
  full-deck library.
- `zarazhangrui/frontend-slides` for the browser inline-editing interaction:
  hidden edit affordance, `E` toggle, local auto-save, and explicit file save.

Thanks to the original authors for the foundation. Keep the original MIT
copyright notices when redistributing or modifying this skill.
