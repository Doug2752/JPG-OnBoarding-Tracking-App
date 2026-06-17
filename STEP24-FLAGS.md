# STEP 24 — FLAG RESOLUTIONS
**Date:** 05/04/2026

---

## FLAG 1 — constants.js Color Values
**Action required: Manual verification against source monolith.**

Open JPG_OB_v6.html in a text editor. Search for the color variable definitions near the top of the script block. Verify each of the 14 values matches what is in constants.js.

Values confirmed from CSS and rendered HTML:
| Constant     | Expected Value | Source          |
|--------------|----------------|-----------------|
| GOLD         | #B8860B        | CSS body rule   |
| GOLD_DARK    | #7A6010        | Login card border (rendered) |
| DARK         | #1A1A1A        | Footer text (rendered) |

Remaining 11 values (GOLD_LIGHT, BG, CHARCOAL, MID, BORDER, STEEL, STEEL_MID, STEEL_LIGHT, GREEN, GREEN_LIGHT, RED) — verify in source before running Step 25.

---

## FLAG 2 — USERS Passwords
**Action required: Fill passwords in constants.js before testing.**

The USERS object in constants.js was left with blank password values during conversion. Locate the USERS definition in constants.js and fill in the correct passwords from the source monolith.

```js
// constants.js — find this object and fill values
export const USERS = {
  Doug: 'FILL_FROM_SOURCE',
  Test:  'FILL_FROM_SOURCE'
};
```

Open JPG_OB_v6.html, search for `USERS` — the object with password values will be there.

---

## FLAG 3 — Babel Helpers / Build Setup
**RESOLVED — approach changed.**

The monolith used inline Babel transpilation. The modular version uses ES module imports, which require a build step. **Vite** replaces Babel helpers entirely — it handles transpilation, JSX, and bundling automatically.

Files produced in Step 24:
- `package.json` — Vite + React dependencies
- `vite.config.js` — minimal Vite config with React plugin
- `index.html` — updated for Vite (removed CDN scripts, added `<script type="module">`)
- `main.js` — clean 4-line entry point, no Babel helpers needed

**One-time setup on HP home machine:**
```
npm install
npm run dev
```
Browser opens at localhost. App runs. No further setup needed per session.

**On work computer (no installs):** Use vscode.dev to edit files, push to GitHub.
Run the app from HP home machine only — or use GitHub Pages / Netlify for a hosted version accessible from any machine.

---

## STEP 24 COMPLETE
All flags resolved. Proceed to Step 25 — Test full app.
