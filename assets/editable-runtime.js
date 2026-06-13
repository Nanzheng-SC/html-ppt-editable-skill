/* html-ppt-editable :: editable-runtime.js
 * Browser inline text editing for static html-ppt decks.
 *
 * Features:
 *   E toggles edit mode
 *   Ctrl/Cmd+S saves edited deck HTML
 *   edits auto-save to localStorage while drafting
 *   top-left hotzone reveals the edit control
 */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function inPreviewMode() {
    return /[?&]preview=\d+/.test(location.search || '') ||
      document.documentElement.getAttribute('data-preview') === '1' ||
      document.body.getAttribute('data-preview') === '1';
  }

  function textLike(el) {
    if (!el || el.closest('.notes, aside.notes, .speaker-notes')) return false;
    if (el.closest('.edit-hotzone, .edit-panel, .edit-toggle, .progress-bar, .overview, .notes-overlay')) return false;
    if (el.matches('[data-edit-lock], [data-edit-lock] *')) return false;
    if (!el.textContent || !el.textContent.trim()) return false;
    return true;
  }

  ready(function () {
    if (inPreviewMode()) return;

    const deck = document.querySelector('.deck');
    if (!deck) return;

    const selectors = [
      '[data-editable]',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'li', 'blockquote', 'figcaption',
      'td', 'th', 'dt', 'dd',
      '.kicker', '.eyebrow', '.lede', '.caption', '.label', '.pill',
      'small'
    ].join(',');

    const candidates = Array.from(deck.querySelectorAll(selectors)).filter(textLike);
    if (!candidates.length) return;

    const storageKey = 'html-ppt-editable:' + location.pathname + ':' + candidates.length;
    let active = false;
    let hideTimer = null;
    let saveTimer = null;

    candidates.forEach((el, i) => {
      if (!el.dataset.editId) el.dataset.editId = 'editable-' + i;
    });

    const style = document.createElement('style');
    style.textContent = `
      .edit-hotzone{position:fixed;top:0;left:0;width:84px;height:84px;z-index:10000;cursor:pointer}
      .edit-toggle{position:fixed;top:16px;left:16px;width:40px;height:40px;border:1px solid rgba(255,255,255,.24);border-radius:10px;background:rgba(18,22,32,.82);color:#fff;box-shadow:0 10px 30px rgba(0,0,0,.25);font:600 18px/1 system-ui,-apple-system,"Segoe UI",sans-serif;display:grid;place-items:center;opacity:0;pointer-events:none;transition:opacity .22s ease,transform .22s ease,background .22s ease;z-index:10001;backdrop-filter:blur(14px)}
      .edit-toggle.show,.edit-toggle.active{opacity:1;pointer-events:auto}
      .edit-toggle.active{background:#2f6bff;transform:translateY(1px)}
      .edit-panel{position:fixed;top:64px;left:16px;display:none;gap:8px;align-items:center;padding:8px;background:rgba(18,22,32,.88);border:1px solid rgba(255,255,255,.18);border-radius:12px;box-shadow:0 14px 34px rgba(0,0,0,.28);z-index:10001;backdrop-filter:blur(14px);font:500 12px/1.2 system-ui,-apple-system,"Segoe UI",sans-serif;color:#fff}
      .edit-panel.open{display:flex}
      .edit-panel button{border:1px solid rgba(255,255,255,.18);border-radius:8px;background:rgba(255,255,255,.08);color:#fff;padding:7px 10px;font:inherit;cursor:pointer}
      .edit-panel button:hover{background:rgba(255,255,255,.16)}
      .edit-status{opacity:.72;white-space:nowrap}
      .deck.edit-mode [contenteditable="true"]{outline:2px dashed rgba(47,107,255,.58);outline-offset:4px;cursor:text}
      .deck.edit-mode [contenteditable="true"]:focus{outline:3px solid rgba(47,107,255,.82);box-shadow:0 0 0 6px rgba(47,107,255,.14)}
    `;
    document.head.appendChild(style);

    const hotzone = document.createElement('div');
    hotzone.className = 'edit-hotzone';
    hotzone.setAttribute('aria-hidden', 'true');

    const toggle = document.createElement('button');
    toggle.className = 'edit-toggle';
    toggle.id = 'editToggle';
    toggle.type = 'button';
    toggle.title = 'Edit text (E)';
    toggle.textContent = 'E';

    const panel = document.createElement('div');
    panel.className = 'edit-panel';
    panel.innerHTML = '<button type="button" data-action="save">Save HTML</button><button type="button" data-action="reset">Reset edits</button><span class="edit-status">Edit mode</span>';

    document.body.appendChild(hotzone);
    document.body.appendChild(toggle);
    document.body.appendChild(panel);
    const status = panel.querySelector('.edit-status');

    function readDraft() {
      try {
        const raw = localStorage.getItem(storageKey);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    }

    function writeDraft() {
      const data = {};
      candidates.forEach((el) => { data[el.dataset.editId] = el.innerHTML; });
      try {
        localStorage.setItem(storageKey, JSON.stringify(data));
        status.textContent = 'Saved locally';
      } catch (e) {
        status.textContent = 'Local save failed';
      }
    }

    function scheduleDraftSave() {
      status.textContent = 'Saving...';
      clearTimeout(saveTimer);
      saveTimer = setTimeout(writeDraft, 250);
    }

    function applyDraft() {
      const data = readDraft();
      if (!data) return;
      candidates.forEach((el) => {
        const html = data[el.dataset.editId];
        if (typeof html === 'string') el.innerHTML = html;
      });
      status.textContent = 'Restored local edits';
    }

    function toggleEditMode(force) {
      active = typeof force === 'boolean' ? force : !active;
      deck.classList.toggle('edit-mode', active);
      toggle.classList.toggle('active', active);
      toggle.classList.toggle('show', active);
      panel.classList.toggle('open', active);
      candidates.forEach((el) => {
        el.setAttribute('contenteditable', active ? 'true' : 'false');
        if (active) el.setAttribute('spellcheck', 'true');
      });
      if (!active) writeDraft();
    }

    function cleanCloneForSave() {
      const clone = document.documentElement.cloneNode(true);
      clone.querySelectorAll('.edit-hotzone,.edit-toggle,.edit-panel').forEach((el) => el.remove());
      clone.querySelectorAll('.edit-mode').forEach((el) => el.classList.remove('edit-mode'));
      clone.querySelectorAll('[contenteditable]').forEach((el) => {
        el.removeAttribute('contenteditable');
        el.removeAttribute('spellcheck');
      });
      clone.querySelectorAll('style').forEach((el) => {
        if (el.textContent && el.textContent.indexOf('.edit-hotzone') >= 0) el.remove();
      });
      return '<!DOCTYPE html>\n' + clone.outerHTML + '\n';
    }

    async function saveHtml() {
      writeDraft();
      const html = cleanCloneForSave();
      const suggested = (document.title || 'deck').trim().replace(/[\\/:*?"<>|]+/g, '-') + '-edited.html';
      if (window.showSaveFilePicker) {
        try {
          const handle = await window.showSaveFilePicker({
            suggestedName: suggested,
            types: [{ description: 'HTML file', accept: { 'text/html': ['.html'] } }]
          });
          const writable = await handle.createWritable();
          await writable.write(html);
          await writable.close();
          status.textContent = 'HTML saved';
          return;
        } catch (e) {
          if (e && e.name === 'AbortError') {
            status.textContent = 'Save cancelled';
            return;
          }
        }
      }
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = suggested;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      status.textContent = 'HTML downloaded';
    }

    function resetEdits() {
      if (!confirm('Reset local text edits for this deck?')) return;
      try { localStorage.removeItem(storageKey); } catch (e) {}
      location.reload();
    }

    function showToggle() {
      clearTimeout(hideTimer);
      toggle.classList.add('show');
    }

    function maybeHideToggle() {
      hideTimer = setTimeout(() => {
        if (!active) toggle.classList.remove('show');
      }, 400);
    }

    hotzone.addEventListener('mouseenter', showToggle);
    hotzone.addEventListener('mouseleave', maybeHideToggle);
    hotzone.addEventListener('click', () => toggleEditMode());
    toggle.addEventListener('mouseenter', showToggle);
    toggle.addEventListener('mouseleave', maybeHideToggle);
    toggle.addEventListener('click', () => toggleEditMode());

    panel.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      if (button.dataset.action === 'save') saveHtml();
      if (button.dataset.action === 'reset') resetEdits();
    });

    candidates.forEach((el) => {
      el.addEventListener('input', scheduleDraftSave);
      el.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          el.blur();
          toggleEditMode(false);
        }
      });
    });

    document.addEventListener('keydown', (event) => {
      const editingText = event.target && event.target.getAttribute && event.target.getAttribute('contenteditable') === 'true';
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        saveHtml();
        return;
      }
      if (!editingText && event.key.toLowerCase() === 'e') {
        event.preventDefault();
        toggleEditMode();
      }
    });

    window.htmlPptEditable = {
      toggleEditMode,
      saveHtml,
      writeDraft,
      storageKey
    };

    applyDraft();
  });
})();
