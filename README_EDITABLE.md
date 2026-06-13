# html-ppt-editable

This is a new Codex skill assembled from:

- `zarazhangrui/frontend-slides` inline browser-editing behavior.
- `lewislulu/html-ppt-skill` presentation templates, themes, runtime, and presenter mode.

## What changed

- Added `assets/editable-runtime.js`.
- Added `templates/deck-editable.html`.
- Updated bundled HTML templates that use `assets/runtime.js` to also load
  `assets/editable-runtime.js`.
- Rewrote `SKILL.md` for the new `html-ppt-editable` skill.
- Added `references/editable-runtime.md`.

## Browser controls

- `E`: toggle inline text editing.
- Top-left hover: reveal edit button.
- `Ctrl+S` / `Cmd+S`: save edited HTML.
- Auto-save: local draft is kept in `localStorage`.
- `Reset edits`: clears the local draft for the current deck.

## Templates

The skill includes the original html-ppt template library:

- `templates/deck-editable.html`
- `templates/deck.html`
- `templates/full-decks/`
- `templates/single-page/`
- `assets/themes/`
- `assets/animations/`
