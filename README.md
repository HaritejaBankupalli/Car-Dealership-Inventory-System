# 🚗 AutoNest — Car Dealership Inventory System

A full-stack Car Dealership Inventory System built as a TDD kata: a
JWT-authenticated REST API (Node.js/Express + SQLite) paired with a
React + Tailwind CSS single-page frontend for browsing, searching,
purchasing, and (for admins) managing vehicle inventory.

- **Backend:** Node.js, Express, SQLite (via `better-sqlite3`), JWT auth, bcrypt
- **Frontend:** React 19, Vite, Tailwind CSS, React Router, Axios
- **Testing:** Jest + Supertest, 26 tests, 91%+ statement coverage
- **Workflow:** Test-Driven Development (Red → Green → Refactor), AI co-authored commits

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Getting Started](#getting-started)
3. [API Reference](#api-reference)
4. [Running Tests](#running-tests)
5. [Screenshots](#screenshots)
6. [My AI Usage](#my-ai-usage)

---

## Project Structure

```
car-dealership/
├── backend/                 # Express REST API
│   ├── src/
│   │   ├── controllers/     # Request handlers (auth, vehicles)
│   │   ├── middleware/      # JWT auth + admin guard
│   │   ├── models/          # SQL data-access layer
│   │   ├── routes/          # Express routers
│   │   ├── db/              # SQLite connection + schema
│   │   ├── app.js           # Express app assembly (testable, no listen())
│   │   └── server.js        # Entry point
│   ├── tests/                # Jest + Supertest suites
│   └── jest.config.js
├── frontend/                 # React SPA
│   └── src/
│       ├── api/              # Axios client + endpoint wrappers
│       ├── context/          # AuthContext (global auth state)
│       ├── components/       # Navbar, VehicleCard, SearchBar, modal, etc.
│       └── pages/            # Login, Register, Dashboard
├── PROMPTS.md                 # Full AI prompt log
├── TEST_REPORT.txt            # Saved Jest output (coverage report)
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env      # adjust JWT_SECRET for production use
npm start                 # runs on http://localhost:5000
```

The SQLite database file (`dealership.sqlite`) is created automatically
on first run — no separate database server needed.

### 2. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env      # points VITE_API_URL at the backend
npm run dev               # runs on http://localhost:5173
```

Open `http://localhost:5173`, register an account (tick "Register as an
admin" to get admin privileges for demo purposes), and start adding
vehicles.

### 3. Production build (frontend)

```bash
cd frontend
npm run build             # outputs static files to dist/
```

---

## API Reference

All `/api/vehicles/*` routes require an `Authorization: Bearer <token>`
header obtained from `/api/auth/login`.

| Method | Endpoint                        | Auth        | Description                                  |
|--------|----------------------------------|-------------|-----------------------------------------------|
| POST   | `/api/auth/register`             | Public      | Register a new user (`role: customer|admin`) |
| POST   | `/api/auth/login`                | Public      | Log in, returns a JWT                        |
| GET    | `/api/vehicles`                  | Any user    | List all vehicles                            |
| GET    | `/api/vehicles/search`           | Any user    | Filter by `make`, `model`, `category`, `minPrice`, `maxPrice` |
| POST   | `/api/vehicles`                  | Any user    | Add a new vehicle                            |
| GET    | `/api/vehicles/:id`              | Any user    | Get one vehicle                              |
| PUT    | `/api/vehicles/:id`               | Any user    | Update a vehicle                             |
| DELETE | `/api/vehicles/:id`               | Admin only  | Delete a vehicle                             |
| POST   | `/api/vehicles/:id/purchase`      | Any user    | Purchase (decrease quantity)                 |
| POST   | `/api/vehicles/:id/restock`       | Admin only  | Restock (increase quantity)                  |

---

## Running Tests

```bash
cd backend
npm test
```

This runs the full Jest + Supertest suite (26 tests across auth and
vehicle endpoints) with a coverage report. The saved output from the
last full run is in [`TEST_REPORT.txt`](./TEST_REPORT.txt):

```
Test Suites: 2 passed, 2 total
Tests:       26 passed, 26 total

-----------------------|---------|----------|---------|---------|
File                   | % Stmts | % Branch | % Funcs | % Lines |
-----------------------|---------|----------|---------|---------|
All files              |   91.42 |     81.3 |   89.28 |   92.68 |
```

---

## Screenshots

> The app runs entirely locally via `npm run dev` / `npm start`. Since
> this repository was assembled in a sandboxed environment without a
> display/browser available for capturing images, no static screenshots
> are bundled here. To generate them: start both servers as described
> above, open `http://localhost:5173`, and capture the Login page,
> Dashboard (as a customer), and Dashboard (as an admin, showing the Add
> Vehicle modal). Drop the images into a `screenshots/` folder and they
> will render inline if you reference them here, e.g.
> `![Dashboard](./screenshots/dashboard.png)`.

---

## My AI Usage

**Which AI tools I used:** Claude (Anthropic), via an AI coding assistant,
was used throughout this project for backend and frontend scaffolding,
test generation, and documentation drafting.

**How I used it:**

- **Planning:** Asked Claude to help choose between tech stack options
  (Express vs NestJS, better-sqlite3 vs a hosted Postgres instance, Vite
  vs Create React App) given the kata's constraints.
- **TDD cycle:** For both the auth and vehicle inventory features, I had
  Claude generate the Supertest specs *first* (confirming they failed —
  the RED step, since no implementation existed yet), then asked it to
  implement the corresponding models/controllers/routes to make those
  exact tests pass (GREEN), before doing a small manual refactor pass.
- **Boilerplate generation:** JWT signing/verification, bcrypt hashing,
  Express route wiring, and the initial React component/page layouts
  (forms, cards, modals) were AI-generated first drafts.
- **Documentation:** This README, the commit message narration, and
  `PROMPTS.md` were drafted with AI assistance and then edited for
  accuracy.

**My reflection on how AI impacted my workflow:**

AI meaningfully sped up the "blank page" problem — getting a working
Express skeleton, JWT middleware, and React form layouts in place took
minutes instead of the usual back-and-forth of copying boilerplate from
old projects or docs. The biggest workflow benefit was in the TDD loop
itself: describing the exact behaviors I wanted tested, letting the
assistant draft the specs, running them to confirm a real RED state, and
then asking for an implementation scoped tightly to those tests kept me
honest about not over-building or under-testing any one endpoint.

That said, AI-generated code still needed review at every step — I
checked that the vehicle search query used parameterized SQL rather than
string interpolation (SQL injection risk), adjusted HTTP status codes for
REST consistency (e.g. 409 for insufficient stock vs 404 for not found),
and made a few UX decisions myself (like the demo-only "register as
admin" checkbox, since a real dealership app would gate admin creation
behind an invite flow, not user self-selection). AI was a strong
accelerant for structure and first drafts, but the judgment calls around
security, status-code semantics, and product behavior stayed a manual,
reviewed step rather than something I took on faith from generated
output.
