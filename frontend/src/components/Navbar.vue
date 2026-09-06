<template>
  <div class="cs-header-and-nav">

    <!-- ── 1. Top Crimson Header ── -->
    <header class="cs-top-red-header">
      <div class="cs-top-header-inner">

        <!-- Logo & Tagline -->
        <router-link to="/shelf" class="cs-logo-wrap">
          <h1 class="cs-logo-title">COMICVERSE</h1>
          <p class="cs-logo-tagline">YOUR ULTIMATE READING/WATCH TRACKER!</p>
        </router-link>

        <!-- Right Top Actions: ADD & Menu -->
        <div class="cs-top-actions">
          <button
            type="button"
            class="cs-btn-add"
            @click="triggerAddModal"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            <span>ADD</span>
          </button>

          <button
            type="button"
            class="cs-btn-menu"
            @click="isMenuOpen = !isMenuOpen"
          >
            <span class="cs-menu-line"></span>
            <span class="cs-menu-line"></span>
            <span class="cs-menu-line"></span>
          </button>
        </div>

      </div>
    </header>

    <!-- ── 2. Dark Navbar Strip ── -->
    <nav class="cs-dark-navbar">
      <div class="cs-dark-nav-inner">

        <!-- 1. SHELF -->
        <router-link to="/shelf" class="cs-nav-tab" active-class="active">
          <div class="cs-tab-main">
            <svg class="cs-tab-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              <line x1="8" y1="6" x2="16" y2="6"/>
              <line x1="8" y1="10" x2="14" y2="10"/>
            </svg>
            <span class="cs-tab-label">SHELF</span>
          </div>
          <span class="cs-tab-sub">{{ comicStore.entries.length }} TITLES</span>
        </router-link>

        <!-- 2. WATCHLIST -->
        <router-link to="/watchlist" class="cs-nav-tab" active-class="active">
          <div class="cs-tab-main">
            <svg class="cs-tab-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 3l-4 4L8 3"/>
            </svg>
            <span class="cs-tab-label">WATCHLIST</span>
          </div>
          <span class="cs-tab-sub">{{ comicStore.watchlist.length }} TITLES</span>
        </router-link>

        <!-- 3. DISCOVER -->
        <router-link to="/discover" class="cs-nav-tab" active-class="active">
          <div class="cs-tab-main">
            <svg class="cs-tab-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span class="cs-tab-label">DISCOVER</span>
          </div>
          <span class="cs-tab-sub">FIND READERS</span>
        </router-link>

        <!-- 4. FEED -->
        <router-link to="/feed" class="cs-nav-tab" active-class="active">
          <div class="cs-tab-main">
            <svg class="cs-tab-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 11a9 9 0 0 1 9 9"/>
              <path d="M4 4a16 16 0 0 1 16 16"/>
              <circle cx="5" cy="19" r="1.5" fill="currentColor"/>
            </svg>
            <span class="cs-tab-label">FEED</span>
          </div>
          <span class="cs-tab-sub">FOLLOWING</span>
        </router-link>

        <!-- 5. TIMELINE -->
        <router-link to="/timelines" class="cs-nav-tab" active-class="active">
          <div class="cs-tab-main">
            <svg class="cs-tab-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            <span class="cs-tab-label">TIMELINE</span>
          </div>
          <span class="cs-tab-sub">GUIDE</span>
        </router-link>

        <!-- 6. ACHIEVEMENTS -->
        <router-link to="/achievements" class="cs-nav-tab" active-class="active">
          <div class="cs-tab-main">
            <svg class="cs-tab-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2"/>
              <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2"/>
              <path d="M4 22h16"/>
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
            </svg>
            <span class="cs-tab-label">ACHIEVEMENTS</span>
          </div>
          <span class="cs-tab-sub">BADGES</span>
        </router-link>

        <!-- 7. STATS -->
        <router-link to="/stats" class="cs-nav-tab" active-class="active">
          <div class="cs-tab-main">
            <svg class="cs-tab-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            <span class="cs-tab-label">STATS</span>
          </div>
          <span class="cs-tab-sub">WRAPPED</span>
        </router-link>

      </div>
    </nav>

    <!-- Menu Dropdown -->
    <div v-if="isMenuOpen" class="cs-menu-dropdown">
      <router-link to="/profile" class="cs-menu-item" @click="isMenuOpen = false">
        Profile (Lv.{{ comicStore.user.level }})
      </router-link>
      <div class="cs-menu-divider"></div>
      <button type="button" class="cs-menu-item" @click="triggerAddModal">
        Add New Title
      </button>
      <router-link to="/" class="cs-menu-item" @click="isMenuOpen = false">
        Landing Page
      </router-link>
      <div class="cs-menu-divider"></div>
      <div class="cs-menu-theme-section">
        <span class="cs-menu-theme-label">THEME</span>
        <div class="cs-menu-theme-grid" role="group" aria-label="Choose theme">
          <button
            v-for="theme in THEMES"
            :key="theme.id"
            type="button"
            class="cs-menu-theme-option"
            :class="{ active: currentTheme === theme.id }"
            :aria-label="`${theme.label} theme`"
            :aria-pressed="currentTheme === theme.id"
            @click="setTheme(theme.id)"
          >
            <span class="cs-menu-theme-swatch" :class="`theme-swatch-${theme.id}`"></span>
            <span>{{ theme.label }}</span>
          </button>
        </div>
      </div>
      <button type="button" class="cs-menu-item" @click="handleSignOut">
        Sign Out
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { comicStore } from '../stores/useComicStore.js'
import { THEMES, getStoredTheme, applyThemeToDocument } from '../utils/theme.js'
import '../assets/auth.css'

const isMenuOpen = ref(false)
const currentTheme = ref(applyThemeToDocument(getStoredTheme()))
const router = useRouter()

const emit = defineEmits(['open-add-modal'])

function triggerAddModal() {
  isMenuOpen.value = false
  emit('open-add-modal')
  window.dispatchEvent(new CustomEvent('open-add-comic-modal'))
}

function handleSignOut() {
  isMenuOpen.value = false
  comicStore.triggerLogout(router)
}

function setTheme(themeId) {
  currentTheme.value = applyThemeToDocument(themeId)
}
</script>
