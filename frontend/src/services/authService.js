import api from './api'

const USER_SESSION_KEY = 'comicverse_user'

const DEFAULT_USER = {
  isLoggedIn: false,
  name: 'Captain Comic',
  username: 'captain_comic',
  email: 'reader@comicverse.online',
  avatar: 'HERO',
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
      const response = await api.post('/login', credentials)
      if (response.data?.token) {
        localStorage.setItem('auth_token', response.data.token)
      }
      const user = response.data?.user || credentials
      user.isLoggedIn = true
      this.saveLocalUser(user)
      return user
    } catch (err) {
      console.warn('Backend API login failed or offline, falling back to local session', err)
      const localUser = {
        ...this.getLocalUser(),
        isLoggedIn: true,
        email: credentials.email || 'reader@comicverse.online',
        name: credentials.username || 'Captain Comic'
      }
      this.saveLocalUser(localUser)
      return localUser
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/register', userData)
      if (response.data?.token) {
        localStorage.setItem('auth_token', response.data.token)
      }
      const user = response.data?.user || userData
      user.isLoggedIn = true
      this.saveLocalUser(user)
      return user
    } catch (err) {
      console.warn('Backend API register failed or offline, falling back to local session', err)
      const localUser = {
        ...this.getLocalUser(),
        isLoggedIn: true,
        name: userData.name || userData.username || 'Comic Fan',
        email: userData.email || ''
      }
      this.saveLocalUser(localUser)
      return localUser
    }
  },

  async logout() {
    try {
      await api.post('/logout')
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('auth_token')
      const localUser = this.getLocalUser()
      localUser.isLoggedIn = false
      this.saveLocalUser(localUser)
    }
  },

  async fetchCurrentUser() {
    try {
      const response = await api.get('/user')
      if (response.data?.user) {
        const user = { ...response.data.user, isLoggedIn: true }
        this.saveLocalUser(user)
        return user
      }
    } catch {
      // Return local stored user profile if offline
    }
    return this.getLocalUser()
  },

  async loginWithGoogle(googleData = {}) {
    try {
      const response = await api.post('/auth/google/token', googleData)
      if (response.data?.token) {
        localStorage.setItem('auth_token', response.data.token)
      }
      const user = response.data?.user || {
        name: googleData.name || 'Comic Fan',
        email: googleData.email || 'reader@comicverse.online',
      }
      user.isLoggedIn = true
      this.saveLocalUser(user)
      return user
    } catch (err) {
      console.warn('Backend API Google Auth failed or offline, using fallback session', err)
      const localUser = {
        ...this.getLocalUser(),
        isLoggedIn: true,
        name: googleData.name || 'Captain Comic',
        email: googleData.email || 'captain@comicverse.online'
      }
      this.saveLocalUser(localUser)
      return localUser
    }
  },

  getGoogleRedirectUrl() {
    return `${api.defaults.baseURL}/auth/google/redirect`
  }
}
