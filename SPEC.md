# Phase: PatientZalo Tests & Auth Wiring — Specification

**Created:** 2026-06-09
**Ambiguity score:** 0.08 (gate: ≤ 0.20)
**Requirements:** 9 locked

## Goal
Stand up a Vitest + jsdom test harness that mocks the Zalo SDK (`zmp-sdk`) so the suite runs in Node with no Zalo client or live backend, add unit tests covering the auth store, preferences store, `useAuth` sign-in/sign-out flow, and the Axios interceptors, and wire one Gateway call (Ask-Pharmacist) end-to-end behind dev-mode detection — all green via `pnpm test`.

## Background
This repo (`Pharma-PatientZalo`) is a Zalo Mini App (ZMP + Vite + React, dev port 3001) for Vietnamese patients. Current state, grounded in real code:

- **Vitest is installed but unconfigured.** `package.json` declares `vitest@2.1.5` + `@testing-library/react@16.0.1` and a `"test": "vitest run"` script (line 12). `tsconfig.json` already lists `"types": ["vite/client", "vitest/globals"]` (line 19). However `vite.config.mts` has **no `test` block** — there is no `environment: "jsdom"`, no `setupFiles`, and no global test config. There is **zero** test code (`find src -name "*.test.*"` returns nothing) and no `vitest.config.*` or `*.setup.*` files.
- **Zalo SDK is imported at module load.** `src/services/zalo-auth.ts` imports `authorize`, `getAccessToken`, `getUserInfo`, `getPhoneNumber`, `type UserInfo` from `zmp-sdk` (lines 1-7); `src/lib/haptics.ts` imports `vibrate` from `zmp-sdk` (line 1). Importing these under Node/jsdom without a mock pulls in the Zalo client and breaks tests, so `zmp-sdk` must be virtually mocked.
- **Auth store** (`src/store/useAuthStore.ts`) is a persisted Zustand store with `status` (`idle|authenticating|authenticated|error`), `setAuthenticating`, `setAuthenticated`, `setError`, `reset`, and `isExpired()` — where `isExpired` returns `!expiresAt || Date.now() >= expiresAt` (lines 40-43). It persists to `localStorage` under key `pharmalink.auth`. None of this is tested.
- **Preferences store** (`src/store/usePreferences.ts`) holds `fontScale` (`default|large|xlarge`) with `setFontScale`/`cycleFontScale`, and `hapticsEnabled` with `toggleHaptics` (lines 15-34). Persists to `pharmalink.prefs`. Untested.
- **Auth flow** (`src/hooks/useAuth.ts`) `signIn` calls `ensureAuthorized` → `getAccessToken(true)` → `Promise.all([fetchZaloUser, fetchPhoneToken?])` → `loginWithZalo(...)` → `setAuthenticated(...)`, and on throw calls `setError(message)` (lines 25-55). `signOut` calls `clearAccessTokenCache()` + `reset()` (lines 57-60). Untested.
- **Axios interceptors** (`src/services/api.ts`): a request interceptor attaches `Authorization: Bearer <token>` from `useAuthStore.getState().appToken ?? getZaloAccessToken()` (lines 10-17); a response interceptor calls `useAuthStore.getState().reset()` on `error.response.status === 401` (lines 19-27). Untested.
- **Dev-mode detection** exists: `src/services/zalo-auth.ts` exports `isBrowserDevMode()` = `import.meta.env.DEV && !isInZaloClient()` (lines 19-21) and `auth-api.ts` `loginWithZalo` already falls back to `mockLogin` on network error (lines 26-37).
- **Pages render mock/static data.** e.g. `src/pages/ai-chat.tsx` fakes the reply with `await new Promise((r) => setTimeout(r, 900))` plus a hardcoded string (lines 45-55) instead of calling `askPharmacist` from `src/services/api.ts`; `src/pages/drug-search.tsx` filters a local `RESULTS` const (lines 9-34). Only `services/api.ts` (`askPharmacist`, `checkSafety`) and `services/auth-api.ts` (`loginWithZalo`) actually hit the Gateway. The Ask-Pharmacist UI is **not** wired to the real service end-to-end.

## Requirements
1. **Vitest config (jsdom + globals + setup)**: A test environment exists so the suite runs in Node without the Zalo client.
   - Current: `vite.config.mts` has only `plugins`, `resolve.alias` (`@`→`src`), `server.port`, `build`; no `test` key. No setup file exists.
   - Target: Add a `test` block (in `vite.config.mts` via the Vitest/Vite merged config, or a dedicated `vitest.config.ts`) with `environment: "jsdom"`, `globals: true`, and `setupFiles` pointing at `src/test/setup.ts`. The `@`→`src` alias must resolve under test.
   - Acceptance: `pnpm test` boots Vitest in `jsdom` with globals enabled (no per-file `import { describe } from "vitest"` required) and discovers tests under `src/`; running with zero `zmp-sdk` real client present does not error on environment setup.

2. **Zalo SDK (`zmp-sdk`) mocked globally**: Tests never load the real Zalo client.
   - Current: `zalo-auth.ts` and `lib/haptics.ts` import named exports from `zmp-sdk` at module scope; no mock exists.
   - Target: `src/test/setup.ts` registers `vi.mock("zmp-sdk", ...)` (or an equivalent module mock applied via `setupFiles`) exposing stub implementations of at least `authorize`, `getAccessToken`, `getUserInfo`, `getPhoneNumber`, and `vibrate`, returning resolved promises with deterministic dummy values. The mock must satisfy every `zmp-sdk` symbol imported anywhere under `src/`.
   - Acceptance: Importing `src/services/zalo-auth.ts` and `src/lib/haptics.ts` inside a test does not pull in the real Zalo client; calls to the mocked SDK functions return the stubbed values and record calls (spies).

3. **Auth store unit tests**: `useAuthStore` state transitions are verified.
   - Current: No tests for `useAuthStore`.
   - Target: A test file (e.g. `src/store/useAuthStore.test.ts`) covers: `setAuthenticated({user, appToken, expiresAt})` sets `status:"authenticated"` and clears `error`; `reset()` returns all fields to the idle defaults (`status:"idle"`, `user/appToken/expiresAt/error` null); `setError(msg)` sets `status:"error"` + `error`. Store state is reset between tests.
   - Acceptance: Asserting on `useAuthStore.getState()` after each action matches the expected values; tests pass.

4. **`isExpired()` logic tests**: Token-expiry branch is verified.
   - Current: `isExpired` is unverified.
   - Target: Tests assert `isExpired()` is `true` when `expiresAt` is `null`, `true` when `expiresAt <= Date.now()` (past), and `false` when `expiresAt` is comfortably in the future. Time is controlled (e.g. fixed `expiresAt` relative to `Date.now()`, or `vi.useFakeTimers`).
   - Acceptance: All three `isExpired` branches assert correctly and pass.

5. **Preferences store unit tests**: `fontScale` + `haptics` behavior is verified.
   - Current: No tests for `usePreferences`.
   - Target: A test file (e.g. `src/store/usePreferences.test.ts`) covers: `cycleFontScale()` advances `default → large → xlarge → default`; `setFontScale("large")` sets it directly; `toggleHaptics()` flips `hapticsEnabled` from its prior value. State reset between tests.
   - Acceptance: Assertions on `usePreferences.getState()` after each action pass.

6. **`useAuth` sign-in / sign-out flow tests**: The hook orchestration is verified with mocked deps.
   - Current: `useAuth.signIn`/`signOut` untested.
   - Target: Tests mock `@/services/zalo-auth` (`ensureAuthorized`, `getAccessToken`, `fetchZaloUser`, `fetchPhoneToken`, `clearAccessTokenCache`) and `@/services/auth-api` (`loginWithZalo`), then exercise the hook (via `@testing-library/react` `renderHook` or by calling the store-backed logic). Cover: (a) **happy path** — `signIn()` ends with store `status:"authenticated"` and the `user` returned by mocked `loginWithZalo`; (b) **missing token** — when `getAccessToken` resolves `null`, store ends in `status:"error"` with a non-empty message and `loginWithZalo` is **not** called; (c) **sign-out** — `signOut()` calls `clearAccessTokenCache` and leaves store `status:"idle"`.
   - Acceptance: All three `useAuth` scenarios assert on final store state / mock call counts and pass; the real `zmp-sdk` is never invoked.

7. **Axios request-interceptor test (Bearer attach)**: Outgoing requests carry the token.
   - Current: Request interceptor untested.
   - Target: A test (e.g. `src/services/api.test.ts`) drives the request interceptor and asserts that when `useAuthStore` has an `appToken`, the resulting request config has header `Authorization` equal to `Bearer <appToken>`; and when `appToken` is absent it falls back to the mocked `getAccessToken` from `zalo-auth`. The interceptor may be invoked directly or via a mocked adapter — no real network call is made.
   - Acceptance: The asserted `Authorization` header matches `Bearer <token>` for both the store-token and fallback-token cases; test passes with no live HTTP.

8. **Axios response-interceptor test (401 → reset)**: Unauthorized responses clear auth.
   - Current: 401→reset interceptor untested.
   - Target: A test seeds `useAuthStore` into an authenticated state, simulates a rejected response with `error.response.status === 401` through the response interceptor, and asserts `useAuthStore.getState().status === "idle"` (reset ran) and the original error still rejects. A non-401 error (e.g. 500) must **not** reset the store.
   - Acceptance: 401 path resets the store and the promise rejects; 500 path leaves `status` unchanged; test passes.

9. **Wire Ask-Pharmacist to the real Gateway behind dev-mode detection (tested with mocked api)**: One feature is wired end-to-end (mock-tested).
   - Current: `src/pages/ai-chat.tsx` fakes replies with `setTimeout` + hardcoded text and never calls `askPharmacist`.
   - Target: Introduce a thin call path (e.g. a `sendQuestion(question)` helper used by `ai-chat.tsx`) that, when **not** in browser dev-mode (`isBrowserDevMode() === false`), calls `askPharmacist(question)` from `@/services/api` and renders `data.content`; when in dev-mode it returns the existing canned/dev response (no network). A test (e.g. `src/pages/ai-chat.askpharmacist.test.ts` or a `sendQuestion` unit test) mocks `@/services/api.askPharmacist` and `isBrowserDevMode`, and asserts: (a) production-mode path calls `askPharmacist` once and surfaces the mocked `content`; (b) dev-mode path does **not** call `askPharmacist`.
   - Acceptance: With `askPharmacist` mocked, the production-mode branch invokes it exactly once and returns its `content`; the dev-mode branch makes zero calls to it; test passes. No live Gateway is contacted.

## Boundaries
**In scope:**
- Vitest config (`environment: "jsdom"`, `globals: true`, `setupFiles`) + a `src/test/setup.ts` that mocks `zmp-sdk`.
- Unit tests for `useAuthStore` (`setAuthenticated`, `reset`, `setError`, `isExpired`) and `usePreferences` (`fontScale`/`cycleFontScale`/`setFontScale`, `toggleHaptics`).
- `useAuth` `signIn`/`signOut` flow tests with mocked `zalo-auth` + `auth-api`.
- Axios interceptor tests: Bearer attach (request) and 401→reset (response).
- Wiring exactly one Gateway call — **Ask-Pharmacist** (`askPharmacist`) — behind `isBrowserDevMode()`, verified with a mocked `api`.

**Out of scope:**
- Replacing all page mock/static data (`drug-search`, `pharmacy-finder`, `my-health`, `medications`, `prescription-scan`, `home`) with live Gateway data — deferred to a later phase; this phase wires only Ask-Pharmacist.
- Wiring `checkSafety` / drug-safety into the UI — Ask-Pharmacist is the single representative wire-up this phase (drug-safety may substitute only if Ask-Pharmacist proves infeasible; not both).
- Any change to the real Zalo SDK behavior, live Zalo authorization, or a running API Gateway — tests must never require them.
- E2E / integration tests against a real backend, visual/snapshot UI tests, and CI pipeline configuration — not part of this phase.
- Auth-token refresh/rotation logic beyond the existing `isExpired` + cache — no new expiry mechanism is introduced.

## Constraints
- Tests run under **Vitest + jsdom** in Node; `globals: true` so no per-file Vitest imports are required (matches existing `tsconfig` `vitest/globals`).
- `zmp-sdk` is **always mocked** via `setupFiles`; the real Zalo client is never imported in tests.
- No live backend: `axios`/`api` is mocked or its interceptors invoked directly; no real HTTP request leaves the test process.
- Dev-mode is detected through the existing `isBrowserDevMode()` helper; the wired call must be gated on it, not on a new flag.
- No production dependencies added; use only already-installed `vitest`, `@testing-library/react`, and jsdom (provided by Vitest). Package manager is `pnpm` (`pnpm@9.12.0`); the command of record is `pnpm test`.
- TypeScript stays `strict`; test files compile under the existing `tsconfig`.

## Acceptance Criteria
- [ ] `pnpm test` runs Vitest in `jsdom` with `globals: true` and a `setupFiles` mock for `zmp-sdk`; the `@`→`src` alias resolves in tests.
- [ ] No test imports or executes the real `zmp-sdk` client; the SDK mock covers every `zmp-sdk` symbol used under `src/`.
- [ ] `useAuthStore` tests pass for `setAuthenticated`, `reset`, `setError`, and all three `isExpired` branches.
- [ ] `usePreferences` tests pass for `cycleFontScale`, `setFontScale`, and `toggleHaptics`.
- [ ] `useAuth` tests pass for happy-path sign-in, missing-token error path (no `loginWithZalo` call), and sign-out.
- [ ] Request-interceptor test asserts `Authorization: Bearer <token>` for both store-token and `zalo-auth` fallback cases.
- [ ] Response-interceptor test asserts 401 → `useAuthStore` reset (`status:"idle"`) and that a non-401 error does not reset.
- [ ] Ask-Pharmacist is wired behind `isBrowserDevMode()`: production-mode path calls mocked `askPharmacist` once and renders its `content`; dev-mode path makes zero calls.
- [ ] Entire suite is green (`pnpm test` exits 0) with no reliance on a live Zalo client or backend.

## Ambiguity Report
| Dimension          | Score | Min  | Status | Notes |
|--------------------|-------|------|--------|-------|
| Goal Clarity       | 0.93  | 0.75 | PASS   | Single measurable goal: jsdom harness + named test targets + one wired call, all green via `pnpm test`. |
| Boundary Clarity   | 0.90  | 0.70 | PASS   | "Replace all page mocks" + `checkSafety` UI wiring + live backend/Zalo explicitly out of scope. |
| Constraint Clarity | 0.92  | 0.65 | PASS   | zmp-sdk mocked via setupFiles; jsdom+globals; no live HTTP; gate on existing `isBrowserDevMode()`; no new deps. |
| Acceptance Criteria| 0.91  | 0.70 | PASS   | Each requirement has a concrete pass/fail check; suite must exit 0. |
| **Ambiguity**      | 0.08  | ≤0.20| PASS   | Weighted residual ambiguity well under gate. |

## Interview Log
| Round | Perspective     | Question summary | Decision locked |
|-------|-----------------|------------------|-----------------|
| 1     | Researcher      | Does any Vitest config / setup / test already exist? | No — `vite.config.mts` has no `test` block, no `vitest.config.*`, no `*.setup.*`, zero `*.test.*` under `src`. Harness must be created. `tsconfig` already has `vitest/globals`. |
| 2     | Simplifier      | Wire one Gateway call or several? | Exactly one — **Ask-Pharmacist** (`askPharmacist`). drug-safety/`checkSafety` only as a fallback substitute, never both; all other page mocks stay. |
| 3     | Boundary Keeper | Are real Zalo SDK / live backend allowed in tests? | No. `zmp-sdk` mocked via `setupFiles`; `api`/interceptors mocked or invoked directly; gate wiring on existing `isBrowserDevMode()`, no new flag, no new deps. |
| 4     | Failure Analyst | Which auth edge cases must be proven? | `isExpired` null/past/future; `signIn` missing-token → error with no `loginWithZalo` call; response 401 → reset while non-401 (500) does not reset; request interceptor falls back to `zalo-auth` token when store token absent. |

---
*Phase: patientzalo-tests-auth*
*Spec created: 2026-06-09*
