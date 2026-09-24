<template>
  <div
    :class="[
      'figma-page',
      'theme-' + currentTheme,
      {
        'landing-zoom-in': zoomOut,
        'landing-signin-exit': isSigningIn,
      },
    ]"
  >
    <!-- ── 1. Top Navbar ── -->
    <header class="f-nav">
      <div class="f-nav-logo" @click="$router.push('/landing')">
        <span class="f-nav-logo-box">COMIC</span>
        <span class="f-nav-logo-text">VERSE</span>
      </div>

      <router-link :to="loginTransitionRoute" id="f-nav-signin" class="f-nav-signin-btn" @click.prevent="goToLogin">
        SIGN IN
      </router-link>
    </header>

    <!-- ── Main Content Container ── -->
    <main class="f-main">
      <!-- ── 2. Hero Section: Split 2-Column Grid ── -->
      <section class="f-hero-grid">
        <!-- Left Column: Copy & Primary CTA -->
        <div class="f-hero-left">
          <div class="f-badge-yellow">COMIC TRACKER</div>

          <h1 class="f-hero-title">YOUR COMICS.<br />YOUR UNIVERSE.</h1>

          <p class="f-hero-desc">
            Track every manga, manhwa, webtoon &amp; comic you read. One
            universe for your shelf, watchlist, stats, and achievements.
          </p>

          <router-link :to="loginTransitionRoute" id="f-hero-start-btn" class="f-btn-red" @click.prevent="goToLogin">
            <span>START NOW</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>

        <!-- ══════════════════════════════════════════════════════════
             Right Column: 2x2 Comic Preview Showcase
             ══════════════════════════════════════════════════════════ -->
        <div class="f-showcase-frame-pic2">
          <div class="f-cards-2x2-pic2">
            <div
              v-for="comic in PREVIEW_COMICS"
              :key="comic.id"
              class="f-pic2-card"
              :class="'border-' + comic.colorTheme"
            >
              <!-- Floating Top-Left Bookmark / Badge (if specified) -->
              <div v-if="comic.badgeTopLeft" class="f-pic2-badge-top-left" :title="comic.badgeTopLeft">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#FFD600" stroke="#111111" stroke-width="2.5">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>

              <!-- Floating Corner Burst Tag (Hangs outside top-right corner) -->
              <div class="f-pic2-burst-tag" :class="comic.colorTheme">
                {{ comic.burstText }}
              </div>

              <!-- Cover Image Box -->
              <div class="f-pic2-cover-box">
                <img
                  :src="comic.cover"
                  :alt="comic.title"
                  class="f-pic2-cover-img"
                  loading="lazy"
                  referrerpolicy="no-referrer"
                />
              </div>

              <!-- Card Body -->
              <div class="f-pic2-body">
                <div class="f-pic2-title">{{ comic.title }}</div>
                <div class="f-pic2-type-banner" :class="comic.colorTheme">
                  {{ comic.type }}
                </div>

                <!-- Chapter Progress -->
                <div class="f-pic2-ch-txt">{{ comic.progressText }}</div>
                <div v-if="comic.progressPercent" class="f-pic2-bar-track">
                  <div
                    class="f-pic2-bar-fill"
                    :class="comic.colorTheme"
                    :style="{ width: comic.progressPercent + '%' }"
                  ></div>
                </div>

                <!-- Comic Star Rating Badge -->
                <div class="f-pic2-star-wrap">
                  <div class="f-comic-star-badge">
                    <svg class="f-comic-star-svg" viewBox="0 0 50 50">
                      <polygon
                        points="25,2 32,18 49,18 35,29 40,46 25,35 10,46 15,29 1,18 18,18"
                        fill="#FFD600"
                        stroke="#111111"
                        stroke-width="3"
                        stroke-linejoin="miter"
                      />
                    </svg>
                    <div class="f-comic-star-num">{{ comic.rating }}</div>
                  </div>
                </div>

                <!-- Optional Genre Tags (e.g. Action, Fantasy) -->
                <div
                  v-if="comic.genreTags && comic.genreTags.length"
                  class="f-pic2-genre-tags"
                >
                  <span
                    v-for="tag in comic.genreTags"
                    :key="tag"
                    class="f-pic2-genre-pill"
                  >
                    {{ tag }}
                  </span>
                </div>

                <!-- Bottom Row Controls (Flame Streak, Minus, Plus, Sync) -->
                <div class="f-pic2-bottom-row">
                  <span v-if="comic.streak" class="f-pic2-streak-pill">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="#FF1744"
                      style="flex-shrink: 0"
                    >
                      <path
                        d="M12 23c-4.97 0-9-3.58-9-8 0-4.5 4.5-9.5 7-12.5 1.5 2.5 4 5 5 7.5 1.5-1.5 2-3 2-3s4 3.5 4 8c0 4.42-4.03 8-9 8z"
                      />
                    </svg>
                    <span>{{ comic.streak }}</span>
                  </span>
                  <template v-if="comic.streak">
                    <router-link :to="loginTransitionRoute" class="f-pic2-btn-minus" @click.prevent="goToLogin">−</router-link>
                    <router-link :to="loginTransitionRoute" class="f-pic2-btn-plus" @click.prevent="goToLogin">＋</router-link>
                  </template>
                  <router-link
                    v-if="comic.showSync"
                    :to="loginTransitionRoute"
                    class="f-pic2-btn-sync"
                    title="Sync / Re-read"
                    @click.prevent="goToLogin"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M21.5 2v6h-6M2.5 22v-6h6" />
                      <path
                        d="M2 11.5a10 10 0 0 1 18.8-4.3L21.5 8M22 12.5a10 10 0 0 1-18.8 4.3L2.5 16"
                      />
                    </svg>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════════════
           NEW: Theme Toggle Section (MAKE COMICVERSE YOURS)
           ══════════════════════════════════════════════════════════ -->
      <section class="f-theme-section">
        <h2 class="f-theme-heading">MAKE COMICVERSE YOURS</h2>

        <div class="f-theme-box">
          <button
            v-for="theme in THEMES"
            :key="theme.id"
            type="button"
            class="f-theme-item"
            :class="{ active: currentTheme === theme.id }"
            @click="setTheme(theme.id)"
          >
            <span class="f-theme-icon" :class="'shape-' + theme.id"></span>
            <span class="f-theme-tag">{{ theme.label }}</span>
          </button>
        </div>
      </section>

      <!-- ── 3. Section: EVERYTHING IN ONE SHELF ── -->
      <section class="f-section-wrap">
        <div class="f-section-title-box">
          <h2>EVERYTHING IN ONE UNIVERSE</h2>
        </div>

        <div class="f-six-grid">
          <div class="f-box-card">
            <div class="f-box-header">
              <div class="f-letter-sq" style="background: #ff1744; color: #fff">
                T
              </div>
              <h3>TRACK COMICS &amp; MANGA</h3>
            </div>
            <p>
              Track the comics, manga &amp; manhwa you own, are reading, or want
              to read. Update chapters, volumes, and ratings with 1-click.
            </p>
          </div>

          <div class="f-box-card">
            <div class="f-box-header">
              <div class="f-letter-sq" style="background: #ffd600; color: #111">
                W
              </div>
              <h3>WATCHLIST</h3>
            </div>
            <p>
              Never lose track of comic &amp; manga adaptations. Track TV
              series, anime, movies, seasons, and episodes in one place.
            </p>
          </div>

          <div class="f-box-card">
            <div class="f-box-header">
              <div class="f-letter-sq" style="background: #ff9100; color: #111">
                O
              </div>
              <h3>READING ORDERS</h3>
            </div>
            <p>
              Follow interactive universe reading orders and chronologies for
              Marvel MCU, DC Batman Sagas, Spider-Verse, and One Piece.
            </p>
          </div>

          <div class="f-box-card">
            <div class="f-box-header">
              <div class="f-letter-sq" style="background: #2979ff; color: #fff">
                S
              </div>
              <h3>READING STREAKS</h3>
            </div>
            <p>
              Build daily reading habits with streak flame counters, longest
              streak tracking, and streak restore shields to keep you motivated.
            </p>
          </div>

          <div class="f-box-card">
            <div class="f-box-header">
              <div class="f-letter-sq" style="background: #aa00ff; color: #fff">
                A
              </div>
              <h3>ACHIEVEMENTS</h3>
            </div>
            <p>
              Unlock badges, trophies, and level up your reader rank from
              Initiate to Multiverse Arch-Mage as you read and complete titles.
            </p>
          </div>

          <div class="f-box-card">
            <div class="f-box-header">
              <div class="f-letter-sq" style="background: #00c853; color: #111">
                H
              </div>
              <h3>STATS &amp; HEATMAP</h3>
            </div>
            <p>
              Visualize your reading history with GitHub-style annual activity
              calendars, format breakdowns, and reading velocity charts.
            </p>
          </div>
        </div>
      </section>

      <!-- ── 4. Section: HOW COMICVERSE WORKS ── -->
      <section class="f-section-wrap">
        <div class="f-section-title-box">
          <h2>HOW COMICVERSE WORKS</h2>
        </div>

        <div class="f-how-container">
          <div class="f-how-steps-grid">
            <div class="f-step-box">
              <div class="f-step-num">1</div>
              <h4>SIGN UP</h4>
              <p>Create your hero account in seconds.</p>
            </div>
            <div class="f-step-box">
              <div class="f-step-num">2</div>
              <h4>ADD TITLES</h4>
              <p>Search or add custom manga &amp; comics.</p>
            </div>
            <div class="f-step-box">
              <div class="f-step-num">3</div>
              <h4>UPDATE PROGRESS</h4>
              <p>1-Click chapter and volume updates.</p>
            </div>
            <div class="f-step-box">
              <div class="f-step-num">4</div>
              <h4>LEVEL UP</h4>
              <p>Maintain streaks and earn badges.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── 5. Section: READ COMICS TODAY ── -->
      <section class="f-section-wrap">
        <div class="f-section-title-box">
          <h2>READ COMICS TODAY</h2>
        </div>

        <div class="f-media-container-box">
          <div class="f-badges-row">
            <span
              class="f-media-badge"
              style="background: #e8f8ee; color: #008738"
              >MANGA</span
            >
            <span
              class="f-media-badge"
              style="background: #ffebeb; color: #b71c1c"
              >COMIC</span
            >
            <span
              class="f-media-badge"
              style="background: #f3e5f5; color: #6a1b9a"
              >MANHWA</span
            >
            <span
              class="f-media-badge"
              style="background: #e0f7fa; color: #00838f"
              >WEBTOON</span
            >
            <span
              class="f-media-badge"
              style="background: #fffde7; color: #f57f17"
              >GRAPHIC NOVEL</span
            >
            <span
              class="f-media-badge"
              style="background: #ede7f6; color: #4a148c"
              >LIGHT NOVEL</span
            >
          </div>
        </div>
      </section>

      <!-- ── 6. Section: FREE NOTICE ── -->
      <section class="f-section-wrap" style="gap: 0.35rem">
        <h3 class="f-free-headline">COMICVERSE IS FREE TO START.</h3>
        <p class="f-free-subtitle">
          All basic features are free forever. No credit card required.
        </p>
      </section>
    </main>

    <!-- ── 7. Bottom Crimson CTA Banner ── -->
    <div class="f-bottom-cta">
      <div class="f-badge-yellow">GET STARTED</div>
      <h2 class="f-bottom-title">READY TO START YOUR COMICVERSE?</h2>
      <router-link :to="loginTransitionRoute" id="f-bottom-start-btn" class="f-btn-yellow-lg" @click.prevent="goToLogin">
        START NOW
      </router-link>
    </div>

    <!-- ── 8. Footer ── -->
    <footer class="f-footer">
      <p>
        © 2026 ComicVerse • Track Comics, Manga, Manhwa, Watchlists &amp;
        Achievements.
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import "../assets/auth.css";
import {
  THEMES,
  getStoredTheme,
  applyThemeToDocument,
} from "../utils/theme.js";

/* ==========================================================================
   🎨 THEME TOGGLE CONFIGURATION
   ========================================================================== */
const currentTheme = ref(applyThemeToDocument(getStoredTheme()));

// The scale transition is reserved for the monitor -> landing navigation.
const route = useRoute();
const router = useRouter();
const zoomOut = ref(route.query.from === "monitor");
const isSigningIn = ref(false);
const loginTransitionRoute = { path: "/login", query: { transition: "signin" } };
onMounted(() => {
  requestAnimationFrame(() => {
    zoomOut.value = false;
  });
});

function goToLogin() {
  if (isSigningIn.value) return;

  isSigningIn.value = true;
  router.push(loginTransitionRoute);
}

function setTheme(themeId) {
  if (themeId === currentTheme.value) return;
  currentTheme.value = applyThemeToDocument(themeId);
}

/* ==========================================================================
   🛠️ PREVIEW COMICS CONFIGURATION
   ========================================================================== */
const PREVIEW_COMICS = [
  {
    id: 1,
    title: "The Amazing Spider-Man (2025)",
    type: "COMICS",
    colorTheme: "green",
    burstText: "POW!",
    badgeTopLeft: "★",
    cover: "https://comicvine.gamespot.com/a/uploads/scale_small/6/67663/8511026-4223850769-20832.jpg",
    progressText: "CH. 28 / 35",
    progressPercent: 80,
    rating: "10",
    streak: "7D",
    genreTags: ["Action", "Superhero"],
    showSync: false,
  },
  {
    id: 2,
    title: "Solo Leveling",
    type: "MANHWA",
    colorTheme: "purple",
    burstText: "KA-POW!",
    badgeTopLeft: "★",
    cover: "https://upload.wikimedia.org/wikipedia/en/6/6c/Solo_Leveling_Volume_1_Cover.jpg",
    progressText: "CH. 179 / 179",
    progressPercent: 100,
    rating: "9",
    streak: "14D",
    genreTags: ["Action", "Fantasy"],
    showSync: true,
  },
  {
    id: 3,
    title: "Tower of God",
    type: "WEBTOON",
    colorTheme: "green",
    burstText: "POW!",
    badgeTopLeft: "",
    cover: "https://upload.wikimedia.org/wikipedia/en/7/7d/Tower_of_God_Volume_1_Cover.jpg",
    progressText: "CH. 245 / 600",
    progressPercent: 41,
    rating: "8",
    streak: "5D",
    genreTags: ["Adventure", "Mystery"],
    showSync: false,
  },
  {
    id: 4,
    title: "Jujutsu Kaisen",
    type: "MANGA",
    colorTheme: "green",
    burstText: "POW!",
    badgeTopLeft: "",
    cover: "https://upload.wikimedia.org/wikipedia/en/4/46/Jujutsu_kaisen.jpg",
    progressText: "CH. 245 / 271",
    progressPercent: 90,
    rating: "9",
    streak: "5D",
    genreTags: ["Dark", "Supernatural"],
    showSync: true,
  },
];
</script>

<style scoped>
/* Monitor-only entrance — seamless continuation of the monitor zoom-in */
.figma-page {
  transform-origin: center center;
  transition: transform 0.75s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              opacity 0.5s ease;
}

.landing-zoom-in {
  transform: scale(1.45);
  opacity: 0;
}

.landing-signin-exit {
  animation: landingSignInExit 220ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
  pointer-events: none;
}

@keyframes landingSignInExit {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  to {
    opacity: 0;
    transform: translateY(-18px) scale(0.985);
  }
}
</style>
