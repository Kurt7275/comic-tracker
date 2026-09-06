import { reactive, watch } from 'vue'
import { comicService } from '../services/comicService'
import { timelineService } from '../services/timelineService'
import { useAuthStore } from './useAuthStore'
import { useUiStore } from './useUiStore'

const GOAL_KEY = 'comicverse-reading-goal'

export const comicStore = reactive({
  // Forwarded Auth and UI references for backward compatibility
  get user() {
    return useAuthStore.user
  },
  get theme() {
    return useUiStore.theme
  },
  set theme(val) {
    useUiStore.setTheme(val)
  },
  get isDarkMode() {
    return useUiStore.isDarkMode
  },
  set isDarkMode(val) {
    useUiStore.isDarkMode = val
  },
  get isLoggingOut() {
    return useAuthStore.isLoggingOut
  },

  // Shelf entries
  entries: comicService.getLocalEntries(),

  // Watchlist items
  watchlist: comicService.getLocalWatchlist(),

  // Universe checklist progress map
  timelineProgress: timelineService.getLocalProgress(),

  // Annual reading goal
  goal: (() => {
    try {
      const raw = localStorage.getItem(GOAL_KEY)
      return raw ? JSON.parse(raw) : { year: new Date().getFullYear(), titlesGoal: 50, chaptersGoal: 1000 }
    } catch {
      return { year: new Date().getFullYear(), titlesGoal: 50, chaptersGoal: 1000 }
    }
  })(),

  // Delegates for Auth actions
  login(userData) {
    return useAuthStore.login(userData)
  },
  logout() {
    return useAuthStore.logout()
  },
  triggerLogout(router) {
    return useAuthStore.triggerLogout(router)
  },
  addXp(amount) {
    return useAuthStore.addXp(amount)
  },

  // Delegates for UI actions
  setTheme(themeName) {
    useUiStore.setTheme(themeName)
  },
  toggleDarkMode() {
    useUiStore.toggleDarkMode()
  },

  // Comic entries CRUD actions
  async addEntry(newEntry) {
    const entry = {
      id: 'entry-' + Date.now(),
      title: newEntry.title || 'Untitled Comic',
      type: newEntry.type || 'Manga',
      status: newEntry.status || 'Reading',
      chapter: Number(newEntry.chapter) || 0,
      totalChapters: Number(newEntry.totalChapters) || 0,
      volume: Number(newEntry.volume) || 0,
      totalVolumes: Number(newEntry.totalVolumes) || 0,
      rating: Number(newEntry.rating) || 0,
      cover: newEntry.cover || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
      synopsis: newEntry.synopsis || '',
      publisher: newEntry.publisher || 'Independent',
      genres: newEntry.genres || ['Action'],
      pinned: false,
      streakDays: 1,
      lastReadAt: Date.now(),
      notes: newEntry.notes || ''
    }

    const created = await comicService.createComic(entry)
    this.entries.unshift(created)
    this.saveEntries()
    useAuthStore.addXp(50)
  },

  async updateEntry(id, updatedFields) {
    const idx = this.entries.findIndex(e => e.id === id)
    if (idx !== -1) {
      this.entries[idx] = { ...this.entries[idx], ...updatedFields }
      await comicService.updateComic(id, updatedFields)
      this.saveEntries()
    }
  },

  async incrementChapter(id, delta = 1) {
    const entry = this.entries.find(e => e.id === id)
    if (entry) {
      const nextCh = Math.max(0, (entry.chapter || 0) + delta)
      entry.chapter = entry.totalChapters ? Math.min(nextCh, entry.totalChapters) : nextCh
      entry.lastReadAt = Date.now()
      if (entry.totalChapters && entry.chapter >= entry.totalChapters) {
        entry.status = 'Completed'
        useAuthStore.addXp(100)
      } else {
        useAuthStore.addXp(15)
      }
      await comicService.updateComic(id, { chapter: entry.chapter, status: entry.status, lastReadAt: entry.lastReadAt })
      this.saveEntries()
    }
  },

  async deleteEntry(id) {
    this.entries = this.entries.filter(e => e.id !== id)
    await comicService.deleteComic(id)
    this.saveEntries()
  },

  saveEntries() {
    comicService.saveLocalEntries(this.entries)
  },

  saveWatchlist() {
    comicService.saveLocalWatchlist(this.watchlist)
  },

  toggleTimelineIssue(issueId) {
    const nextState = !this.timelineProgress[issueId]
    this.timelineProgress[issueId] = nextState
    timelineService.saveLocalProgress(this.timelineProgress)
  }
})

// Auto-sync entries watcher
watch(() => comicStore.entries, () => {
  comicStore.saveEntries()
}, { deep: true })

// Auto-sync watchlist watcher
watch(() => comicStore.watchlist, () => {
  comicStore.saveWatchlist()
}, { deep: true })
