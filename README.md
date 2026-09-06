```text
  ██████╗ ██████╗ ███╗   ███╗██╗██╗██╗   ██╗███████╗██████╗ ███████╗███████╗
 ██╔════╝██╔═══██╗████╗ ████║██║██║██║   ██║██╔════╝██╔══██╗██╔════╝██╔════╝
 ██║     ██║   ██║██╔████╔██║██║██║██║   ██║█████╗  ██████╔╝███████╗█████╗  
 ██║     ██║   ██║██║╚██╔╝██║██║██║╚██╗ ██╔╝██╔══╝  ██╔══██╗╚════██║██╔══╝  
 ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║██║ ╚████╔╝ ███████╗██║  ██║███████║███████╗
  ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝
```

<div align="center">

# 💥 COMICVERSE 💥
### *YOUR ENTIRE READING LIFE. ONE POP-ART UNIVERSE.*

![Vue 3](https://img.shields.io/badge/Vue%203-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD600)
![Pinia Architecture](https://img.shields.io/badge/Pinia-Store_Modularized-7C3AED?style=for-the-badge&logo=vue.js&logoColor=FFF)
![Backend Ready](https://img.shields.io/badge/Backend-API_Ready-00E676?style=for-the-badge&logo=express&logoColor=FFF)
![License](https://img.shields.io/badge/License-MIT-FF1744?style=for-the-badge)

**ComicVerse** is a modern, pop-art styled media tracker built for comic, manga, manhwa, and webtoon enthusiasts. Track reading progress, universe timelines, adaptations, streaks, and achievements—all wrapped in a vibrant, halftone-inspired design system.

[⚡ Demo Features](#-features) • [🚀 Getting Started](#-getting-started) • [🏗️ Architecture](#-project-architecture) • [🎨 Pop Art Design System](#-pop-art-design-system)

---

</div>

## 💥 POW! WHY COMICVERSE?

```text
 ┌─────────────────────────────────────────────────────────────────────────┐
 │ 🦸  TRACK EVERYTHING  │ Manga • Manhwa • Webtoons • Comics • Novels     │
 │ 🔥  DAILY STREAKS     │ Flame counters & longest streak tracking        │
 │ 🗓️  UNIVERSE TIMELINES│ MCU, Batman, Spider-Verse & One Piece Orders    │
 │ 📺  WATCHLIST         │ Anime, TV shows & movie adaptations             │
 │ 🏆  ACHIEVEMENTS      │ Earn XP & level up from Initiate to Arch-Mage   │
 │ 🔌  BACKEND READY     │ Repository & Service abstraction pre-built      │
 └─────────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ PROJECT ARCHITECTURE

ComicVerse follows an **Enterprise-Grade Modular Architecture** designed for zero-friction backend integration:

```text
frontend/src/
├── 📁 services/                 # 🔌 API & Repository Isolation (Backend Ready)
│   ├── api.js                   # Axios base client (Base URL, JWT headers, 401 response interceptors)
│   ├── authService.js           # Login, register & session storage service
│   ├── comicService.js          # Async comic entry & watchlist API service
│   └── timelineService.js       # Universe reading order & checklist progress API service
│
├── 📁 stores/                   # 🧠 Domain State Management
│   ├── useAuthStore.js          # User session, level XP, streak counters & authentication
│   ├── useUiStore.js            # Theme switching, dark mode toggle & global modal states
│   └── useComicStore.js         # Master store delegating to domain services & sub-stores
│
├── 📁 composables/              # ⚡ Vue 3 Reactive Hooks
│   ├── useTheme.js              # Theme switcher & dark mode hook
│   └── useComicFilter.js        # Search, filter & sort algorithms
│
├── 📁 components/               # 🧩 Component Library
│   ├── ui/                      # 🎨 Reusable Design System Primitives
│   │   ├── BaseModal.vue        # Universal backdrop, dialog container & transition effects
│   │   └── BaseBadge.vue        # Status & format tag badges
│   ├── comic/                   # 📚 Comic Domain Components
│   │   ├── ComicCard.vue        # Interactive card with progress bar, rating & quick actions
│   │   ├── ComicFilterBar.vue   # Search input, status tabs, type dropdown & sort
│   │   ├── AddModal.vue         # Add/edit comic entry modal
│   │   └── ShareChecklistModal.vue # Exportable pop-art share card generator
│   └── timeline/                # 🗓️ Timeline Domain Components
│       ├── TimelineCard.vue     # Universe issue & event checklist item
│       └── TimelineFilter.vue   # Universe selector tabs & search
│
└── 📁 views/                    # 🖥️ Page Containers
    ├── ShelfView.vue            # Main shelf library dashboard
    ├── LandingView.vue          # Hero landing page with animated 2x2 showcase
    ├── TimelinesView.vue        # Interactive universe reading order timelines
    ├── DiscoverView.vue         # Community discovery feed
    ├── AchievementsView.vue    # Reader level, badges & trophy room
    ├── StatsView.vue            # GitHub-style annual activity heatmap & analytics
    ├── ProfileView.vue          # User profile & JSON backup/restore
    └── WatchlistView.vue        # TV & anime adaptations tracker
```

---

## 🎨 POP ART DESIGN SYSTEM

ComicVerse takes visual inspiration from classic 1960s **Roy Lichtenstein Pop Art** & modern comic books:

```text
 ┌──────────────────────┬──────────────────────┬──────────────────────┐
 │  CRIMSON RED         │  ELECTRIC YELLOW     │  ROYAL PURPLE        │
 │  HEX: #FF1744        │  HEX: #FFD600        │  HEX: #AA00FF        │
 ├──────────────────────┼──────────────────────┼──────────────────────┤
 │  NEON GREEN          │  FLAME ORANGE        │  PARCHMENT           │
 │  HEX: #00E676        │  HEX: #FF6D00        │  HEX: #FAF4E8        │
 └──────────────────────┴──────────────────────┴──────────────────────┘
```

* **Halftone Textures**: Subtle radial dot pattern backgrounds (`radial-gradient(circle, rgba(0,0,0,0.08) 1.2px, transparent 1.2px)`).
* **Hard Pop Shadows**: Solid `3px 3px 0 #111111` offset box-shadows.
* **Punchy Typography**: Google Fonts **Bangers** for titles, **Comic Neue** for dialogue, and **Outfit** for clean metrics.

---

## ⚡ FEATURES AT A GLANCE

### 💥 Interactive Pop-Art Cards
Every comic card features progress bars, SVG star ratings (`10/10`), status badges (`READING`, `COMPLETED`, `PLAN TO READ`), quick `+1 Chapter` increment buttons, and action overlays.

### 🗓️ Universe Reading Orders
Interactive chronologies for **Marvel MCU**, **DC Batman Sagas**, **One Piece**, **Naruto**, **Attack on Titan**, and **MonsterVerse Godzilla**. Generate & export custom share cards with `html2canvas`.

### 🏆 XP & Reader Leveling
Earn XP for reading chapters and completing titles. Level up from **Initiate** (Lvl 1) to **Multiverse Arch-Mage** (Lvl 50+).

### 📊 Reading Heatmap & Analytics
GitHub-style 365-day activity calendar, format distribution charts, and reading velocity meters.

---

## 🚀 GETTING STARTED

### Prerequisites
* **Node.js** >= 18.x
* **npm** >= 9.x

### Installation & Local Setup

```bash
# 1. Clone repository
git clone https://github.com/Kurt7275/comic-tracker.git
cd comic-tracker/frontend

# 2. Install dependencies
npm install

# 3. Launch Vite development server
npm run dev

# 4. Build production bundle
npm run build
```

App runs locally at: **`http://localhost:5173`** (or `http://localhost:5174`)

---

## 🔌 BACKEND API INTEGRATION

ComicVerse is pre-architected for instant backend integration:

1. Create a `.env` file in `frontend/`:
   ```env
   VITE_API_URL=https://api.yourdomain.com/api
   ```
2. The Axios client in [`src/services/api.js`](file:///Users/mac/projects/comic-tracker/frontend/src/services/api.js) automatically attaches Bearer tokens and handles API endpoints.
3. If the backend is offline, the app seamlessly falls back to persistent local storage with zero runtime crashes.

---

## 📄 LICENSE

Distributed under the **MIT License**. See `LICENSE` for details.

<div align="center">

*Built with ❤️ and too many comic books.*

</div>
