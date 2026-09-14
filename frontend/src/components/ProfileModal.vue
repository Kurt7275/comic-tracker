<template>
  <!-- Teleport to body so it's above everything -->
  <Teleport to="body">
    <Transition name="profile-modal">
      <div v-if="isOpen" class="pm-overlay" @click.self="close" id="profile-modal-overlay">

        <div class="pm-card" role="dialog" aria-modal="true" aria-label="Your Profile">

          <!-- ── Header ── -->
          <div class="pm-header">
            <span class="pm-title">YOUR PROFILE</span>
            <button class="pm-close-btn" @click="close" aria-label="Close profile">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- ── Scrollable Body ── -->
          <div class="pm-body">

            <!-- VIEW: Profile -->
            <template v-if="view === 'profile'">

              <!-- Avatar + Name -->
              <div class="pm-avatar-section">
                <div class="pm-avatar-circle">
                  <img v-if="isImageAvatar(user.avatar)" :src="user.avatar" alt="Avatar" class="pm-avatar-img" />
                  <svg v-else width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div class="pm-avatar-name">{{ user.name || 'Reader' }}</div>
                <div class="pm-avatar-handle">@{{ user.username || 'comicreader' }}</div>
              </div>

              <!-- Stats Grid -->
              <div class="pm-stats-grid">
                <div class="pm-stat-cell">
                  <span class="pm-stat-value">{{ comicsCount }}</span>
                  <span class="pm-stat-label">Comics</span>
                </div>
                <div class="pm-stat-cell">
                  <span class="pm-stat-value">{{ mangaCount }}</span>
                  <span class="pm-stat-label">Manga</span>
                </div>
                <div class="pm-stat-cell">
                  <span class="pm-stat-value">{{ booksCount }}</span>
                  <span class="pm-stat-label">Books</span>
                </div>
                <div class="pm-stat-cell">
                  <span class="pm-stat-value">{{ comicStore.watchlist.length }}</span>
                  <span class="pm-stat-label">Watchlist</span>
                </div>
                <div class="pm-stat-cell">
                  <span class="pm-stat-value">{{ user.followers || 0 }}</span>
                  <span class="pm-stat-label">Followers</span>
                </div>
                <div class="pm-stat-cell">
                  <span class="pm-stat-value">{{ user.following || 0 }}</span>
                  <span class="pm-stat-label">Following</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="pm-action-row">
                <button class="pm-btn-edit" @click="view = 'edit'" id="profile-edit-btn">
                  EDIT PROFILE
                </button>
                <button class="pm-btn-share" @click="shareProfile" id="profile-share-btn">
                  SHARE PROFILE
                </button>
              </div>

              <!-- Private Profile Toggle -->
              <div class="pm-private-row">
                <span class="pm-private-label">Private Profile</span>
                <button
                  class="pm-toggle"
                  :class="{ on: user.isPrivate }"
                  @click="user.isPrivate = !user.isPrivate"
                  :aria-pressed="!!user.isPrivate"
                  id="profile-private-toggle"
                >
                  <span class="pm-toggle-thumb"></span>
                </button>
              </div>

              <!-- ── Achievements ── -->
              <div class="pm-section">
                <div class="pm-section-header">
                  <span class="pm-section-title">ACHIEVEMENTS</span>
                  <span class="pm-section-count">{{ earnedAchievements.length }}</span>
                </div>
                <div class="pm-ach-grid">
                  <div
                    v-for="ach in earnedAchievements"
                    :key="ach.id"
                    class="pm-ach-badge"
                    :class="`pm-ach-${ach.color}`"
                    :title="ach.title"
                  >
                    <div class="pm-ach-icon" v-html="ach.icon"></div>
                    <span class="pm-ach-name">{{ ach.title }}</span>
                  </div>
                </div>
              </div>

              <!-- ── Latest Additions ── -->
              <div class="pm-section" v-if="latestEntries.length">
                <div class="pm-section-header">
                  <span class="pm-section-title">LATEST ADDITIONS</span>
                  <span class="pm-section-count">{{ latestEntries.length }}</span>
                </div>
                <div class="pm-covers-grid">
                  <div v-for="entry in latestEntries" :key="entry.id" class="pm-cover-cell">
                    <img :src="entry.cover" :alt="entry.title" class="pm-cover-img" />
                  </div>
                </div>
              </div>

              <!-- Data Backup Row -->
              <div class="pm-backup-row">
                <button class="pm-btn-backup" @click="exportBackup" id="profile-backup-btn">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Backup Data
                </button>
                <button class="pm-btn-logout" @click="handleLogout" id="profile-logout-btn">
                  Sign Out
                </button>
              </div>

            </template>

            <!-- VIEW: Edit Profile -->
            <template v-else-if="view === 'edit'">
              <div class="pm-edit-header">
                <button class="pm-back-btn" @click="view = 'profile'" id="profile-back-btn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                  Back
                </button>
                <span class="pm-edit-title">EDIT PROFILE</span>
              </div>

              <!-- Avatar Picker -->
              <div class="pm-edit-avatar-section">
                <div class="pm-avatar-circle pm-avatar-edit" @click="triggerPhotoPicker">
                  <img v-if="isImageAvatar(user.avatar)" :src="user.avatar" alt="Avatar" class="pm-avatar-img" />
                  <svg v-else width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <div class="pm-avatar-edit-overlay">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                  </div>
                </div>
                <input ref="fileInputRef" type="file" accept="image/*" style="display:none" @change="handlePhotoUpload" />
                <div class="pm-avatar-emoji-row">
                  <button
                    v-for="av in AVATAR_EMOJIS"
                    :key="av"
                    class="pm-avatar-emoji-btn"
                    :class="{ active: user.avatar === av }"
                    @click="user.avatar = av"
                  >{{ av }}</button>
                </div>
              </div>

              <!-- Form Fields -->
              <div class="pm-edit-form">
                <div class="pm-field">
                  <label class="pm-field-label">Display Name</label>
                  <input v-model="user.name" type="text" class="pm-field-input" placeholder="Your Name" />
                </div>
                <div class="pm-field">
                  <label class="pm-field-label">Username</label>
                  <div class="pm-field-input-wrap">
                    <span class="pm-field-at">@</span>
                    <input v-model="user.username" type="text" class="pm-field-input pm-field-input-handle" placeholder="username" />
                  </div>
                </div>
                <div class="pm-field">
                  <label class="pm-field-label">Bio</label>
                  <textarea v-model="user.bio" rows="2" class="pm-field-input pm-field-textarea" placeholder="Your reading bio..."></textarea>
                </div>
                <div class="pm-field">
                  <label class="pm-field-label">Favorite Quote</label>
                  <input v-model="user.favoriteQuote" type="text" class="pm-field-input" placeholder="A quote you love..." />
                </div>
              </div>

              <button class="pm-btn-save" @click="view = 'profile'" id="profile-save-btn">
                SAVE CHANGES
              </button>
            </template>

          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { comicStore } from '../stores/useComicStore.js'

const router = useRouter()
const isOpen = ref(false)
const view = ref('profile')
const fileInputRef = ref(null)

const user = computed(() => comicStore.user)

const AVATAR_EMOJIS = ['🦸', '🦹', '⚔️', '🥷', '🤖', '🏴‍☠️', '🧙', '👤']

// ── Stats ──
const comicsCount = computed(() => comicStore.entries.filter(e => e.type === 'Comic').length)
const mangaCount  = computed(() => comicStore.entries.filter(e => e.type === 'Manga').length)
const booksCount  = computed(() => comicStore.entries.filter(e => e.type === 'Light Novel' || e.type === 'Book').length)

// ── Achievements ──
const ALL_ACHIEVEMENTS = [
  { id: 'first-issue',   title: 'FIRST BLOOD',   color: 'red',    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>' },
  { id: 'page-turner',   title: 'PAGE TURNER',   color: 'teal',   icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' },
  { id: 'manga-fan',     title: 'MANGA FAN',     color: 'red',    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' },
  { id: 'harsh-critic',  title: 'HARSH CRITIC',  color: 'yellow', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
  { id: 'goal-setter',   title: 'GOAL SETTER',   color: 'green',  icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>' },
]

const earnedAchievements = computed(() => {
  const e = comicStore.entries
  const w = comicStore.watchlist
  const earned = []
  if (e.length >= 1) earned.push(ALL_ACHIEVEMENTS[0])
  if (e.some(x => x.chapter >= 100)) earned.push(ALL_ACHIEVEMENTS[1])
  if (e.some(x => x.type === 'Manga')) earned.push(ALL_ACHIEVEMENTS[2])
  if (e.some(x => x.rating > 0)) earned.push(ALL_ACHIEVEMENTS[3])
  if (comicStore.goal?.titlesGoal) earned.push(ALL_ACHIEVEMENTS[4])
  return earned
})

const latestEntries = computed(() => comicStore.entries.slice(0, 6))

// ── Helpers ──
function isImageAvatar(av) {
  return typeof av === 'string' && (av.startsWith('data:') || av.startsWith('http://') || av.startsWith('https://') || av.startsWith('/'))
}

function triggerPhotoPicker() {
  fileInputRef.value?.click()
}

function handlePhotoUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { comicStore.user.avatar = ev.target.result }
  reader.readAsDataURL(file)
  e.target.value = ''
}

function shareProfile() {
  const text = `Check out my ComicVerse profile! I've read ${comicStore.entries.length} titles 📚`
  if (navigator.share) {
    navigator.share({ title: 'ComicVerse Profile', text })
  } else {
    navigator.clipboard.writeText(text).then(() => alert('Profile info copied to clipboard!'))
  }
}

function exportBackup() {
  const data = {
    user: comicStore.user,
    entries: comicStore.entries,
    watchlist: comicStore.watchlist,
    timelineProgress: comicStore.timelineProgress,
    exportedAt: new Date().toISOString()
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `comicverse-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
}

function handleLogout() {
  close()
  comicStore.triggerLogout(router)
}

function open() {
  isOpen.value = true
  view.value = 'profile'
  document.body.style.overflow = 'hidden'
}

function close() {
  isOpen.value = false
  document.body.style.overflow = ''
}

// Global event listener
onMounted(() => {
  window.addEventListener('open-profile-modal', open)
})
onUnmounted(() => {
  window.removeEventListener('open-profile-modal', open)
})
</script>

<style scoped>
/* ── Overlay ── */
.pm-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
}

@media (min-width: 520px) {
  .pm-overlay {
    align-items: center;
  }
}

/* ── Card ── */
.pm-card {
  background: #FAF6EE;
  border: 3px solid #111;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -6px 0 #111;
  width: 100%;
  max-width: 460px;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

@media (min-width: 520px) {
  .pm-card {
    border-radius: 12px;
    box-shadow: 8px 8px 0 #111;
    max-height: 88vh;
  }
}

/* ── Header ── */
.pm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem 0.75rem;
  border-bottom: 2.5px solid #111;
  flex-shrink: 0;
}

.pm-title {
  font-family: 'Bangers', cursive;
  font-size: 1.3rem;
  letter-spacing: 0.06em;
  color: #111;
}

.pm-close-btn {
  width: 32px;
  height: 32px;
  border: 2px solid #111;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 2px 0 #111;
  transition: transform 0.1s;
}
.pm-close-btn:hover { transform: scale(1.08); }

/* ── Body ── */
.pm-body {
  overflow-y: auto;
  flex: 1;
  padding: 1.25rem 1.25rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

/* ── Avatar Section ── */
.pm-avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}

.pm-avatar-circle {
  width: 82px;
  height: 82px;
  border-radius: 50%;
  background: #1a1a2e;
  border: 3px solid #111;
  box-shadow: 4px 4px 0 #111;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}

.pm-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pm-avatar-name {
  font-family: 'Bangers', cursive;
  font-size: 1.5rem;
  letter-spacing: 0.04em;
  color: #111;
  line-height: 1.1;
}

.pm-avatar-handle {
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 0.82rem;
  font-weight: 700;
  color: #666;
}

/* ── Stats Grid ── */
.pm-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  border: 2.5px solid #111;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.pm-stat-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.1rem;
  padding: 0.75rem 0.5rem;
  border-right: 2px solid #111;
  border-bottom: 2px solid #111;
}

.pm-stat-cell:nth-child(3),
.pm-stat-cell:nth-child(6) { border-right: none; }
.pm-stat-cell:nth-child(4),
.pm-stat-cell:nth-child(5),
.pm-stat-cell:nth-child(6) { border-bottom: none; }

.pm-stat-value {
  font-family: 'Bangers', cursive;
  font-size: 1.6rem;
  letter-spacing: 0.03em;
  color: #111;
  line-height: 1;
}

.pm-stat-label {
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #888;
}

/* ── Action Row ── */
.pm-action-row {
  display: flex;
  gap: 0.65rem;
}

.pm-btn-edit {
  flex: 1;
  padding: 0.7rem 0.5rem;
  background: #EE3545;
  color: #fff;
  border: 2.5px solid #111;
  border-radius: 6px;
  font-family: 'Bangers', cursive;
  font-size: 1.05rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  box-shadow: 3px 3px 0 #9B1C28;
  transition: transform 0.1s, box-shadow 0.1s;
}
.pm-btn-edit:hover {
  transform: translateY(-2px);
  box-shadow: 3px 5px 0 #9B1C28;
}

.pm-btn-share {
  flex: 1;
  padding: 0.7rem 0.5rem;
  background: #fff;
  color: #111;
  border: 2.5px solid #111;
  border-radius: 6px;
  font-family: 'Bangers', cursive;
  font-size: 1.05rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  box-shadow: 3px 3px 0 #111;
  transition: transform 0.1s, box-shadow 0.1s;
}
.pm-btn-share:hover {
  transform: translateY(-2px);
  box-shadow: 3px 5px 0 #111;
}

/* ── Private Toggle ── */
.pm-private-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border: 2.5px solid #111;
  border-radius: 8px;
  padding: 0.7rem 1rem;
}

.pm-private-label {
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 0.88rem;
  font-weight: 700;
  color: #222;
}

.pm-toggle {
  width: 44px;
  height: 24px;
  border-radius: 12px;
  border: 2px solid #111;
  background: #ddd;
  cursor: pointer;
  position: relative;
  transition: background 0.2s;
  padding: 0;
}
.pm-toggle.on { background: #EE3545; }

.pm-toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  border: 1.5px solid #111;
  transition: transform 0.2s;
}
.pm-toggle.on .pm-toggle-thumb { transform: translateX(20px); }

/* ── Section Header ── */
.pm-section {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.pm-section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pm-section-title {
  font-family: 'Bangers', cursive;
  font-size: 1.1rem;
  letter-spacing: 0.06em;
  color: #111;
}

.pm-section-count {
  font-family: 'Bangers', cursive;
  font-size: 0.85rem;
  background: #EE3545;
  color: #fff;
  border: 2px solid #111;
  border-radius: 20px;
  padding: 0 8px;
  line-height: 1.6;
}

/* ── Achievements Grid ── */
.pm-ach-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.pm-ach-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.55rem 0.6rem;
  border: 2.5px solid #111;
  border-radius: 8px;
  min-width: 72px;
  cursor: default;
  transition: transform 0.1s;
}
.pm-ach-badge:hover { transform: translateY(-2px); }

.pm-ach-red    { background: #EE3545; color: #fff; box-shadow: 3px 3px 0 #9B1C28; }
.pm-ach-teal   { background: #00838F; color: #fff; box-shadow: 3px 3px 0 #004D40; }
.pm-ach-yellow { background: #F5D13B; color: #111; box-shadow: 3px 3px 0 #B36B0C; }
.pm-ach-green  { background: #00C853; color: #fff; box-shadow: 3px 3px 0 #1B6B2A; }

.pm-ach-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pm-ach-name {
  font-family: 'Bangers', cursive;
  font-size: 0.68rem;
  letter-spacing: 0.04em;
  text-align: center;
  line-height: 1.1;
}

/* ── Covers Grid ── */
.pm-covers-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.4rem;
}

.pm-cover-cell {
  aspect-ratio: 2/3;
  border: 2px solid #111;
  border-radius: 4px;
  overflow: hidden;
}

.pm-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ── Backup / Logout ── */
.pm-backup-row {
  display: flex;
  gap: 0.65rem;
  padding-top: 0.25rem;
}

.pm-btn-backup {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.6rem 0.5rem;
  background: #F5D13B;
  color: #111;
  border: 2.5px solid #111;
  border-radius: 6px;
  font-family: 'Bangers', cursive;
  font-size: 0.95rem;
  letter-spacing: 0.04em;
  cursor: pointer;
  box-shadow: 3px 3px 0 #B36B0C;
  transition: transform 0.1s;
}
.pm-btn-backup:hover { transform: translateY(-1px); }

.pm-btn-logout {
  padding: 0.6rem 1rem;
  background: #fff;
  color: #B71C1C;
  border: 2.5px solid #111;
  border-radius: 6px;
  font-family: 'Bangers', cursive;
  font-size: 0.95rem;
  letter-spacing: 0.04em;
  cursor: pointer;
  box-shadow: 3px 3px 0 #111;
  transition: transform 0.1s;
}
.pm-btn-logout:hover { transform: translateY(-1px); }

/* ── Edit Profile View ── */
.pm-edit-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.pm-back-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 0.85rem;
  font-weight: 700;
  color: #555;
  cursor: pointer;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  transition: color 0.1s;
}
.pm-back-btn:hover { color: #111; }

.pm-edit-title {
  font-family: 'Bangers', cursive;
  font-size: 1.15rem;
  letter-spacing: 0.06em;
  color: #111;
}

.pm-edit-avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.pm-avatar-edit {
  cursor: pointer;
}

.pm-avatar-edit-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.15s;
}
.pm-avatar-edit:hover .pm-avatar-edit-overlay { opacity: 1; }

.pm-avatar-emoji-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  justify-content: center;
}

.pm-avatar-emoji-btn {
  width: 38px;
  height: 38px;
  font-size: 1.3rem;
  background: #fff;
  border: 2px solid #111;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s;
}
.pm-avatar-emoji-btn.active {
  background: #F5D13B;
  box-shadow: 2px 2px 0 #111;
  transform: translateY(-2px);
}

.pm-edit-form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.pm-field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.pm-field-label {
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #555;
}

.pm-field-input {
  width: 100%;
  padding: 0.6rem 0.75rem;
  background: #fff;
  border: 2.5px solid #111;
  border-radius: 6px;
  font-family: var(--font-body, 'Inter', sans-serif);
  font-size: 0.9rem;
  font-weight: 600;
  color: #111;
  outline: none;
  box-sizing: border-box;
  transition: box-shadow 0.15s;
}
.pm-field-input:focus { box-shadow: 0 0 0 3px rgba(238, 53, 69, 0.25); }

.pm-field-input-wrap {
  display: flex;
  align-items: center;
  background: #fff;
  border: 2.5px solid #111;
  border-radius: 6px;
  overflow: hidden;
}

.pm-field-at {
  padding: 0 0.5rem;
  font-family: 'Bangers', cursive;
  font-size: 1.1rem;
  color: #888;
  border-right: 2px solid #ddd;
}

.pm-field-input-handle {
  border: none !important;
  border-radius: 0 !important;
  flex: 1;
}
.pm-field-input-handle:focus { box-shadow: none; }

.pm-field-textarea {
  resize: vertical;
  min-height: 60px;
}

.pm-btn-save {
  width: 100%;
  padding: 0.85rem;
  background: #EE3545;
  color: #fff;
  border: 2.5px solid #111;
  border-radius: 8px;
  font-family: 'Bangers', cursive;
  font-size: 1.15rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  box-shadow: 4px 4px 0 #9B1C28;
  transition: transform 0.1s, box-shadow 0.1s;
}
.pm-btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 4px 6px 0 #9B1C28;
}

/* ── Transition ── */
.profile-modal-enter-active {
  transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.profile-modal-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.profile-modal-enter-from {
  opacity: 0;
}
.profile-modal-leave-to {
  opacity: 0;
}
.profile-modal-enter-from .pm-card {
  transform: translateY(28px) scale(0.96);
}
.profile-modal-leave-to .pm-card {
  transform: translateY(16px) scale(0.97);
}
</style>
