// ComicVerse Store & Persistence Layer
import { reactive, watch } from 'vue'

const USER_SESSION_KEY = 'comicverse_user'
const SHELF_CACHE_KEY = 'comicverse-entries-cache'
const WATCHLIST_KEY = 'comicverse-watchlist-cache'
const THEME_KEY = 'comicverse-bgtheme'
const DARK_MODE_KEY = 'comicverse-dark'
const TIMELINE_PROGRESS_KEY = 'comicverse-timeline-progress'
const GOAL_KEY = 'comicverse-reading-goal'

// Preloaded mock data for instant wow-factor
const INITIAL_ENTRIES = [
  {
    id: 'entry-1',
    title: 'Solo Leveling',
    type: 'Manhwa',
    status: 'Reading',
    chapter: 142,
    totalChapters: 179,
    volume: 12,
    totalVolumes: 14,
    rating: 9.5,
    cover: 'https://upload.wikimedia.org/wikipedia/en/6/6c/Solo_Leveling_Volume_1_Cover.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail_unscaled',
    synopsis: 'In a world where hunters must battle deadly monsters to protect humanity, Sung Jinwoo, notoriously known as the weakest hunter of all mankind, finds himself in a mysterious dual dungeon.',
    publisher: 'D&C Media / KakaoPage',
    genres: ['Action', 'Fantasy', 'Supernatural'],
    pinned: true,
    streakDays: 14,
    lastReadAt: Date.now() - 3600000 * 2,
    notes: 'Chapter 140 Monarch fight was absolutely legendary art!!'
  },
  {
    id: 'entry-2',
    title: 'Batman: The Court of Owls',
    type: 'Comic',
    status: 'Completed',
    chapter: 11,
    totalChapters: 11,
    volume: 1,
    totalVolumes: 1,
    rating: 10,
    cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    synopsis: 'Batman discovers evidence that the shadowy secret society known as the Court of Owls is not just a Gotham City myth, but a sinister reality that has controlled Gotham from the shadows for centuries.',
    publisher: 'DC Comics',
    genres: ['Action', 'Mystery', 'Superhero'],
    pinned: true,
    streakDays: 7,
    lastReadAt: Date.now() - 86400000 * 3,
    notes: 'Scott Snyder & Greg Capullo at their finest. Labyrinth issue #5 is a masterpiece.'
  },
  {
    id: 'entry-3',
    title: 'One Piece',
    type: 'Manga',
    status: 'Reading',
    chapter: 1115,
    totalChapters: 1120,
    volume: 108,
    totalVolumes: 109,
    rating: 10,
    cover: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    synopsis: 'Monkey D. Luffy refuses to let anyone or anything stand in the way of his quest to become the King of All Pirates. With a course charted for the treacherous waters of the Grand Line and beyond.',
    publisher: 'Shueisha / Shonen Jump',
    genres: ['Adventure', 'Shonen', 'Fantasy'],
    pinned: true,
    streakDays: 24,
    lastReadAt: Date.now() - 86400000,
    notes: 'Egghead Island lore drops are breaking the internet weekly!'
  },
  {
    id: 'entry-4',
    title: 'Spider-Man: Into the Spider-Verse (Comic Event)',
    type: 'Comic',
    status: 'Completed',
    chapter: 18,
    totalChapters: 18,
    volume: 3,
    totalVolumes: 3,
    rating: 9.0,
    cover: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=600&auto=format&fit=crop&q=80',
    synopsis: 'Every Spider-Man ever teams up to take down the Inheritors, a family of vampiric beings who feast on the life-force of spider-totems across all dimensions.',
    publisher: 'Marvel Comics',
    genres: ['Superhero', 'Multiverse', 'Sci-Fi'],
    pinned: false,
    streakDays: 4,
    lastReadAt: Date.now() - 86400000 * 5,
    notes: 'Incredible multiverse crossover. Miles Morales & Spider-Gwen shine.'
  },
  {
    id: 'entry-5',
    title: 'Chainsaw Man',
    type: 'Manga',
    status: 'Reading',
    chapter: 165,
    totalChapters: 175,
    volume: 17,
    totalVolumes: 18,
    rating: 9.2,
    cover: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    synopsis: 'Denji is a teenage boy living with a Chainsaw Devil named Pochita. Due to the debt his father left behind, he has been living a rock-bottom life while harvesting devil corpses with Pochita.',
    publisher: 'Shueisha',
    genres: ['Action', 'Dark Fantasy', 'Supernatural'],
    pinned: false,
    streakDays: 9,
    lastReadAt: Date.now() - 86400000 * 2,
    notes: 'Fujimoto continues to defy all shonen storytelling conventions.'
  },
  {
    id: 'entry-6',
    title: 'Tower of God',
    type: 'Webtoon',
    status: 'Plan to Read',
    chapter: 0,
    totalChapters: 600,
    volume: 0,
    totalVolumes: 15,
    rating: 0,
    cover: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    synopsis: 'What do you desire? Money and wealth? Honor and pride? Authority and power? Revenge? Or something that transcends them all? Whatever you desire—it is here, at the top of the Tower.',
    publisher: 'Naver Webtoon',
    genres: ['Action', 'Adventure', 'Mystery'],
    pinned: false,
    streakDays: 0,
    lastReadAt: null,
    notes: 'Recommended by friend, high priority after Solo Leveling!'
  }
]

// Load cached data helpers
function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (e) {
    return fallback
  }
}

export const comicStore = reactive({
  // Auth state
  user: loadJSON(USER_SESSION_KEY, {
    isLoggedIn: false,
    name: 'Captain Comic',
    username: 'captain_comic',
    email: 'reader@comicverse.online',
    avatar: '🦸‍♂️',
    bio: 'Comic archivist, manga binger, and multiverse explorer.',
    favoriteUniverse: 'Marvel & Shonen',
    favoriteQuote: 'With great power comes great responsibility.',
    level: 5,
    xp: 2850,
    nextLevelXp: 3500,
    streakDays: 14,
    longestStreak: 28,
    lastActiveDate: new Date().toISOString().split('T')[0]
  }),

  // Theme state
  theme: localStorage.getItem(THEME_KEY) || 'comic',
  isDarkMode: localStorage.getItem(DARK_MODE_KEY) !== 'false',

  // Shelf entries
  entries: loadJSON(SHELF_CACHE_KEY, INITIAL_ENTRIES),

  // Watchlist items
  watchlist: loadJSON(WATCHLIST_KEY, [
    {
      id: 'watch-1',
      title: 'Invincible (Season 2)',
      type: 'TV Show',
      status: 'Watching',
      currentEpisode: 6,
      totalEpisodes: 8,
      season: 2,
      rating: 9.5,
      cover: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
      notes: 'Omni-Man and Mark story arc is peaking!'
    },
    {
      id: 'watch-2',
      title: 'Solo Leveling (Anime Season 1)',
      type: 'Anime Show',
      status: 'Completed',
      currentEpisode: 12,
      totalEpisodes: 12,
      season: 1,
      rating: 9.0,
      cover: 'https://upload.wikimedia.org/wikipedia/en/6/6c/Solo_Leveling_Volume_1_Cover.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail_unscaled',
      notes: 'A-1 Pictures nailed the shadow arise sequences.'
    }
  ]),

  // Universe checklist progress
  timelineProgress: loadJSON(TIMELINE_PROGRESS_KEY, {}),

  // Annual reading goal
  goal: loadJSON(GOAL_KEY, {
    year: new Date().getFullYear(),
    titlesGoal: 50,
    chaptersGoal: 1000
  }),

  isLoggingOut: false,

  // Actions
  login(userData) {
    this.user.isLoggedIn = true
    if (userData) {
      this.user.name = userData.name || this.user.name
      this.user.email = userData.email || this.user.email
      this.user.username = userData.username || this.user.username
    }
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(this.user))
  },

  logout() {
    this.user.isLoggedIn = false
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(this.user))
  },

  triggerLogout(router) {
    if (this.isLoggingOut) return
    this.isLoggingOut = true
    setTimeout(() => {
      this.logout()
      this.isLoggingOut = false
      if (router) {
        router.push('/')
      }
    }, 1800)
  },

  setTheme(themeName) {
    this.theme = themeName
    localStorage.setItem(THEME_KEY, themeName)
  },

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode
    localStorage.setItem(DARK_MODE_KEY, String(this.isDarkMode))
    if (this.isDarkMode) {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
    }
  },

  addEntry(newEntry) {
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
    this.entries.unshift(entry)
    this.saveEntries()
    this.addXp(50)
  },

  updateEntry(id, updatedFields) {
    const idx = this.entries.findIndex(e => e.id === id)
    if (idx !== -1) {
      this.entries[idx] = { ...this.entries[idx], ...updatedFields }
      this.saveEntries()
    }
  },

  incrementChapter(id, delta = 1) {
    const entry = this.entries.find(e => e.id === id)
    if (entry) {
      const nextCh = Math.max(0, (entry.chapter || 0) + delta)
      entry.chapter = entry.totalChapters ? Math.min(nextCh, entry.totalChapters) : nextCh
      entry.lastReadAt = Date.now()
      if (entry.totalChapters && entry.chapter >= entry.totalChapters) {
        entry.status = 'Completed'
        this.addXp(100)
      } else {
        this.addXp(15)
      }
      this.saveEntries()
    }
  },

  deleteEntry(id) {
    this.entries = this.entries.filter(e => e.id !== id)
    this.saveEntries()
  },

  saveEntries() {
    localStorage.setItem(SHELF_CACHE_KEY, JSON.stringify(this.entries))
  },

  addXp(amount) {
    this.user.xp += amount
    if (this.user.xp >= this.user.nextLevelXp) {
      this.user.level += 1
      this.user.nextLevelXp = Math.floor(this.user.nextLevelXp * 1.4)
    }
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(this.user))
  }
})

// Auto-sync entries watcher
watch(() => comicStore.entries, () => {
  comicStore.saveEntries()
}, { deep: true })

// Auto-sync user watcher
watch(() => comicStore.user, () => {
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(comicStore.user))
}, { deep: true })
