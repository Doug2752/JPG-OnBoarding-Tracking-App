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
- **Brave** — reserved for Vite dev servers for Doug's daily
  DOP/PIT entries only. Never used for OBT testing.
- **Edge** — Doug's browser for Claude.ai chat sessions.
- **Vite config:** OBT vite.config.js should carry
  `server: { open: false }` to prevent auto-launch of a browser tab.
  Verify this is set before starting the dev server.

## SECTION COLOR SYSTEM (LOCKED — do not change)

Each section has a dedicated color constant used for banners,
checkmarks, day tags, chips, and interactive elements. GOLD is
reserved for global chrome (tab bar, BrandBar, Archive active state,
Reflection headers, calorie display).

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

## CURRENT BUILD STATE (confirmed in source 07/25/2026)

### Built and verified in code (browser-verify pending)

- **Section color pass — COMPLETE** for all five tracking sections
  and Nutrition/SuppAdder:
  - Per-section block headers, infoBoxes, banner bars
  - Per-section day tags (dayTagBurgundy/Purple/Orange/Green/Steel
    in styles.js)
  - Per-section checkmarks on all interactive fields
  - RatingButtons activeColor/activeBorderColor per section
  - SleepSection InputWithToggle unitColor=GREEN
  - TimeLifeSection PM Check-In unselected buttons: white border +
    white text on STEEL_MID background; selected: white highlight
  - TimeLifeSection TODAY label white; score box white border
  - TimeLifeSection None checkboxes accentColor=STEEL
  - NutritionSection/SuppAdder: all chips, buttons, recent-panel
    rows use Burgundy variants
  - styles.js: dayTagBurgundy/Purple/Orange/Green/Steel; chipBurgundy,
    chipXBurgundy, suppRecentBurgundy, suppRecentItemBurgundy,
    copyBtnBurgundy all added

- **SummaryResults screen-time regression fixed:** weekStats and
  DayGrid now read screenSocialHrs/Mins/None and
  screenOtherHrs/Mins/None (two-box keys). Screen Social Media
  checkmark added to TimeLifeSection.

- **dayComplete source corrected:** OBApp derives dayComplete from
  dayCompleteDates.includes() (explicit mark), not isDayComplete()
  (data gate).

- **Client Info auto-format:** phone → (XXX) XXX-XXXX, date →
  MM/DD/YYYY. Email type=email. All placeholders set.

- **SleepSection 3-column grid drops to 2 columns** when timesUpIsZero.

- **TimeLifeSection Relationship/PIT grid:** alignItems:start +
  labelSm minHeight:30px on both cells.

- **Group 9 cleanup complete:**
  - Shared.jsx: DayBtn, SummaryBtn, MID import removed
  - constants.js: LOGO_LIGHT, LOGO_DARK removed
  - CoverPage.jsx: PATCH_SRC, patchOk state, useState import removed;
    font useEffect cleanup with null-parent guard added
  - AlcoholSection infoBox copy corrected ("check the None box")
  - OBApp: section, setSection, streak removed from Header call;
    isDayComplete comments updated to match current field logic

- Class 3 modular structure
- Working login: Doug / JPG2026
- 14-day tracking metrics structure (Fuel / Output / Recovery /
  Processing categories, daily subjective scoring)
- Cover page with LIMITLESS branding, daily quote, program status

### Known issues (flagged, not fixed)

- **FitnessSection no-startDate branch** uses `S.infoBox` (gold)
  instead of `S.infoBoxOrange` — pending color pass follow-up.
- **Dead imports** (harmless, pending cleanup):
  - Shared.jsx: STEEL_MID, GOLD_LIGHT now unused after DayBtn removal
  - TimeLifeSection.jsx: GOLD_LIGHT unused after non-neg chip
    migration to STEEL_LIGHT; isDayComplete prop received but not
    referenced in body
  - MealBlock.jsx: BORDER imported but unused (pre-existing)
- **Client Info copy:** "Date Started" label may need updating to
  "Date Starting Tracking" per prior spec — not yet addressed.
- **Header** does not match the shared standard used in DOP/PIT —
  no cross-app standardization done.
- **Top tab bar** extends only partway across — needs browser check
  to confirm current state.
- **Calorie AI estimates** call api.anthropic.com with no API key
  wired — estimates silently return null. Consistent with documented
  "no backend, no API keys" state.

### What is NOT verified as working

- All section changes above need Firefox localhost:5175 browser
  verification before commit.
- Whether the "test" user account works in OBT (not confirmed).
- Live behavior of each individual tracking section against spec
  (not recently browser-verified after color pass).

## KEY ARCHITECTURAL FACTS

- React + Vite (npm run dev launches on port 5175)
- localStorage for all state persistence (pre-Supabase migration)
- Class 3 modular structure — components split into files, not a
  monolith
- No backend, no API keys wired
- Login credential matching is case-insensitive (Core Standard v1.8
  Section 8.2 — locked)
- All app code lives at C:\JPG-PROJECTS\ only — never OneDrive
- Storage prefix: `<username-lowercase>_ob6_`; day keys: `day_<YYYY-MM-DD>`
- `dayComplete` prop on all sections = explicit mark
  (`dayCompleteDates.includes(isoForDay(selectedDay))`), not the
  10-field data gate (`isDayComplete`)
- `isDayComplete(dayData)` is still used in two places intentionally:
  (1) gating the Mark Day Complete button, (2) Header's "Required
  Fields Done" pill

## REFERENCED GOVERNING DOCUMENTS

Do not reproduce these documents — reference them by name only.
Doug provides them in Claude.ai chat when needed.

- **Core Standard v1.8** — JPG governance foundation
- **Troubleshooting Guide v3.2** — plain-language app behavior
  reference
- **Doc A — Migration guide** — one-time, archives post-migration
- **Doc B — CAI Desktop Code Operating Manual** — standing
  reference for operating in Desktop Code tab
- **Session Handoff Primer** — uploaded to each new chat session

## SESSION START PROTOCOL

First instruction in every Desktop Code session is always
read-only:

> "Read CLAUDE.md and confirm you understand — do not run any
> commands yet."

Wait for Claude Code to confirm it has read this file and
understood the rules. Only after confirmation, proceed to
development work.

---

*OBT CLAUDE.md — v1.1 — updated 07/25/2026. Section color system
locked; build state refreshed through Group 9 cleanup completion.*
