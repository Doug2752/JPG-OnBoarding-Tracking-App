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

## CURRENT BUILD STATE

**What is built:**
- Class 3 modular structure
- Working login: Doug / JPG2026
- 14-day tracking metrics structure (Fuel / Output / Recovery /
  Processing categories, daily subjective scoring)

**What is NOT verified as working:**
- Whether the "test" user account works in OBT (not confirmed —
  verify before assuming)
- Live behavior of each individual tracking section against spec
  (not recently browser-verified)

**Known issues (flagged, not fixed):**
- Header does not match the standard shared across DOP and PIT
- Section coloring inconsistent (sections 1–3 gold, 4–5 blue,
  rest black; intended standard is all-black)
- Missing centered "14-Day Tracking and Onboarding" title at top
- Top tab bar is undersized, only extends ~half page width
- "Reflect" tab click locks out all other tabs — confirmed
  functional bug
- Copy edits pending in Client Info ("Date Starting" → "Date
  Starting Tracking", "Goals" → "Desired Outcomes", etc.)
- File name shown at top of app screen — not CS-compliant

## KEY ARCHITECTURAL FACTS

- React + Vite (npm run dev launches on port 5175)
- localStorage for all state persistence (pre-Supabase migration)
- Class 3 modular structure — components split into files, not a
  monolith
- No backend, no API keys wired
- Login credential matching is case-insensitive (Core Standard v1.8
  Section 8.2 — locked)
- All app code lives at C:\JPG-PROJECTS\ only — never OneDrive

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

*OBT CLAUDE.md — v1.0 initial — created for Desktop Code migration
pilot. Update as build state or working rules evolve.*