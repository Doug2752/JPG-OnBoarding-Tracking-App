# CLAUDE.md — OBT (OnBoarding & Tracking)

## APP IDENTITY

- **Name:** OBT — OnBoarding & Tracking
- **Full folder:** C:\JPG-PROJECTS\JPG-OnBoarding-Tracking-App
- **GitHub repo:** Doug2752/JPG-OnBoarding-Tracking-App
- **Dev port:** 5175 (5176 fallback)
- **Purpose:** 14-day client onboarding and tracking baseline app.
  Establishes habits, biometrics, and baseline data before program
  entry. First app in the client journey.
- **Architecture:** React + Vite, Class 3 modular structure,
  localStorage (pre-Supabase).
- **Migration pilot:** OBT is the pilot app for the terminal-to-
  Claude-Desktop migration. Workflow issues get resolved here first
  before HUB, PIT, or DOP are touched.

## NON-NEGOTIABLE WORKING RULES

1. **Investigation before action.** Read actual source files before
   changing anything. If assumptions do not match what's in the code,
   stop and report — do not silently fill gaps or proceed past an
   unexpected finding.

2. **Never assume.** Never guess app behavior, credentials, prior
   decisions, or file contents. Verify by reading source, browser-
   testing, or asking Doug. If uncertain, say so explicitly.

3. **Never act without asking first.** Do not create files, draft
   documents, run destructive commands, or take any constructive
   action without explicit go-ahead from Doug. No jumping ahead.

4. **One task at a time.** Logic changes stay isolated from styling
   from copy. Do not batch across concern types in a single pass.
   Related fixes within the same concern type may be grouped.

5. **Plan mode always on.** Every action must be reviewed and
   approved before it executes. Auto-accept mode is never enabled.

6. **GitHub Desktop is the only trusted push mechanism.** Never
   trust terminal or Desktop push output as confirmation. After any
   commit, remind Doug to verify in GitHub Desktop (Push origin
   button, commits waiting to push count).

7. **Browser-verify before commit.** Every feature must be verified
   in Firefox (localhost:5175) before it is committed. Code-verified
   is not the same as browser-verified.

8. **Never redraft finalized copy from scratch.** Always retrieve
   the actual original live text before editing. Rewriting from
   memory without retrieving the source is a trust violation.

9. **Never touch .md files in the app folder during code builds.**

## MODEL SELECTION

- **Opus** — complex multi-file logic builds, cross-component
  refactors, anything touching state management or period logic.
- **Sonnet** — small edits, investigations, styling changes, copy
  edits, cleanup passes.
- State the model at the top of every prompt. Never leave model
  choice as a question.

## BROWSER AND PORT REFERENCE

- **Firefox** — code/build testing and DevTools work. Default
  browser at the OS level.
- **Brave** — reserved for Doug's daily DOP/PIT entries only.
  Never used for OBT testing.
- **Edge** — Doug's browser for Claude.ai chat sessions.
- **Vite config:** OBT vite.config.js carries
  `server: { open: false, port: 5175 }`.
- **Server mode:** always run `npm run dev` before any OBT build
  work — confirm dev server (localhost:5175), not preview server
  (localhost:4173).

## SECTION COLOR SYSTEM (LOCKED — do not change)

Each section has a dedicated color constant used for banners,
checkmarks, day tags, chips, and interactive elements.

| Section | Color | Hex |
|---|---|---|
| Client Info | GOLD | #B8860B |
| Nutrition (01) | BURGUNDY | #7B3055 |
| Alcohol (02) | PURPLE | #4A3575 |
| Fitness (03) | ORANGE | #7A4418 |
| Sleep (04) | GREEN | #2E5A4B |
| Time & Life (05) | STEEL | #3A5A78 |

GOLD and its variants (GOLD_DARK, GOLD_LIGHT) are also used in
SummaryResults headers, Header pill, ArchiveView active tab,
ReflectSection, and the Mark Day Complete button.

**Color system is FULLY CONSTANTS-ONLY as of 07/29/2026.**
All component files and styles.js use named constants. No hardcoded
brand hex values remain anywhere in the codebase.
- BURGUNDY and PURPLE added to styles.js imports (07/29/2026)
- All border-embedded hex strings replaced with constant concatenation
- Header.jsx, Login.jsx, ClientInfo.jsx, CoverPage.jsx,
  AlcoholSection.jsx, ReflectSection.jsx, ArchiveView.jsx,
  TimeLifeSection.jsx, OBApp.jsx all constants-only
- Intentional exceptions: #8B6508 (CoverPage quote block — no
  constant exists), light tint backgrounds, rgba values, neutral grays

## CURRENT BUILD STATE (confirmed in source 08/08/2026)

### Built and verified

- **OBT operability review COMPLETE (07/29/2026)** — all 14 source
  files audited. All findings triaged, resolved, or logged.

- **trackingStartDate field added to ClientInfo (BUILT 08/08/2026):**
  - Required field — added to CI_REQUIRED in both OBApp.jsx and ClientInfo.jsx
  - Full date validation (MM/DD/YYYY, calendar-valid)
  - Auto-format on input (same pattern as dateStarted)
  - Gold checkmark on valid fill
  - RED border + error message on invalid input
  - hub_clients write-back on valid save — converts MM/DD/YYYY to YYYY-MM-DD,
    finds matching client record by username (case-insensitive via probe pattern),
    writes tracking_start_date to hub_clients array
  - Username probe pattern: storage.save('_probe','') on mount, extracts
    username from returned key, stores in usernameRef, removes probe key
  - trackingStartDate state in OBApp — loaded from clientInfo on mount,
    wired via onTrackingStartDate prop

- **Bug fixes (07/29/2026):**
  - Sleep score clear-field: field now saves blank when emptied.
  - sleepMissing timesUpIsZero exemption: false error eliminated.
  - Duration field label: updated from "Duration (minutes)" to "Duration."

- **Submit to Coach (07/29/2026):** console.log removed. Payload
  retained as Supabase anchor (TODO comment). Backend = placeholder.

- **Dead code removed (07/29/2026):**
  - GOLD_DARK dead import — TimeLifeSection.jsx
  - STEEL dead import — Shared.jsx
  - Dead `view` prop — ArchiveView.jsx
  - Redundant RED ternary collapsed — TimeLifeSection.jsx

- **Section color pass COMPLETE (07/25/2026, finalized 07/29/2026)**

- **Fitness duration split (07/28/2026):** durationHrs + durationMins
  two-box layout.

- **Fitness Intensity RPE:** wrapped in ORANGE fitnessRpeBlock.

- **Sleep Quality:** wrapped in GREEN sleepQualityBlock.

- **BrandBar tier patch (07/26/2026):** reads _ob6_tier (default 4)
  and _ob6_clientInfo.fullName.

- **Archive row navigation:** completed day rows → Nutrition read-only.
  Reflection rows → Day 7 or Day 14 Reflect tab.

- **Submit to Coach strip:** five-state UI. Week 1 = days 1–7,
  Week 2 = days 8–14.

- **selectedDay globally shared** across all five sections.

- **30-day cycle architecture (locked):** all cycles exactly 30 days
  anchored to client's chosen tracking_start_date. No calendar month alignment.

- **Vitest:** 9 passing tests — tests\archiveNav.test.js.

### Known remaining dead code (low priority — do not touch without explicit direction)

- Item 57 — screenSocialNone/screenOtherNone in SummaryResults
  weekStats — declared, never assigned
- Item 58 — isDayComplete prop spread in dayProps — no section
  destructures it
- Item 59 — Mixed &&/|| without parens in TimeLifeSection
  workSchedule condition — evaluates correctly, reads ambiguously
- OBApp.jsx comment line ~22 reads "eleven required fields" — stale
  (now 13). Does not affect logic.

### Pending natural browser verification
- OBT supplements prior day button — enter supps Day 1, navigate Day 2,
  confirm gold button, click, confirm list copies, persist
- PIT One Thing check-off — tick One Thing, confirm First Action Step
  text appended in parentheses, field cleared

### Post-Supabase (do not build)

- Streak persistence, coach-facing archive, legal agreement gating,
  coach data transmission backend, SMS reminder, welcome name from
  registered profile
- Tier value written by graduation/period close logic (Phase 2)
- Login "Stay logged in" checkbox (Item 41)
- Nutrition AI calorie estimate (Item 42)

## KEY ARCHITECTURAL FACTS

- React + Vite (npm run dev launches on port 5175)
- localStorage for all state persistence (pre-Supabase migration)
- Class 3 modular structure — components split into files, not a monolith
- No src\ directory — all source files at repo root
- No backend, no API keys wired
- Login credential matching is case-insensitive (Core Standard v1.8
  Section 8.2 — locked)
- All app code lives at C:\JPG-PROJECTS\ only — never OneDrive
- Storage prefix: `{username_lowercase}_ob6_`
- Day keys: `day_{YYYY-MM-DD}`
- `dayComplete` prop = explicit mark (dayCompleteDates.includes()),
  NOT the data gate (isDayComplete)
- `isDayComplete(dayData)` used in two places: (1) gating Mark Day
  Complete button, (2) Header Required Fields Done pill
- isDayComplete is a module-level pure function — must remain
  module-level, no hooks, no dependencies
- **CI_REQUIRED = 13 fields (updated 08/08/2026):** fullName, dateStarted,
  trackingStartDate, phone, email, occupation, primaryGoal, nonNeg, hobbies,
  fitnessActivity, eatingHabits, sleepPatterns, injuries
- familyTimeNone not in day default shape — handled inline via || false
- _ob6_tier and _ob6_clientInfo read directly by BrandBar via
  localStorage.getItem — not in storage layer
- **hub_clients write-back:** OBT ClientInfo.jsx writes tracking_start_date
  to hub_clients when client saves a valid date. Username matched via
  probe pattern (usernameRef). This is the only hub_clients write from OBT.
  HUB owns this key.

## CREDENTIALS

- Doug / JPG2026
- Test / JPG2026
- Login is case-insensitive

## REFERENCED GOVERNING DOCUMENTS

Do not reproduce these documents — reference by name only.
Doug provides them in Claude.ai chat when needed.

- **Core Standard v1.8** — JPG governance foundation
- **OBT Code Logic v2.3** — full app source of truth
- **Troubleshooting Guide v6.4** — plain-language app behavior reference
- **Session Handoff Primer** — uploaded to each new chat session

## SESSION START PROTOCOL

First instruction in every Desktop Code session is always read-only:

> "Read CLAUDE.md and confirm you understand — do not run any
> commands yet."

Wait for Claude Code to confirm it has read this file and understood
the rules. Only after confirmation, proceed to development work.

---

*OBT CLAUDE.md — v1.3 — updated 08/08/2026. trackingStartDate field built — required, full validation, hub_clients write-back via username probe pattern. CI_REQUIRED updated to 13 fields. trackingStartDate state in OBApp. hub_clients write-back documented in architectural facts. Code Logic reference updated to v2.3. Server mode reminder added.*
