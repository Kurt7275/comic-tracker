import api from './api'

const SHELF_CACHE_KEY = 'comicverse-entries-cache'
const WATCHLIST_KEY = 'comicverse-watchlist-cache'

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
    synopsis: 'Monkey D. Luffy refuses to let anyone or anything stand in the way of his quest to become the King of All Pirates.',
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
    synopsis: 'Every Spider-Man ever teams up to take down the Inheritors.',
    publisher: 'Marvel Comics',
    genres: ['Superhero', 'Multiverse', 'Sci-Fi'],
    pinned: false,
    streakDays: 4,
    lastReadAt: Date.now() - 86400000 * 5,
    notes: 'Incredible multiverse crossover.'
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
    synopsis: 'Denji is a teenage boy living with a Chainsaw Devil named Pochita.',
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
    synopsis: 'What do you desire? Money and wealth? Honor and pride? Whatever you desire—it is here.',
    publisher: 'Naver Webtoon',
    genres: ['Action', 'Adventure', 'Mystery'],
    pinned: false,
    streakDays: 0,
    lastReadAt: null,
    notes: 'Recommended by friend!'
  }
]

export const comicService = {
  // Local persistence helpers
  getLocalEntries() {
    try {
      const raw = localStorage.getItem(SHELF_CACHE_KEY)
      return raw ? JSON.parse(raw) : INITIAL_ENTRIES
    } catch {
      return INITIAL_ENTRIES
    }
  },

  saveLocalEntries(entries) {
    localStorage.setItem(SHELF_CACHE_KEY, JSON.stringify(entries))
  },

  getLocalWatchlist() {
    try {
      const raw = localStorage.getItem(WATCHLIST_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  },

  saveLocalWatchlist(watchlist) {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist))
  },

  // API calls with local fallback
  async fetchComics() {
    try {
      const res = await api.get('/comics')
      return res.data
    } catch (err) {
      console.warn('Backend API /comics offline, using cached local entries', err)
      return this.getLocalEntries()
    }
  },

  async createComic(newEntry) {
    try {
      const res = await api.post('/comics', newEntry)
      return res.data
    } catch (err) {
      console.warn('Backend API /comics offline, saving locally', err)
      return {
        id: 'entry-' + Date.now(),
        ...newEntry
      }
    }
  },

  async updateComic(id, updatedFields) {
    try {
      const res = await api.put(`/comics/${id}`, updatedFields)
      return res.data
    } catch (err) {
      console.warn('Backend API offline for update, handling locally', err)
      return { id, ...updatedFields }
    }
  },

  async deleteComic(id) {
    try {
      await api.delete(`/comics/${id}`)
    } catch (err) {
      console.warn('Backend API offline for delete, handling locally', err)
    }
  }
}
