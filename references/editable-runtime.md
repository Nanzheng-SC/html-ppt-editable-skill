# Editable Runtime Reference

`assets/editable-runtime.js` adds browser text editing and save/export behavior
to html-ppt decks without changing `assets/runtime.js`.

## Required Include

Place it after the normal deck runtime:

```html
<script src="../assets/runtime.js"></script>
<script src="../assets/editable-runtime.js"></script>
```

Adjust the relative path for nested templates:

```html
<script src="../../../assets/runtime.js"></script>
<script src="../../../assets/editable-runtime.js"></script>
```

## User Controls

- Hover the top-left corner to reveal the edit button.
- Press `E` to enter or leave edit mode.
- Click visible text and type normally.
- Press `Esc` while editing to leave edit mode.
- Press `Ctrl+S` or `Cmd+S` to save the edited deck HTML.
- Use the panel's `Reset edits` button to clear the local draft.

## Editable Elements

The runtime automatically enables common visible text elements:

```text
h1-h6, p, li, blockquote, figcaption, td, th, dt, dd,
.kicker, .eyebrow, .lede, .caption, .label, .pill, small,
[data-editable]
```

It ignores speaker notes, presenter overlays, overview UI, progress bars, and
anything marked with `data-edit-lock`.

Use `data-editable` for custom text containers:

```html
<div class="metric-label" data-editable>Monthly recurring revenue</div>
```

Use `data-edit-lock` for fixed UI or generated text:

```html
<span class="slide-number" data-edit-lock data-current="1" data-total="8"></span>
```

## Save Behavior

Drafts are auto-saved to `localStorage` using a per-file key. The explicit save
command creates a full standalone HTML file with the current edited text baked
into the document. If the browser supports the File System Access API, the user
gets a native save dialog. Otherwise the runtime downloads an
`*-edited.html` file.

The saved file removes transient edit UI and `contenteditable` attributes, but
keeps the runtime script so the saved copy remains editable later.

## Presenter Mode Compatibility

html-ppt presenter mode uses `?preview=N` iframes. The editable runtime detects
preview mode and does not initialize there, which keeps current/next slide
previews clean and avoids duplicated hotzone controls.
