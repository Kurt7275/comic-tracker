# ⚡ COMICVERSE

> **Your entire reading life. One pop-art multiverse.**

ComicVerse is a modern, pop-art-inspired media tracker built for comic, manga, manhwa, and webtoon enthusiasts. Track reading progress, universe timelines (MCU, Batman, Spider-Verse), watchlists, daily reading streaks, and reader XP achievements—starting from an interactive 3D Miles Morales bedroom portal!

---

## 🚀 Quick Start: Running the Entire Project

To run ComicVerse with its full stack (Laravel backend API + Vue 3 frontend), open two terminal windows:

### 1. Start the Backend API (Laravel)

```bash
cd backend

# 1. Install dependencies (if first time)
composer install

# 2. Copy environment file and generate application key (if first time)
cp .env.example .env
php artisan key:generate

# 3. Run database migrations
php artisan migrate

# 4. Start the Laravel backend server on port 8888
php artisan serve --port=8888
```

> **Note for macOS / MAMP users:** If your default terminal PHP has issues, use the project MAMP wrapper:
> ```bash
> ../bin/php artisan serve --port=8888
> ```
> Backend API will be active at: **`http://localhost:8888`**

---

### 2. Start the Frontend (Vue 3 + Vite)

```bash
cd frontend

# 1. Install dependencies (if first time)
npm install

# 2. Start the Vite development server
npm run dev
```

Frontend app will be live at: **`http://localhost:3032`**

---

## 🧪 Running Playwright E2E Tests

ComicVerse includes comprehensive end-to-end (E2E) testing powered by **[Playwright](https://playwright.dev/)**. Tests run against both **Desktop Chromium** and **Mobile Chrome (Pixel 7)** viewports.

### 1. Install Playwright Browsers (One-Time Setup)

```bash
cd frontend
npx playwright install
```

### 2. Test Commands

Run all commands from the `frontend/` directory:

| Command | Description |
| :--- | :--- |
| `npm run test:e2e` | **Headless Run (Default)**: Runs all test suites in the background and reports pass/fail directly in terminal. |
| `npm run test:e2e:ui` | **Interactive UI Mode**: Opens Playwright’s interactive visual dashboard with time-travel debugging, screenshots, and live previews. |
| `npm run test:e2e:headed` | **Headed Run**: Opens a visible browser window so you can watch automated tests interact live. |
| `npm run test:e2e:report` | **HTML Report**: Opens the detailed HTML test report showing durations, traces, and screenshots. |

> **Automated Dev Server**: `playwright.config.js` is pre-configured to automatically start the Vite dev server on port 3032 if it isn't already running. You can run tests at any time without manually starting `npm run dev` first.

---

### 3. Running Specific Test Suites

- **Run only the Room Portal & Authentication tests:**
  ```bash
  npx playwright test tests/e2e/room-and-auth.spec.js
  ```

- **Run only the Universe Timelines tests:**
  ```bash
  npx playwright test tests/e2e/timelines.spec.js
  ```

- **Run tests on Desktop Chromium only:**
  ```bash
  npx playwright test --project=chromium
  ```

- **Run tests on Mobile Chrome only:**
  ```bash
  npx playwright test --project=mobile-chrome
  ```

- **Run a single test by name:**
  ```bash
  npx playwright test -g "login page"
  ```

---

### 4. What the Tests Cover

- **`room-and-auth.spec.js`**:
  - Verifies the Miles' Room 3D portal renders with the live landing page iframe preview in the monitor.
  - Verifies navigating from `/landing` to `/login` via the hero CTA.
  - Verifies the comic sign-in card UI and that the top-left back button returns to `/landing`.
  - Simulates a completed OAuth callback (`/auth/callback`) and verifies user session creation and redirect to `/shelf`.
- **`timelines.spec.js`**:
  - Verifies universe selection and default MCU phase rendering.
  - Verifies type filter pills (MOVIE, SHOW, COMIC) and live search query filtering.
  - Verifies checklist toggle interactions, toast notifications, and opening the exportable share modal.

---

## 🏛️ Project Structure

```text
comic-tracker/
├── backend/                     # Laravel PHP API
│   ├── app/                     # Controllers, Models, Middleware
│   ├── routes/api.php           # REST API routes (shelf, auth, timelines)
│   ├── database/migrations/     # Database schemas
│   └── artisan                  # Laravel CLI
│
├── frontend/                    # Vue 3 + Vite Frontend
│   ├── playwright.config.js     # Playwright E2E configuration (port 3032)
│   ├── tests/e2e/               # Playwright test specifications
│   │   ├── room-and-auth.spec.js# Portal, landing, and authentication tests
│   │   └── timelines.spec.js    # Timelines, search, and checklist tests
│   ├── src/
│   │   ├── assets/              # Base CSS, themes, pop-art halftone styling
│   │   ├── components/
│   │   │   ├── portal/          # Miles' Room 3D portal & 2D sketchbook modal
│   │   │   ├── Navbar.vue       # Header strip with ROOM, SHELF, STATS navigation
│   │   │   └── ...              # Modals (Add, Profile, ShareChecklist)
│   │   ├── stores/              # Pinia state stores (useComicStore, useAuthStore)
│   │   ├── services/            # Axios API clients & local persistence fallbacks
│   │   └── views/               # Route views (MilesRoomView, LandingView, ShelfView, etc.)
│   └── package.json
│
├── bin/                         # Local development helper scripts
└── README.md
```

---

## 🎨 Pop-Art Design System

- **Halftone Patterns**: Radial dot matrix backgrounds (`radial-gradient(circle, rgba(0,0,0,0.08) 1.2px, transparent 1.2px)`).
- **Hard Offset Shadows**: `3px 3px 0 #111111` comic-book drop shadows.
- **Typography**: `Bangers` for comic punchlines & titles, `Impact` for bold headers, and `Outfit` / `Comic Neue` for content readability.
- **Color Palette**: Electric Yellow (`#F5D13B`), Crimson Red (`#EE3545`), Neon Green (`#44C555`), and Warm Parchment (`#FAF4E8`).

---

## 📄 License

Distributed under the **MIT License**.
