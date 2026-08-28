# CLAUDE.md — OBT (OnBoarding & Tracking)

## APP IDENTITY

- Name: OBT — OnBoarding & Tracking
- Full folder: C:\JPG-PROJECTS\JPG-OnBoarding-Tracking-App
- GitHub repo: Doug2752/JPG-OnBoarding-Tracking-App
- Dev port (master): 5175 (npm run dev) — ARCHIVED
- Dev port (Chris-Mods): 5178 (npm run dev -- --port 5178) — ACTIVE
- Purpose: 14-day client onboarding and tracking baseline app. Establishes habits, biometrics, and baseline data before program entry. First app in the client journey.
- Architecture: React + Vite, Class 3 modular structure, localStorage (pre-Supabase).
- Migration pilot: OBT is the pilot app for the terminal-to-Claude-Desktop migration. Workflow issues get resolved here first before HUB, PIT, or DOP are touched.

---

## BRANCH STRUCTURE

- **master** — ARCHIVED. All prior builds intact. Runs at localhost:5175. No further development.
- **Chris-Mods** — ACTIVE. Only branch receiving development. Phase One complete as of 08/27/2026. Runs at localhost:5178.
- Never merge Chris-Mods to master without explicit decision from Doug.

---

## NON-NEGOTIABLE WORKING RULES

1. Investigation before action. Read actual source files before changing anything. If assumptions do not match what's in the code, stop and report — do not silently fill gaps or proceed past an unexpected finding.
2. Never assume. Never guess app behavior, credentials, prior decisions, or file contents. Verify by reading source, browser-testing, or asking Doug. If uncertain, say so explicitly.
3. Never act without asking first. Do not create files, draft documents, run destructive commands, or take any constructive action without explicit go-ahead from Doug. No jumping ahead.
4. One task at a time. Logic changes stay isolated from styling from copy. Do not batch across concern types in a single pass. Related fixes within the same concern type may be grouped.
5. Plan mode always on. Every action must be reviewed and approved before it executes. Auto-accept mode is never enabled.
6. GitHub Desktop is the only trusted push mechanism. Never trust terminal or Desktop push output as confirmation. After any commit, remind Doug to verify in GitHub Desktop (Push origin button, commits waiting to push count).
7. Browser-verify before commit. Every feature must be verified in Firefox before it is committed. Chris-Mods verifies at localhost:5178. Code-verified is not the same as browser-verified.
8. Never redraft finalized copy from scratch. Always retrieve the actual original live text before editing. Rewriting from memory without retrieving the source is a trust violation.
9. Never touch .md files in the app folder during code builds.
10. Always state branch and repo at the top of every Claude Code prompt.

---

## MODEL SELECTION

- **Opus** — complex multi-file logic builds, cross-component refactors, anything touching state management or period logic.
- **Sonnet** — small edits, investigations, styling changes, copy edits, cleanup passes.
- State the model at the top of every prompt. Never leave model choice as a question.

---

## BROWSER AND PORT REFERENCE

- **Firefox** — code/build testing and DevTools work. Default browser for all OBT verification.
- **Brave** — reserved for Doug's daily DOP/PIT entries only. Never used for OBT testing.
- **Edge** — Doug's browser for Claude.ai chat sessions.
- Chris-Mods server: npm run dev -- --port 5178 → localhost:5178
- Server mode: always confirm dev server port before build work. Never run preview server (localhost:4173) during active development.

---

## FILE EXTENSIONS (updated 08/11/2026)

All component files are .jsx (renamed from .js during Chris-Mods session 08/11/2026).

- app/OBApp.jsx
- components/*.jsx (all components)
- main.jsx (root entry point)
- vite.config.js (unchanged extension)
- utils/.js and services/.js (unchanged)

---

## SECTION COLOR SYSTEM (LOCKED — do not change)

Each section has a dedicated color constant used for banners, checkmarks, day tags, chips, and interactive elements.

| Section | Color | Hex |
|---|---|---|
| Nutrition (01) | BURGUNDY | #7B3055 |
| Alcohol (02) | PURPLE | #4A3575 |
| Fitness (03) | ORANGE | #7A4418 |
| Sleep (04) | GREEN | #2E5A4B |
| Time & Life (05) | STEEL | #3A5A78 |

Note: Client Info color row removed — Client Info tab no longer exists in Chris-Mods.

GOLD and its variants (GOLD_DARK, GOLD_LIGHT) are also used in SummaryResults headers, Header pill, ReflectSection, and the Mark Day Complete button.

Color system is FULLY CONSTANTS-ONLY as of 07/29/2026. All component files and styles.js use named constants. No hardcoded brand hex values remain anywhere in the codebase.

---

## CURRENT BUILD STATE — MASTER BRANCH (ARCHIVED)

Master branch is archived as of 08/27/2026. No further development. Reference Code Logic v2.6 for full master branch build history.

---

## CURRENT BUILD STATE — CHRIS-MODS BRANCH (Phase One Complete 08/27/2026)

### Built and committed — 08/11/2026

**JSX migration:** All .js files renamed .jsx. All imports updated. main.jsx at root. vite.config.js updated.

**Header redesigned:** Left: "Day N of 14" gold text. Right: Set-Up and Instructions | username | logout — all right-justified gold. logout lowercase. No bottom border on bar. Removed: logo, Today tab, Archive tab, NEVER TWICE banner, tier patch, tier text.

**BrandBar redesigned (hero section):** Left: DAY N in large bold text. Right (stacked): "Onboarding & Tracking" above calendar date — both substantially smaller than DAY N. No logo, no NEVER TWICE, no tier patch, no border lines.

**trackingAnchorDate logic:** New localStorage key. Written automatically on first real section save (saveDayData) if not already set — never overwritten. Day number = Math.max(1, dayCompleteDates.length + 1). Calendar date = trackingAnchorDate + (dayNumber - 1) days.

**14-day date button row removed from all 5 sections. Day pill label removed from all 5 sections. Archive dormant — no UI path. Today/Archive toggle removed.**

### Built and committed — 08/27/2026

**CoverPage.jsx:**
- clientInfoFilled and onClientInfo props removed
- Client Info button removed entirely
- Only START TODAY'S ENTRY button remains

**OBApp.jsx:**
- Client Info tab removed from tabs array (7 tabs remain: Nutrition, Alcohol, Fitness, Sleep, Time & Life, Reflection, Summary Results)
- renderSection 'info' case removed
- ClientInfo import RETAINED — post-Supabase integration anchor. Do not remove.
- onEnter handler always routes to 'nutrition' — no conditional branch
- oneThing removed from isDayComplete check and comment

**SummaryResults.jsx — drill-down built:**
- drillWeek state (null | 1 | 2) and drillDay state (null | ISO string) added
- Week 1 header button: "VIEW DAYS 1–7 — Click to view full detail" (GOLD background)
- Week 2 header button: "VIEW DAYS 8–14 — Click to view full detail" (STEEL background)
- Week list view: back button, filtered day rows by week, clickable rows set drillDay
- DayDetail view: back to week list, read-only display of all recorded fields for that day
- DayGrid removed from both WeekSection blocks
- Tomorrow's One Thing row removed from DayDetail

**NutritionSection.jsx:**
- Snack button label conditional: "Add Snack" when snacks.length === 0, "Add Another Snack" when 1 or more

**SuppAdder.jsx:**
- Supplement button label conditional: "Add Supplement" when suppLog.length === 0, "Add Another Supplement" when 1 or more

**TimeLifeSection.jsx:**
- Tomorrow's One Thing block removed entirely (label, textarea, oneThingMissing validation, error push, oneThingBlock style reference)
- oneThing key removed from default shape
- mood key removed from default shape (was dead — no UI read/write)
- Standalone Additional Information textarea removed
- Mood / Stress / Notes label updated to "Mood / Stress / Notes / Additional Information"
- addl key now serves as combined Mood/Notes/Additional Information field

**InstructionsPanel.jsx:**
- Client Information section removed
- Section 05 Tomorrow's One Thing paragraph removed — ends at "Complete the PM Check-In by rating your day 1 to 10."
- Snack button reference updated to "Add Snack or Add Another Snack"

### Chris-Mods backlog (Phase Two — not yet built)
- OBT Guided version — design pass required first
- OBT Structured version — design pass required first

### Post-Supabase (do not build)
- Streak persistence, coach-facing archive, legal agreement gating, coach data transmission backend, SMS reminder, welcome name from registered profile
- Tier value written by graduation/period close logic
- Residential address cross-origin sync
- ClientInfo full integration (tab, UI path, data pre-population from Supabase)

---

## KEY ARCHITECTURAL FACTS

- React + Vite. localStorage for all state (pre-Supabase).
- Class 3 modular structure — no src\ directory.
- No backend, no API keys wired.
- Login credential matching is case-insensitive.
- All app code lives at C:\JPG-PROJECTS\ only — never OneDrive.
- Storage prefix: {username_lowercase}_ob6_
- Day keys: day_{YYYY-MM-DD}
- dayComplete prop = explicit mark (dayCompleteDates.includes()), NOT the data gate (isDayComplete)
- isDayComplete(dayData) — module-level pure function. Must remain module-level, no hooks, no dependencies.
- timelife default shape (Chris-Mods): screenSocialHrs, screenSocialMins, screenSocialNone, screenOtherHrs, screenOtherMins, screenOtherNone, workSchedule, workHoursNum, nonNeg: [], pmRating, relationshipTime, pitTime, familyTimeNone, addl. oneThing and mood REMOVED 08/27/2026.
- addl in TimeLifeSection serves as combined Mood / Stress / Notes / Additional Information field.
- ClientInfo import retained in OBApp.jsx — post-Supabase anchor. Do not remove.
- familyTimeNone not in day default shape — handled inline via || false
- trackingAnchorDate — Chris-Mods only. Written on first real section save. Never overwritten.
- hub_clients write-back: cross-origin limitation — resolved post-Supabase only

---

## CREDENTIALS

- Doug / JPG2026
- Test / JPG2026
- Login is case-insensitive
- Chris-Mods: localhost:5178

---

## REFERENCED GOVERNING DOCUMENTS

Do not reproduce these documents — reference by name only.

- Core Standard v1.8 — JPG governance foundation
- OBT Code Logic v2.6 — full app source of truth (updated 08/27/2026)
- Troubleshooting Guide v8.1 — plain-language app behavior reference (updated 08/27/2026)
- Session Handoff Primer v7.4 — uploaded to each new chat session

---

## SESSION START PROTOCOL

First instruction in every Desktop Code session is always read-only:

"Read CLAUDE.md and confirm you understand — do not run any commands yet."

Wait for Claude Code to confirm it has read this file and understood the rules. Only after confirmation, proceed to development work.

---

*CLAUDE.md v1.6 | JPG-OnBoarding-Tracking-App | 08/27/2026*

Changes v1.5 → v1.6: Master branch marked archived. Chris-Mods marked as sole active branch. Client Info tab removed from tabs array and renderSection — ClientInfo import retained as post-Supabase anchor. CoverPage client info props removed. oneThing and mood keys removed from timelife default shape. addl repurposed as combined Mood/Notes/Additional Information field. SummaryResults drill-down documented (drillWeek, drillDay state, DayDetail view, DayGrid removed). NutritionSection and SuppAdder conditional button labels documented. InstructionsPanel updates documented. Section color table updated — Client Info row removed. Phase One complete noted. Backlog updated to Phase Two only.
