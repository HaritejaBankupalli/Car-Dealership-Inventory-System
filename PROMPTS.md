# PROMPTS.md

This file logs the AI-assisted portions of building the Car Dealership
Inventory System, as required by the kata's AI Usage Policy. It captures
the prompts used and a summary of what the AI (Claude, via Claude Code /
claude.ai) produced at each stage. Full verbatim transcripts are long;
this log preserves the substance of each exchange so the reasoning is
auditable.

---

## 1. Planning the tech stack

**Prompt:**
> I'm doing a TDD kata: a full-stack Car Dealership Inventory System.
> Backend needs Node/TS or Python or Ruby, a real database (not
> in-memory), JWT auth, REST endpoints for auth + vehicles + inventory.
> Frontend needs HTML5/CSS3/Tailwind/React. I need TDD with a visible
> Red-Green-Refactor commit history, AI co-authorship trailers on
> relevant commits, and a full README + PROMPTS.md + test report.
> Help me plan the folder structure and dependency choices.

**What I used it for:** Deciding between Express vs NestJS (chose Express
for simplicity given the kata's scope), and between better-sqlite3 vs a
full Postgres/Docker setup (chose better-sqlite3 — a real, file-backed
SQL database that satisfies "not in-memory" without requiring the grader
to stand up a separate DB server). Also settled on Vite instead of
Create React App for the frontend build.

---

## 2. Backend schema and database layer

**Prompt:**
> Draft a SQLite schema for `users` (id, name, email, password, role)
> and `vehicles` (id, make, model, category, price, quantity, year,
> image_url) with sensible constraints, using better-sqlite3.

**What I used it for:** Initial `CREATE TABLE` statements and the
`database.js` connection module, including the idea of switching to a
separate `test-database.sqlite` file when `NODE_ENV=test`. I manually
added the `CHECK` constraints (non-negative price/quantity, role enum)
and WAL journal mode.

---

## 3. Auth: tests first, then implementation

**Prompt:**
> Write Supertest specs for POST /api/auth/register and
> POST /api/auth/login covering: successful registration (customer and
> admin), missing fields, short password, duplicate email, successful
> login returning a JWT, wrong password, and unknown email. Don't
> implement the routes yet — I want these to fail first (TDD red step).

**What I used it for:** Generated the initial test skeletons in
`auth.test.js`. I reviewed and adjusted a few assertions (e.g. checking
that `password` is never included in the response body) before running
them to confirm the RED state.

**Follow-up prompt:**
> Now implement userModel.js, authMiddleware.js, authController.js and
> authRoutes.js so all of those tests pass. Use bcryptjs for hashing and
> jsonwebtoken for tokens, 2h expiry.

**What I used it for:** Got the bcrypt salt-round setup and JWT signing
boilerplate. I adjusted status codes (400 vs 401 vs 409) myself to match
REST conventions and to keep them consistent with the vehicle endpoints.

---

## 4. Vehicle inventory: tests first, then implementation

**Prompt:**
> Write Supertest specs for the vehicle endpoints: auth-required on all
> routes, POST validation (required fields + negative price rejected),
> GET listing, GET /search with make/model/category/price-range filters,
> PUT update (incl. 404 case), DELETE restricted to admins, POST
> purchase decreasing quantity (incl. insufficient-stock 409), POST
> restock restricted to admins.

**What I used it for:** Generated the bulk of `vehicles.test.js`. I added
the specific price-range boundary test values myself after reviewing the
generated cases.

**Follow-up prompt:**
> Implement vehicleModel.js (including a dynamic search() using
> parameterized queries, not string interpolation) and
> vehicleController.js/vehicleRoutes.js to make all of those pass.
> Remember /search must be registered before /:id.

**What I used it for:** Got the dynamic WHERE-clause builder for search
and the CRUD/purchase/restock methods. I double-checked that every
parameter is passed through `db.prepare(...).run(...params)` rather than
interpolated into the SQL string, to avoid SQL injection.

---

## 5. Frontend scaffolding

**Prompt:**
> Scaffold a Vite + React frontend with Tailwind CSS v3 (classic config,
> not v4), react-router-dom, axios, and lucide-react icons. I want an
> AuthContext backed by localStorage, an axios instance with a request
> interceptor that attaches the JWT, Login/Register pages, a Navbar that
> changes based on auth state, and a ProtectedRoute wrapper.

**What I used it for:** The initial `AuthContext.jsx`, `client.js`
interceptor pattern, and page/component JSX layout. I adjusted the
"register as admin" checkbox on the sign-up form myself (added purely
for demo/grading convenience, since there's no separate admin-invite
flow in this kata).

---

## 6. Dashboard, search, and admin management UI

**Prompt:**
> Build a Dashboard page that lists vehicles as cards (make/model,
> price, category, year, stock count), a SearchBar with make/model/
> category/min-max price filters hitting GET /api/vehicles/search, a
> Purchase button that's disabled at zero stock, and — for admin users
> only — Add/Edit/Delete/Restock controls using a shared modal form.

**What I used it for:** Drafted `VehicleCard.jsx`, `SearchBar.jsx`,
`VehicleFormModal.jsx` and `Dashboard.jsx`. I hand-tuned the responsive
grid breakpoints, empty-state and loading-state messaging, and the
Tailwind brand color palette (`tailwind.config.js`) to move away from
generic Tailwind blue.

---

## 7. Test coverage review

**Prompt:**
> Run the full Jest suite with coverage and tell me if there are any
> obviously untested branches worth adding tests for before I stop.

**What I used it for:** Sanity-checked the coverage report (91%+
statements) and confirmed the remaining uncovered lines were minor
error-branches (e.g. the generic 500 handler) not worth over-testing for
a kata of this scope.

---

## 8. README and documentation

**Prompt:**
> Help me draft a README.md with project overview, setup instructions
> for both backend and frontend, API endpoint reference, and a "My AI
> Usage" section reflecting honestly on how AI was used throughout.

**What I used it for:** Structure and first draft of the README; I
edited the "My AI Usage" reflection to accurately describe the actual
division of labor between AI-assisted scaffolding and my own review/
adjustment work.

---

## 9. Node 24 pure JS/WASM SQLite adapter implementation

**Prompt:**
> Debug native better-sqlite3 C++ build errors on Node 24 environment, replace native binding with pure JavaScript/WASM SQLite adapter, run full test suite, and ensure clean server startup.

**What I used it for:** Designed `sqliteWorkerAdapter.js` using `sql.js` and `worker_threads` with `SharedArrayBuffer` & `Atomics.wait` for synchronous WASM database access. Updated `database.js` to eliminate C++ compilation requirements, verified all 26 Jest unit and integration tests passed cleanly, and started the application servers.

---

## Reflection

Across this project, AI was used heavily for **first-draft generation**
of boilerplate-heavy code (Express routes, JWT/bcrypt wiring, React
component scaffolding, Tailwind config) and for **brainstorming edge
cases** to test. It was not used to make architectural decisions blindly
— I reviewed generated SQL for injection safety, adjusted HTTP status
codes for consistency, and made UX calls (like the demo admin-registration
checkbox) myself. The TDD workflow (write failing test → generate
implementation → verify green → refactor) mapped naturally onto
AI-assisted development: I could ask for tests first, confirm they failed
for the right reason, then ask for an implementation targeted at exactly
those tests.

