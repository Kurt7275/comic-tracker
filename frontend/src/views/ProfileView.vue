<template>
  <div class="profile-page">
    <Navbar />

    <main class="profile-main fade-in-contents">
      <section class="profile-header">
        <div class="comic-badge-yellow" style="margin-bottom: 0.35rem;">HERO PROFILE</div>
        <h1 class="profile-title">READER SETTINGS &amp; BACKUP</h1>
      </section>

      <div class="profile-card">
        <!-- Avatar Row -->
        <div class="profile-avatar-row">
          <div class="avatar-display-box">
            <img v-if="isImageAvatar(comicStore.user.avatar)" :src="comicStore.user.avatar" alt="Avatar" style="width:100%; height:100%; object-fit:cover; border-radius:6px;" />
            <span v-else>{{ comicStore.user.avatar || '🦸‍♂️' }}</span>
          </div>
          <div>
            <h2 style="font-family: var(--font-comic); font-size: 1.8rem;">{{ comicStore.user.name }}</h2>
            <div style="font-family: var(--font-body); font-size: 0.85rem; font-weight: 700; color: #666;">
              @{{ comicStore.user.username }} • Level {{ comicStore.user.level }}
            </div>
          </div>
        </div>

        <!-- Avatar Choice Pills & Upload -->
        <div>
          <label class="f-input-label">Pick Superhero Avatar or Upload Photo</label>
          <div class="avatar-options-row">
            <button
              v-for="av in ['🦸‍♂️', '🦹‍♂️', '🦇', '🕷️', '⚡', '🏴‍☠️', '⚔️', '🐲', '🧙‍♂️', '🥷', '🤖', '🔥']"
              :key="av"
              class="avatar-pick-btn"
              :class="{ active: comicStore.user.avatar === av }"
              @click="comicStore.user.avatar = av"
            >
              {{ av }}
            </button>

            <button type="button" class="avatar-pick-btn upload-btn" @click="triggerPhotoPicker" title="Upload Custom Photo">
              📷
            </button>
            <input ref="fileInputRef" type="file" accept="image/*" style="display:none" @change="handlePhotoUpload" />
          </div>
        </div>

        <!-- Form fields -->
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div class="f-input-field">
            <label class="f-input-label">Display Name</label>
            <input v-model="comicStore.user.name" type="text" class="f-input-box" />
          </div>

          <div class="f-input-field">
            <label class="f-input-label">Username</label>
            <input v-model="comicStore.user.username" type="text" class="f-input-box" />
          </div>

          <div class="f-input-field">
            <label class="f-input-label">Bio / Favorite Sagas</label>
            <textarea v-model="comicStore.user.bio" rows="2" class="f-input-box" style="height: auto; padding: 0.5rem;"></textarea>
          </div>

          <div class="f-input-field">
            <label class="f-input-label">Favorite Comic Quote</label>
            <input v-model="comicStore.user.favoriteQuote" type="text" class="f-input-box" />
          </div>
        </div>

        <!-- Backup & Export -->
        <div class="backup-actions-box">
          <h3 style="font-family: var(--font-comic); font-size: 1.4rem;">DATA VAULT BACKUP</h3>
          <p style="font-family: var(--font-body); font-size: 0.85rem; font-weight: 700; color: #666;">
            Export all your comic tracking records, reading history, and custom notes to a portable JSON backup file.
          </p>

          <div style="display: flex; gap: 0.75rem; margin-top: 0.75rem;">
            <button type="button" class="btn-comic-yellow" @click="exportBackup">
              ⬇ Download JSON Backup
            </button>
            <button type="button" class="btn-comic-red" style="background: #FFF; color: #B71C1C;" @click="handleLogout">
              Log Out
            </button>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import { comicStore } from '../stores/useComicStore.js'

const router = useRouter()
const fileInputRef = ref(null)

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
  reader.onload = (ev) => {
    comicStore.user.avatar = ev.target.result
  }
  reader.readAsDataURL(file)
  e.target.value = ''
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
  comicStore.triggerLogout(router)
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: var(--f-bg);
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.08) 1.2px, transparent 1.2px);
  background-size: 13px 13px;
  display: flex;
  flex-direction: column;
}

.profile-main {
  max-width: 1080px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-title {
  font-family: var(--font-comic);
  font-size: 2.8rem;
  line-height: 1;
  color: var(--f-text);
  letter-spacing: 0.04em;
}

.profile-card {
  background: #FFF;
  border: 3px solid #111;
  border-radius: 8px;
  padding: 1.75rem;
  box-shadow: 6px 6px 0 var(--theme-shadow);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-avatar-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 2px solid #EEE;
  padding-bottom: 1.25rem;
}

.btn-edit-modal-trigger {
  margin-top: 0.4rem;
  font-family: var(--font-comic);
  font-size: 0.9rem;
  padding: 0.25rem 0.65rem;
  background: #F5D13B;
  color: #111;
  border: 2px solid #111;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 2px 2px 0 #111;
  transition: transform 0.1s ease;
}

.btn-edit-modal-trigger:hover {
  transform: translateY(-1px);
}

.avatar-display-box {
  width: 70px;
  height: 70px;
  background: var(--f-yellow);
  border: 3px solid #111;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  box-shadow: 3px 3px 0 var(--theme-shadow);
}

.avatar-options-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.4rem;
}

.avatar-pick-btn {
  font-size: 1.6rem;
  width: 44px;
  height: 44px;
  background: var(--f-bg);
  border: 2px solid #111;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 100ms;
}

.avatar-pick-btn.active {
  background: var(--f-yellow);
  box-shadow: 2px 2px 0 var(--theme-shadow);
  transform: translateY(-2px);
}

.backup-actions-box {
  background: var(--f-bg);
  border: 2px solid #111;
  border-radius: 6px;
  padding: 1.25rem;
}
</style>
