CLAUDE.md — OBT (OnBoarding & Tracking)
APP IDENTITY
Name: OBT — OnBoarding & Tracking
Full folder: C:\JPG-PROJECTS\JPG-OnBoarding-Tracking-App
GitHub repo: Doug2752/JPG-OnBoarding-Tracking-App
Dev port (master): 5175 (npm run dev)
Dev port (Chris-Mods): 5178 (npm run dev -- --port 5178)
Purpose: 14-day client onboarding and tracking baseline app. Establishes habits, biometrics, and baseline data before program entry. First app in the client journey.
Architecture: React + Vite, Class 3 modular structure, localStorage (pre-Supabase).
Migration pilot: OBT is the pilot app for the terminal-to- Claude-Desktop migration. Workflow issues get resolved here first before HUB, PIT, or DOP are touched.
BRANCH STRUCTURE
master — protected. All prior builds intact. Runs at localhost:5175. Never modified during Chris-Mods build work.
Chris-Mods — active redesign branch. Created from current master 08/11/2026. Runs at localhost:5178. Both branches can run simultaneously.
To switch: stop dev server → switch branch in GitHub Desktop → restart with correct port command.
Never merge Chris-Mods to master without explicit decision from Doug.
NON-NEGOTIABLE WORKING RULES
Investigation before action. Read actual source files before changing anything. If assumptions do not match what's in the code, stop and report — do not silently fill gaps or proceed past an unexpected finding.
Never assume. Never guess app behavior, credentials, prior decisions, or file contents. Verify by reading source, browser- testing, or asking Doug. If uncertain, say so explicitly.
Never act without asking first. Do not create files, draft documents, run destructive commands, or take any constructive action without explicit go-ahead from Doug. No jumping ahead.
One task at a time. Logic changes stay isolated from styling from copy. Do not batch across concern types in a single pass. Related fixes within the same concern type may be grouped.
Plan mode always on. Every action must be reviewed and approved before it executes. Auto-accept mode is never enabled.
GitHub Desktop is the only trusted push mechanism. Never trust terminal or Desktop push output as confirmation. After any commit, remind Doug to verify in GitHub Desktop (Push origin button, commits waiting to push count).
Browser-verify before commit. Every feature must be verified in Firefox before it is committed. Master verifies at localhost:5175. Chris-Mods verifies at localhost:5178. Code-verified is not the same as browser-verified.
Never redraft finalized copy from scratch. Always retrieve the actual original live text before editing. Rewriting from memory without retrieving the source is a trust violation.
Never touch .md files in the app folder during code builds.
MODEL SELECTION
Opus — complex multi-file logic builds, cross-component refactors, anything touching state management or period logic.
Sonnet — small edits, investigations, styling changes, copy edits, cleanup passes.
State the model at the top of every prompt. Never leave model choice as a question.
BROWSER AND PORT REFERENCE
Firefox — code/build testing and DevTools work. Default browser for all OBT verification.
Brave — reserved for Doug's daily DOP/PIT entries only. Never used for OBT testing.
Edge — Doug's browser for Claude.ai chat sessions.
Master server: npm run dev → localhost:5175
Chris-Mods server: npm run dev -- --port 5178 → localhost:5178
Server mode: always confirm dev server port before build work. Never run preview server (localhost:4173) during active development.
FILE EXTENSIONS (updated 08/11/2026)

All component files are .jsx (renamed from .js during Chris-Mods session 08/11/2026). This applies to both branches.

app/OBApp.jsx
components/*.jsx (all 14 components)
main.jsx (root entry point — renamed from main.js)
vite.config.js (unchanged extension)
utils/.js and services/.js (unchanged)
SECTION COLOR SYSTEM (LOCKED — do not change)

Each section has a dedicated color constant used for banners, checkmarks, day tags, chips, and interactive elements.

Section | Color | Hex
Client Info | GOLD | #B8860B
Nutrition (01) | BURGUNDY | #7B3055
Alcohol (02) | PURPLE | #4A3575
Fitness (03) | ORANGE | #7A4418
Sleep (04) | GREEN | #2E5A4B
Time & Life (05) | STEEL | #3A5A78

GOLD and its variants (GOLD_DARK, GOLD_LIGHT) are also used in SummaryResults headers, Header pill, ArchiveView active tab, ReflectSection, and the Mark Day Complete button.

Color system is FULLY CONSTANTS-ONLY as of 07/29/2026. All component files and styles.js use named constants. No hardcoded brand hex values remain anywhere in the codebase.

CURRENT BUILD STATE — MASTER BRANCH (confirmed in source 08/10/2026)
Built and verified
Residential and mailing address fields (BUILT 08/10/2026):
residentialStreet, residentialCity, residentialState, residentialZip
mailingStreet, mailingCity, mailingState, mailingZip
mailingSameAsResidential checkbox — collapses mailing fields, auto-copies residential values
Residential address writes back to hub_clients on mount and on field change via RESIDENTIAL_TO_HUB map, probe pattern
Address fields optional — NOT in CI_REQUIRED
Form field order: Full Name + Preferred Name, Addresses, Phone + Email, Date Started + Tracking Start Date, Occupation+
trackingStartDate field (BUILT 08/08/2026):
Required field — added to CI_REQUIRED (13 fields total)
Full date validation, auto-format, gold checkmark, RED border
hub_clients write-back via username probe pattern
trackingStartDate state in OBApp
OBT operability review COMPLETE (07/29/2026)
Bug fixes (07/29/2026): sleep score clear-field, sleepMissing timesUpIsZero exemption, duration field label.
Submit to Coach (07/29/2026): payload retained as Supabase anchor (TODO comment). Backend = placeholder.
Section color pass COMPLETE (07/25/2026, finalized 07/29/2026)
Fitness duration split (07/28/2026): durationHrs + durationMins.
BrandBar tier patch (07/26/2026): reads _ob6_tier and _ob6_clientInfo.fullName. (Master branch only — removed in Chris-Mods.)
Archive row navigation, Submit to Coach strip, selectedDay globally shared, 30-day cycle architecture, Vitest 9 tests — all built and verified on master.
Known remaining dead code (low priority — do not touch)
Items 57, 58, 59 — see Code Logic v2.5 Section K
OBApp.jsx stale comment ("eleven required fields")
Post-Supabase (do not build)
Streak persistence, coach-facing archive, legal agreement gating, coach data transmission backend, SMS reminder, welcome name
Tier value written by graduation/period close logic (Phase 2)
Login "Stay logged in" (Item 41)
Nutrition AI calorie estimate (Item 42)
CURRENT BUILD STATE — CHRIS-MODS BRANCH (committed 08/11/2026)
Built and committed
JSX migration: all .js files renamed .jsx. All imports updated. main.jsx at root. vite.config.js updated.
Header redesigned:
Left: "Day N of 14" gold text
Right: Set-Up and Instructions | username | logout — all right- justified gold. logout lowercase. No bottom border on bar.
Removed: logo, Today tab, Archive tab, NEVER TWICE banner, tier patch, tier text
BrandBar redesigned (hero section):
Left: DAY N in large bold text
Right (stacked, vertically centered): "Onboarding & Tracking" above calendar date — both substantially smaller than DAY N
No logo, no NEVER TWICE, no tier patch, no border lines
trackingAnchorDate logic:
New localStorage key: trackingAnchorDate
Written automatically on first real section save (saveDayData) if not already set — never overwritten after first write
Day number = Math.max(1, dayCompleteDates.length + 1)
Calendar date = trackingAnchorDate + (dayNumber - 1) days
"Day N of 14" counter minimum = 1, never 0
14-day date button row removed from all 5 sections.
Day pill label removed from all 5 sections.
Tab row unchanged — all 8 tabs stay exactly as-is.
Archive dormant — Today/Archive toggle removed. Code remains but no UI path to reach it.
Chris-Mods backlog (not yet built)
Summary Results drill-down — week-grouped prior day access
Client Info isolated as own page
Section content simplification pass (requires visual walkthrough with Doug first)
KEY ARCHITECTURAL FACTS
React + Vite. localStorage for all state (pre-Supabase).
Class 3 modular structure — no src\ directory.
No backend, no API keys wired.
Login credential matching is case-insensitive.
All app code lives at C:\JPG-PROJECTS\ only — never OneDrive.
Storage prefix: {username_lowercase}_ob6_
Day keys: day_{YYYY-MM-DD}
dayComplete prop = explicit mark (dayCompleteDates.includes()), NOT the data gate (isDayComplete)
isDayComplete(dayData) — module-level pure function. Must remain module-level, no hooks, no dependencies.
CI_REQUIRED = 13 fields: fullName, dateStarted, trackingStartDate, phone, email, occupation, primaryGoal, nonNeg, hobbies, fitnessActivity, eatingHabits, sleepPatterns, injuries
familyTimeNone not in day default shape — handled inline via || false
_ob6_tier and _ob6_clientInfo read directly by BrandBar via localStorage.getItem — not in storage layer (master branch only)
hub_clients write-back (master): tracking_start_date AND residential address fields written by ClientInfo.jsx. Cross-origin limitation applies — only works when apps share same origin.
CREDENTIALS
Doug / JPG2026
Test / JPG2026
Login is case-insensitive
Both master (5175) and Chris-Mods (5178) use same credentials
REFERENCED GOVERNING DOCUMENTS

Do not reproduce these documents — reference by name only.

Core Standard v1.8 — JPG governance foundation
OBT Code Logic v2.5 — full app source of truth (updated 08/11/2026)
Troubleshooting Guide v6.7 — plain-language app behavior reference
Session Handoff Primer — uploaded to each new chat session
SESSION START PROTOCOL

First instruction in every Desktop Code session is always read-only:

"Read CLAUDE.md and confirm you understand — do not run any commands yet."

Wait for Claude Code to confirm it has read this file and understood the rules. Only after confirmation, proceed to development work.

OBT CLAUDE.md — v1.4 — updated 08/11/2026. Chris-Mods branch added (port 5178). JSX migration documented. Header and hero redesign documented. trackingAnchorDate logic documented. Branch structure section added. File extensions section added. Code Logic reference updated to v2.5. Troubleshooting Guide reference updated to v6.7. Residential address fields added to master build state.
