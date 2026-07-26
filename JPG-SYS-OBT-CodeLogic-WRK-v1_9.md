# JPG — OBT CODE LOGIC
## OnBoarding & Tracking — Full App Code Logic and Build Reference
**Document ID:** JPG-SYS-OBT-CodeLogic-WRK-v1.9
**Date:** 07/25/2026 | **Prepared by:** Claude | **State:** WRK
**Classification:** CLASS 1 — CONFIDENTIAL
**Supersedes:** JPG-SYS-OBT-CodeLogic-WRK-v1.8

---

## PURPOSE OF THIS DOCUMENT

This is the single source of truth for everything about the OBT app — logic rules, UI parameters, color values, component decisions, build status, and pending work. One doc, one app, everything in it.

**Update rule:** at the end of every OBT session, add new decisions to the appropriate section before handoff. Nothing about OBT is decided in chat and not recorded here.

**Travels with:**
- JPG-SYS-PRIMER-SessionHandoff-WRK (current version)
- JPG-SYS-Apps-TroubleshootingGuide-WRK (current version)

---

## SECTION A — OBT APP IDENTITY

- **App name:** OnBoarding & Tracking (OBT)
- **Dev port:** 5175
- **Repo:** Doug2752/JPG-OnBoarding-Tracking-App
- **Local folder:** C:\JPG-PROJECTS\JPG-OnBoarding-Tracking-App
- **Framework:** React + Vite, Class 3 modular structure
- **Storage:** localStorage (pre-Supabase)
- **Storage key prefix:** `{username_lowercase}_ob6_{key}` (e.g. `doug_ob6_reflect6`)
- **Test login:** Doug / JPG2026 and Test / JPG2026 (both confirmed in constants.js USERS object — login is case-insensitive)
- **Browser for testing:** Firefox (localhost:5175)
- **Daily-use browser:** Brave (auto-opens on startup — stop Brave before starting dev server)
- **CLAUDE.md:** exists in repo root — updated this session to correct stale "all-black" color intent and Current Build State section.
- **Patch images:** all four LIMITLESS tier patches confirmed present in `public\` — `LIMITLESS_Tier_1_Patch.png` through `LIMITLESS_Tier_4_Patch.png`

**File structure note:** OBT does NOT use a src\ directory. All source files live at the repo root level:
- main.jsx at repo root
- app\OBApp.jsx
- components\ folder at repo root
- utils\ folder at repo root
- services\ folder at repo root

---

## SECTION B — COLOR SYSTEM (LOCKED)

All color constants live in utils\constants.js.

| Constant | Hex | Role | Status |
|---|---|---|---|
| GOLD | #B8860B | Mark Day Complete button, Submit to Coach strip active states, tab bar active, popup borders, Client Info checkmarks. | active |
| GOLD_DARK | #7A6010 | Dark gold variant — RatingButtons default border. | active |
| GOLD_LIGHT | #FDF3D0 | Light gold variant — used in shared styles. | active |
| BG | #F5F5F2 | App background. | active |
| DARK | #1A1A1A | Dark text, nav elements, cover page text, LIMIT\|LESS mark. | active |
| CHARCOAL | #2E2E2E | Used only in styles.js `blockCharcoal`. | active (narrow use) |
| MID | #4A4A4A | Mid-tone text. | active |
| BORDER | #D8D5CF | Table/box borders. | active |
| STEEL | #3A5A78 | TimeLife section color — header, active day button, checkmarks, banners, non-neg chips, Reflect Week 2, Archive reflections indicator, SummaryResults Week 2. | active |
| STEEL_MID | #2E4A64 | Used in Shared.jsx RatingButtons steel branch and styles.js `pmBlock` only. | active (narrow use) |
| STEEL_LIGHT | #E8EEF2 | Steel light background — non-neg chip background in TimeLife. | active |
| GREEN | #2E5A4B | Sleep section color — header, active day button, checkmarks, banners, rating buttons, unit toggles. | active |
| GREEN_LIGHT | #E8F2EE | Used only in styles.js. | active (narrow use) |
| RED | #B02020 | Validation errors, date format error text/border. RESERVED — do not use for section colors. | active |
| BURGUNDY | #7B3055 | Nutrition section color — header, active day button, checkmarks, banners, supp buttons, chips. | active |
| PURPLE | #4A3575 | Alcohol section color — header, active day button, checkmarks, banners, None checkbox accent. | active |
| ORANGE | #7A4418 | Fitness section color — header, active day button, checkmarks, banners, rating buttons. | active |
| DAYS | [1..14] | Never imported anywhere. | **DEAD** |
| MONTHS | 12 names | date.js, ArchiveView. | active |
| ACTIVITIES / ACTIVITY_RATE | — | FitnessSection. | active |
| SUPPLEMENTS | — | SuppAdder. | active |
| NON_NEG_CATS | — | TimeLifeSection. | active |
| PERF_BANDS | — | Dropped in SummaryResults rewrite (GROUP 5). | **DEAD** |
| SLEEP_BANDS | — | Dropped in SummaryResults rewrite (GROUP 5). | **DEAD** |

**Removed prior session:** LOGO_LIGHT and LOGO_DARK — both were dead exports pointing to the same jpglogo.png file. Removed from constants.js.

**NEVER use #B8860B** as a hardcoded hex — use GOLD constant instead.
**NEVER use #B8962E** — deprecated gold, must never appear.
**NEVER use #B8912A** — was incorrectly in OBT constants prior to 07/16/2026.

**Section color assignments (locked 07/25/2026):**
- Client Info = GOLD (#B8860B) — identity/setup section
- Section 01 Nutrition = BURGUNDY (#7B3055)
- Section 02 Alcohol = PURPLE (#4A3575)
- Section 03 Fitness = ORANGE (#7A4418)
- Section 04 Sleep = GREEN (#2E5A4B)
- Section 05 Time & Life = STEEL (#3A5A78)

These color assignments are permanent — each section's color carries forward to all future elements within that section (checkmarks, banners, buttons, active states, rating selections, chips, etc.). White is used instead of section color when an element sits on a section-colored background.

**Cover page specific colors:**
- Cover page background: GOLD (#B8860B)
- Cover page quote box: #8B6508 (darker gold), white text
- Cover page button (Start Today's Entry): background DARK, text GOLD
- Cover page button (Complete/Edit Client Info): transparent background, DARK border and text

**RatingButtons color system (confirmed 07/25/2026):**
- Default (no prop): activeColor=GOLD, activeBorderColor=GOLD_DARK
- Fitness: activeColor={ORANGE}, activeBorderColor={ORANGE}
- Sleep: activeColor={GREEN}, activeBorderColor={GREEN}
- Time & Life PM Check-In: `steel` prop passed — unselected buttons use white border/text on STEEL background; selected uses rgba(255,255,255,0.25) background with white border.

**styles.js section-specific variants (added 07/25/2026):**
- dayTagBurgundy, dayTagPurple, dayTagOrange, dayTagGreen, dayTagSteel — day date pill per section
- chipBurgundy, chipXBurgundy — supplement chip and remove button (Nutrition)
- suppRecentBurgundy, suppRecentItemBurgundy — recent supplement list (Nutrition)
- copyBtnBurgundy — Add Snack and Add Supplement buttons (Nutrition)

---

## SECTION C — UI PARAMETERS (LOCKED)

### Cover Page (built 07/20/2026, border added 07/23/2026, dead code removed 07/25/2026)
- **File:** components\CoverPage.jsx
- **Renders:** once per session immediately after login, before the main app shell. Session-only state (`showCover`) — not persisted to storage. Reappears fresh on every new login.
- **Font:** Rajdhani, loaded via a Google Fonts `<link>` injected into document.head on mount via useEffect. Cleanup function present with null-parent guard: `if (link.parentNode) link.parentNode.removeChild(link)`.
- **Dead code removed (07/25/2026):** PATCH_SRC constant and patchOk state removed. useState import dropped (now only useEffect imported).
- **Border:** inner content wrapper has `border: '6px solid #000'`, `margin: '16px'`, `padding: '24px'`, `boxSizing: 'border-box'` — creates a bold black frame inside the gold background.
- **Layout (top to bottom):**
  1. Logo — jpglogo.png, width 340px, `mixBlendMode: multiply`
  2. "Welcome, {firstName}" — fontSize 1.6rem, fontWeight 700, DARK
  3. Status line — "Day {currentDay} of 14 — {daysComplete} {Day/Days} Complete" — fontSize 1.1rem, fontWeight 600, DARK
  4. LIMIT|LESS block — centered column. "LIMIT" and "LESS" as separate spans with 4px-wide DARK divider bar. Tagline: "Every day is a chance to exist outside of boundaries." (italic, DARK)
  5. Quote box — background #8B6508, white text, borderRadius 10px
  6. Two-button row — "Complete Client Info" or "Edit Client Info" (left, transparent) + "Start Today's Entry" (right, DARK bg, GOLD text)

### BrandBar
- **File:** components\BrandBar.jsx
- Date picker removed entirely (07/20/2026). Never-Twice pill. Logout button.
- **Logo:** jpglogo.png with `mixBlendMode: multiply` for white bg removal on dark nav bar.

### Tab Bar (main section navigation)
- 8 tabs: Client Info | Nutrition | Alcohol | Fitness | Sleep | Time & Life | Reflection | Summary Results
- **Reflection tab label** — full word "Reflection" (changed from "Reflect" 07/25/2026).
- Active tab: GOLD background, black text.

### Day Button Strip (14-day picker — duplicated per section, no shared component)
- Active day button background = **section color** (not GOLD). Inactive = #333.
- Section-specific active colors confirmed in code:
  - Nutrition: BURGUNDY
  - Alcohol: PURPLE
  - Fitness: ORANGE
  - Sleep: GREEN
  - TimeLife: STEEL

### selectedDay — Global Shared State (confirmed 07/25/2026)
- **Owner:** OBApp.jsx — single `useState(1)` at line 101.
- **Passed to all five sections** via `dayProps` spread — `selectedDay` and `onDaySelect: setSelectedDay`.
- **Switching tabs preserves the selected day automatically.** No per-section day state exists. A client on Day 4 in Nutrition who switches to Fitness will land on Day 4 in Fitness automatically.
- **Override:** any section's day button calls `onDaySelect(n)` which updates shared state for all sections.
- `loadDayData(selectedDay)` runs in a useEffect keyed on `[selectedDay, startDate]` — dayData reloads from storage whenever selectedDay changes.

### Client Info form (rebuilt 07/20/2026, updated through 07/25/2026)
- **File:** components\ClientInfo.jsx
- **Phone field:** auto-formats to (XXX) XXX-XXXX pattern as user types. formatPhone helper defined in component. Placeholder: "(555) 555-5555".
- **Email field:** type="email" for browser-native validation and correct mobile keyboard. Placeholder: "name@example.com".
- **Date Started field:** auto-formats to MM/DD/YYYY as user types. formatDate helper defined in component. Placeholder: "MM/DD/YYYY". Existing isValidDate validation and error message unchanged.

### Submit to Coach Strip (TimeLifeSection, below Mark Day Complete)
- **Five display states** (evaluated top to bottom, first match renders):
  - STATE 1 (w2Sent): grey strip — "✓ Week 1 and Week 2 submitted to coach"
  - STATE 2 (w2Submitted && !w2Sent): gold strip — "WEEK 2 REFLECTION SUBMITTED" + Submit Week 2 to Coach button
  - STATE 3 (w1Sent && !w2Submitted): grey strip — "✓ Week 1 submitted to coach" + countdown to final submission
  - STATE 4 (w1Submitted && !w1Sent): gold strip — "WEEK 1 REFLECTION SUBMITTED" + Submit Week 1 to Coach button
  - STATE 5 (default): grey strip — countdown to first submission
- **Two-phase submission model (locked):**
  - Week 1 submission: after Reflect 1 (Day 7) submitted → sends Days 1–7 data + Reflect 1 answers
  - Week 2 submission: after Reflect 2 (Day 14) submitted → sends Days 8–14 data + Reflect 2 answers
- **Backend:** console.log only — no real transmission. Backend slots in at the console.log site in onSubmitToCoach.
- **Storage key:** coach_submissions (`{ w1Sent: boolean, w2Sent: boolean }`)
- **Payload shape:** `{ week, submittedAt, clientInfo, days: [{day, iso, data}], reflection: {w*_keys} }`

---

## SECTION D — STORAGE KEYS (COMPLETE LIST)

All keys include the `{username_lowercase}_ob6_` prefix.

| Key | Type | Description |
|---|---|---|
| clientInfo | object | Client Info form fields |
| neverTwiceRead | boolean | Never-Twice pill read/unread state |
| obt_day_complete | list (ISO strings) | Days marked complete |
| obt_arch | list (ISO strings) | All days touched (any field saved) — write-only, ArchiveView reads dayCompleteDates |
| reflect_submissions | array | `[{week: number, date: ISO}]` — submitted reflection records |
| reflect_popup_seen | object | `{w1: boolean, w2: boolean}` — popup shown flags |
| coach_submissions | object | `{w1Sent: boolean, w2Sent: boolean}` |
| instrSeen6 | boolean | Instructions panel seen flag |
| reflect6 | object | All 8 reflect answer fields + additional (w1_/w2_ prefixed) |
| recentSupps6 | array | Recent supplements for SuppAdder suggestions |
| calEst6 | object | AI calorie estimates per day |
| sleepUnits6 | string | awakeUnit toggle ('min'/'hrs') |
| day_{ISO} | object | Full per-day data: `{nutrition, alcohol, fitness, sleep, timelife}` |

---

## SECTION E — isDayComplete LOGIC (module-level pure function, OBApp.jsx)

**Must remain module-level.** No hooks, no dependencies. Called from multiple places.

**dayComplete prop derivation (changed 07/25/2026):** `dayComplete` passed to all section components is now derived from `dayCompleteDates.includes(isoForDay(selectedDay) || '')` — NOT from `isDayComplete(dayData)`. This means the section lock reflects whether the user has explicitly marked the day complete. `isDayComplete()` is only used inside `onMarkDayComplete()` to gate the button. This fixes the unlock bug where unlocking a fully-filled day would immediately re-lock.

**Ten required gates (all must pass):**

1. **Nutrition:** am AND midday AND pm non-empty
2. **Alcohol:** alcoholNone === true OR beer OR mixed OR otherAlc non-empty
3. **Fitness:** if activity is not None/Rest — duration AND intensity required. None or Rest = auto-pass.
4. **Sleep:** bedtime, fallAsleep, wakeTime, timesUp, quality all non-empty. durationAwake required UNLESS timesUp === '0' or 0 (timesUpIsZero exception).
5. **Work Hours:** workHoursNum non-empty, UNLESS workSchedule === 'Retired' (Retired auto-passes).
6. **Screen Time Social Media:** screenSocialNone === true OR (screenSocialHrs OR screenSocialMins) non-empty.
7. **Screen Time Other:** screenOtherNone === true OR (screenOtherHrs OR screenOtherMins) non-empty.
8. **PM Check-In rating:** non-empty.
9. **Tomorrow's One Thing:** non-empty.
10. (Note: PIT Time is NOT required for Day Complete — pitNone or pitHrs/pitMins are informational only.)

**Mark Day Complete button is always enabled** — errors surface via red borders and error panel, not a disabled button state.

---

## SECTION F — DAY DATA SHAPE (per day_{ISO} key)

```js
{
  nutrition: { am, midday, pm, snacks: [], suppLog: [], addl },
  alcohol:   { beer, mixed, otherAlc, alcoholNone, notes, addl },
  fitness:   { activity, activityOther, duration, intensity, notes, addl },
  sleep:     { bedtime, fallAsleep, wakeTime, timesUp, durationAwake,
               quality, sleepScore, environment, totalHrs, addl },
  timelife:  { workSchedule, workHoursNum, nonNegList: [], _nonNegPending,
               screenSocialHrs, screenSocialMins, screenSocialNone,
               screenOtherHrs, screenOtherMins, screenOtherNone,
               familyTimeNone, familyTimeHrs, familyTimeMins,
               pitHrs, pitMins, pitNone, mood, rating, oneThing, addl }
}
```

**Note:** Section keys only present if that section was saved. A partially-filled day may have only some keys.

---

## SECTION G — ARCHIVE NAVIGATION (built 07/25/2026)

- **dayForIso(iso):** module-level helper in OBApp. Loops days 1–14, returns day number where `isoForDay(n) === iso`. Returns null if iso falls outside current program window.
- **onViewDay(iso):** resolves day number via dayForIso, null-guards, calls setSelectedDay(n) + setView('today'). Clicking a completed day row in Archive navigates to that day in read-only locked state (Nutrition section default).
- **onViewReflect(week):** sets selectedDay to 7 (Week 1) or 14 (Week 2), sets section to 'reflect', sets view to 'today'.
- **Null guard behavior:** ISO dates outside the program window call dayForIso → null → no navigation.
- **Vitest coverage:** 9 tests in tests\archiveNav.test.js. All passing.

---

## SECTION H — SUBMIT TO COACH (built 07/25/2026)

See Section C for full state machine. Key implementation notes:

- **onSubmitToCoach(week)** in OBApp: async, loads clientInfo + reflect6, walks day range via startPlusDay/loadDay, assembles payload, console.logs, persists coach_submissions.
- **No startDate guard:** if startDate empty, startPlusDay returns null, days array is empty — graceful degradation.
- **Payload is backend-ready:** shape is flat and query-friendly. Backend wires in at the console.log site.

---

## SECTION I — SCREEN TIME TWO-BOX INPUTS (built 07/25/2026)

- **Screen Time Social Media:** keys `screenSocialHrs` (number, 0–24) and `screenSocialMins` (number, 0–59). None checkbox key `screenSocialNone`.
- **Screen Time Other:** keys `screenOtherHrs` (number, 0–24) and `screenOtherMins` (number, 0–59). None checkbox key `screenOtherNone`.
- Old keys `screenSocial` and `screenOther` (free-text strings) are retired and no longer written or read.
- **SummaryResults fixed (07/25/2026):** weekStats and DayGrid both updated to read the new two-box keys. Displays 'None' when None checked, 'Xh Ym' format when hours/minutes entered, '—' when empty.
- **Checkmarks fixed (07/25/2026):** Screen Time Social Media checkmark added (was entirely missing). Screen Time Other checkmark updated to read live keys. Both now correctly show ✓ in STEEL when satisfied.

---

## SECTION J — SLEEP timesUpIsZero EXCEPTION (built 07/25/2026)

- If `timesUp === '0'` or `timesUp === 0`, the Awake Duration field is hidden entirely in SleepSection and not required by isDayComplete.
- `timesUpIsZero` derived in both SleepSection.jsx (for UI) and isDayComplete (for gate logic) — consistent.
- **Grid fix (07/25/2026):** the 3-column grid now drops to 2 columns when timesUpIsZero is true — `gridTemplateColumns: timesUpIsZero ? '1fr 1fr' : '1fr 1fr 1fr'`. Visual gap eliminated.

---

## SECTION K — SECTION COLOR PASS — STATUS (07/25/2026 — COMPLETE)

**Nutrition (BURGUNDY) — COMPLETE ✓**
- Section header: blockBurgundy ✓
- Active day button: BURGUNDY ✓
- dayComplete banner: BURGUNDY ✓
- AM/Midday/PM checkmarks: BURGUNDY ✓
- Use Same Supplements button: BURGUNDY ✓
- SuppAdder chip/chipX/suppRecent/suppRecentItem: chipBurgundy variants ✓
- Add Snack / Add Supplement buttons: copyBtnBurgundy ✓
- Day date pill: dayTagBurgundy ✓
- SuppAdder Add ✓ button, meal header, confirmation panel: BURGUNDY ✓

**Alcohol (PURPLE) — COMPLETE ✓**
- Section header: blockPurple ✓
- Active day button: PURPLE ✓
- dayComplete banner: PURPLE ✓
- Beer/Mixed/Other checkmarks: PURPLE ✓
- Day date pill: dayTagPurple ✓
- None checkbox: accentColor PURPLE ✓

**Fitness (ORANGE) — COMPLETE ✓**
- Section header: blockOrange ✓
- Active day button: ORANGE ✓
- dayComplete banner: ORANGE ✓
- Activity/Duration/Intensity checkmarks: ORANGE ✓
- Intensity RatingButtons: activeColor/activeBorderColor ORANGE ✓
- Day date pill: dayTagOrange ✓
- infoBox on no-startDate branch: S.infoBoxOrange ✓ (fixed this session — Item 54 closed)

**Sleep (GREEN) — COMPLETE ✓**
- Section header: blockGreen ✓
- Active day button: GREEN ✓
- dayComplete banner: GREEN ✓
- 6 field checkmarks (Bedtime, Fall Asleep, Wake Time, Times Up, Awake Duration, Sleep Quality): GREEN ✓
- Sleep Quality RatingButtons: activeColor/activeBorderColor GREEN ✓
- Day date pill: dayTagGreen ✓
- InputWithToggle unitColor: GREEN ✓ (PM, AM, min, hrs buttons all GREEN)

**Time & Life (STEEL) — COMPLETE ✓**
- Section header: blockSteel ✓
- Active day button: STEEL ✓
- dayComplete banner: STEEL ✓
- Non-neg chips: STEEL/STEEL_LIGHT variants ✓
- 4 field checkmarks (Screen Social, Screen Other, PM Check-In, Tomorrow's One Thing): STEEL ✓
- Day date pill: dayTagSteel ✓
- 4 None checkboxes: accentColor STEEL ✓
- PM Check-In RatingButtons: steel prop — unselected white border/text, selected white highlight ✓
- PM Check-In score box: white border ✓
- TODAY label: white ✓
- Mark Day Complete button: GOLD (intentional — universal action element)
- Submit to Coach strip: GOLD (intentional)

**Shared components:**
- RatingButtons: activeColor/activeBorderColor props wired in all callers ✓
- InputWithToggle: unitColor prop — GREEN in Sleep, GOLD default elsewhere ✓
- styles.js: all section-specific variants added ✓

---

## SECTION L — VITEST TEST INFRASTRUCTURE

**OBT test file:** tests\archiveNav.test.js — 9 tests, all passing.

Test groups:
- dayForIso (5 tests): confirms correct day numbers returned and null for out-of-window dates
- onViewDay (2 tests): confirms correct setSelectedDay/setView calls and null guard
- onViewReflect (2 tests): confirms week 1→day 7 and week 2→day 14 routing

**Run command:** npm test

---

## SECTION M — OPEN BUILD ITEMS

### GROUP 8 — UI polish (NOT YET BUILT)
- Item 30 — Instructions panel copy pass — ALL HELD as one combined pass:
  - Instructions panel Summary Results section still references removed "performance score" / "performance band" language
  - Remove "individualized plan" — appears twice (Note from Doug, Overview)
  - Full grammar/punctuation pass across all instructions — Doug to read full panel first
  - Replace judgment sentence with: "It is not about judgment. It is about giving yourself — and your coach — an accurate picture of one of the most impactful variables in your performance."
  - Original three stale items: Section 04 manual sleep hours wording, Section 05 Add button wording, Section 05 Yesterday's One Thing wording
- Item 31 — Streak badge logic — confirmed absent

### GROUP 9 — Known bugs and dead code (remaining)
- Item 39 — obt_arch — confirmed still write-only; ArchiveView reads dayCompleteDates instead. Intentional until ArchiveView reads it directly.
- Item 41 — Login "Stay logged in" checkbox — still unwired. Post-Supabase.
- Item 42 — Nutrition AI calorie estimate — non-functional, missing auth headers. Post-Supabase.
- Item 44 — CI_REQUIRED duplication risk — both OBApp.jsx and ClientInfo.jsx define it independently. Currently in sync. Shared utils module is the long-term fix. Post-Supabase.
- Item 46 — Legacy alcohol data — old saved days storing otherNone key are orphaned. Post-Supabase migration.
- Item 47 — workHoursNum stored as string — isDayComplete handles correctly, true numeric coercion is future cleanup.
- Item 55 (PARTIAL) — Two new dead imports introduced during Item 55 cleanup: `STEEL` in Shared.jsx (imported, never used in body) and `GOLD_DARK` in TimeLifeSection.jsx (imported, never used in body). Low priority cleanup pass needed.

### Closed this session:
- Item 32 — familyTimeNone: resolved.
- Item 33 — Header dead props — DONE ✓
- Item 37 — DayBtn / SummaryBtn — DONE ✓
- Item 38 — LOGO_LIGHT / LOGO_DARK — DONE ✓
- Item 40 — STEEL_MID dead import in TimeLifeSection — DONE ✓
- Item 43 — CoverPage PATCH_SRC / patchOk — DONE ✓
- Item 45 — CoverPage font useEffect cleanup — DONE ✓
- Item 48 — CLAUDE.md Current Build State updated — DONE ✓
- Item 49 — SummaryResults screen-time regression — DONE ✓
- Item 50 — Screen time checkmarks — DONE ✓
- Item 51 — Sleep grid gap — DONE ✓
- Item 52 — isDayComplete stale comment — DONE ✓
- Item 53 — AlcoholSection infoBox stale copy — DONE ✓
- Item 54 — FitnessSection infoBox color (S.infoBoxOrange) — DONE ✓
- Item 55 (partial) — Dead imports Shared.jsx GOLD_LIGHT/STEEL_MID, TimeLifeSection.jsx GOLD_LIGHT, MealBlock.jsx BORDER — all removed. Two new dead imports remain (see above).
- Item 56 — isDayComplete dead prop in TimeLifeSection — DONE ✓

### Post-Supabase (do not build)
- Streak persistence, coach-facing archive, legal agreement gating, coach data transmission backend, SMS reminder, welcome name from registered profile

### Cross-app / future
- Tier/patch rendering system across DOP, PIT, OBT — needs transparent-background source art

---

## SECTION N — KNOWN DECISIONS AND CONSTRAINTS

- **No src\ directory** — all source at repo root. Never use src\ paths in Claude Code prompts for OBT.
- **Logo file** — must be 449KB jpglogo.png. Has white background baked in — requires mix-blend-mode: multiply when placed on non-white background.
- **Patch PNG files** — all four LIMITLESS tier patches have white background baked in. mix-blend-mode: multiply is NOT safe for these (also removes design-white). Real fix requires transparent-background source files.
- **Storage key prefix** — `{username_lowercase}_ob6_{key}`.
- **isDayComplete is a module-level pure function** — must remain module-level, no hooks, no dependencies.
- **dayComplete prop** — derived from `dayCompleteDates.includes(isoForDay(selectedDay) || '')`, NOT from isDayComplete(). isDayComplete() gates the Mark Day Complete button only.
- **Mark Day Complete button is always enabled** — error panel and red borders communicate missing fields instead of a disabled state.
- **attempted state** — dayProps-level attempted drives the five tracking sections. ReflectSection uses its OWN independent local attempted state per week — NOT the shared dayProps attempted flag.
- **Reflect submission does not clear field text** — locked decision: submitted answers remain visible (disabled/read-only) rather than being cleared.
- **Reflect popup trigger uses exact Day 7 / Day 14 ISO match** — not "any 7 completed days."
- **Date picker removed entirely (07/20/2026).** Start date sets once automatically on first "Start Today's Entry" click. Manual correction via Client Info Date Started field only.
- **Cover page shows once per session** — session-only React state, no storage persistence.
- **Default landing section is 'nutrition'** — Client Info reached via cover page button or tab bar only.
- **CI_REQUIRED = 12 fields** — fullName, dateStarted, phone, email, occupation, primaryGoal, nonNeg, hobbies, fitnessActivity, eatingHabits, sleepPatterns, injuries. Preferred name, goal2, goal3, additional are optional.
- **Non-Neg list** — auto-commits on category selection (no Add button). Per-chip inline note field (optional). Dropdown label widened to 160px to prevent truncation.
- **Yesterday's One Thing checkbox** — removed from TimeLifeSection.
- **Total Sleep Hours** — read-only auto-calculated display. Manual entry removed.
- **SummaryResults screen-time** — fixed 07/25/2026. Reads screenSocialHrs/Mins/None and screenOtherHrs/Mins/None. Displays 'None', 'Xh Ym', or '—'.
- **Calendar date as storage key** — all per-day data keyed by ISO date.
- **Fitness Notes** — optional, single-line text input.
- **familyTimeNone** — not in day default shape. Handled inline via || false.
- **Reflect tab** — debounced save (400ms) on free-text answer fields. Submit action is synchronous.
- **Cover page border:** 6px solid black border on inner content wrapper. margin: 16px, padding: 24px, boxSizing: border-box.
- **Fitness None and Rest** — selecting either hides Duration, Intensity, and Notes entirely. Neither triggers duration/intensity requirement in isDayComplete.
- **Work Schedule / Work Hours split:** workSchedule (dropdown) and workHoursNum (numeric write-in) are separate fields. Retired selection hides Work Hours and satisfies Day Complete without a value.
- **Screen Time inputs** — two-box pattern (hours + minutes). Keys: screenSocialHrs, screenSocialMins, screenOtherHrs, screenOtherMins. Old flat string keys screenSocial and screenOther are retired.
- **Preferred Name** — optional field in Client Info. Not in CI_REQUIRED. key: preferredName.
- **Alcohol section** — otherNone retired. Now: Other (key: otherAlc, standalone text field) + None checkbox (key: alcoholNone, right of date label).
- **None checkbox alignment** — all four Time & Life None checkboxes use label fixed at flex: '0 0 220px', left-aligned with gap: 12.
- **timesUpIsZero exception** — if timesUp === '0' or 0, Awake Duration is hidden and not required. Grid drops to 2 columns when hidden.
- **Submit to Coach** — two-phase model locked: Week 1 sends Days 1–7 + Reflect 1, Week 2 sends Days 8–14 + Reflect 2. Backend = console.log only until Supabase.
- **Reflection tab label** — full word "Reflection."
- **Archive row navigation** — clicking completed day rows navigates to that day (read-only, Nutrition section). Clicking reflection rows navigates to Day 7 or 14 in Reflect tab. ISO dates outside program window do nothing (null guard).
- **Relationship Time / PIT input alignment** — grid container uses alignItems: start; both labelSm notes use minHeight: 30px so Hours/Minutes inputs align horizontally.
- **Client Info phone format** — auto-formats to (XXX) XXX-XXXX as user types.
- **Client Info email** — type="email" for native browser validation.
- **Client Info date** — auto-formats to MM/DD/YYYY as user types.
- **selectedDay is globally shared across all five sections** — owned by OBApp as a single useState(1), passed to all sections via dayProps spread. Switching tabs preserves the selected day automatically. No per-section day state exists. onDaySelect prop calls setSelectedDay in OBApp — any section's day button click updates the shared state for all sections.
- **30-Day Cycle Architecture (locked 07/26/2026):**
  - All client cycles are exactly 30 days anchored to the client's chosen start date — not the calendar month
  - Client sets their start date when they are ready to begin tracking (not automatic on first login)
  - Period close fires on day 30. New cycle starts day 31. No exceptions.
  - No calendar month alignment, no app suggestion to align to the 1st, no client choice about cycle length
  - Months with 28, 29, 31 days are irrelevant — the cycle is always 30 days
  - Start date is shared across DOP, PIT, and OBT — one value, stored under `{username}_jpg_start_date`
  - Coach can adjust a client's start date if needed
  - Staggered start dates across clients is intentional — distributes coaching workload evenly across the month
  - Post-Supabase: start date moves to shared backend field

---

## VERSION HISTORY

| VERSION | DATE | CHANGES |
|---|---|---|
| v1.0 | 07/17/2026 | Initial version. |
| v1.1 | 07/18/2026 | Header rebuilt. ArchiveView added. Color system expanded. Full 34-item backlog added. |
| v1.2 | 07/19/2026 | GROUP 1 storage restructure. GROUP 2/3 partial. |
| v1.3 | 07/19/2026 | GROUP 2 and GROUP 3 completed. |
| v1.4 | 07/20/2026 | GROUP 4 (Reflect tab) completed. GROUP 5 (Summary Results) completed. Cover Page built. BrandBar date picker removed. ClientInfo rebuilt — 11 required fields. Dead code audit. |
| v1.5 | 07/23/2026 | No-start-date message updated in all five section components. Cover page 6px black border frame added. ClientInfo: phone/email split, Desired Outcome labels, field note updates. CI_REQUIRED synced in both files. |
| v1.6 | 07/23/2026 | Fitness None/Rest behavior. Sleep Quality and Intensity labels. Non-Neg dropdown. Work Schedule/Hours split. Four None checkboxes in Time & Life. Screen Time Social Media added to isDayComplete. Alcohol restructured. ClientInfo Full Name and Preferred Name. Supplements prior day button. Error panel 10 lines. |
| v1.7 | 07/25/2026 | Archive row navigation built. Vitest test infrastructure (9 tests). Screen Time two-box inputs. Sleep timesUpIsZero exception. Submit to Coach UI. Section color system locked. Reflection tab label updated. SummaryResults screen-time regression identified. |
| v1.8 | 07/25/2026 | Section color pass completed for all five sections. Section-specific dayTag, chip, copyBtn, suppRecent variants added to styles.js. dayComplete prop fixed to derive from dayCompleteDates list (not isDayComplete). SummaryResults screen-time regression fixed. Screen time checkmarks fixed. Sleep grid gap fixed. Client Info phone/email/date auto-format. Group 9 cleanup: dead Header props, DayBtn/SummaryBtn, LOGO_LIGHT/LOGO_DARK, CoverPage dead code, font useEffect cleanup, stale comments and copy. New Group 9 items 54–56 added. CLAUDE.md updated. |
| v1.9 | 07/25/2026 | Items 54, 55 (partial), 56 closed. FitnessSection infoBox corrected to S.infoBoxOrange. Dead imports removed from Shared.jsx, TimeLifeSection.jsx, MealBlock.jsx. isDayComplete dead prop removed from TimeLifeSection. Two new dead imports identified (STEEL in Shared.jsx, GOLD_DARK in TimeLifeSection.jsx) — logged as remaining Item 55 cleanup. selectedDay shared-state architecture documented in Section C and Section N. |

---

*JPG-SYS-OBT-CodeLogic-WRK-v1.9 | Jones Performance Group LLC | CONFIDENTIAL | 07/25/2026*
