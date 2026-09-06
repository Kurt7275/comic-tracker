import api from './api'

const USER_SESSION_KEY = 'comicverse_user'

const DEFAULT_USER = {
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
}

export const authService = {
  // Retrieve saved user profile or default
  getLocalUser() {
    try {
      const raw = localStorage.getItem(USER_SESSION_KEY)
      return raw ? JSON.parse(raw) : { ...DEFAULT_USER }
    } catch {
      return { ...DEFAULT_USER }
    }
  },

  saveLocalUser(user) {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user))
  },

  // Backend API login call with local fallback
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      if (response.data?.token) {
        localStorage.setItem('auth_token', response.data.token)
      }
      return response.data?.user || credentials
    } catch (err) {
      console.warn('Backend API login offline, falling back to local session', err)
      return {
        ...this.getLocalUser(),
        isLoggedIn: true,
        email: credentials.email || 'reader@comicverse.online',
        name: credentials.username || 'Captain Comic'
      }
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      if (response.data?.token) {
        localStorage.setItem('auth_token', response.data.token)
      }
      return response.data?.user || userData
    } catch (err) {
      console.warn('Backend API register offline, falling back to local session', err)
      return {
        ...this.getLocalUser(),
        isLoggedIn: true,
        name: userData.name || userData.username || 'Comic Fan',
        email: userData.email || ''
      }
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout')
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('auth_token')
    }
  }
}
