import { reactive, watch } from 'vue'
import { authService } from '../services/authService'

const LOGOUT_OVERLAY_DURATION_MS = 1450

export const useAuthStore = reactive({
  user: authService.getLocalUser(),
  isLoggingOut: false,

  async login(userData) {
    const userResult = await authService.login(userData)
    this.user.isLoggedIn = true
    if (userResult) {
      this.user.name = userResult.name || this.user.name
      this.user.email = userResult.email || this.user.email
      this.user.username = userResult.username || this.user.username
    }
    authService.saveLocalUser(this.user)
  },

  async register(userData) {
    const userResult = await authService.register(userData)
    this.user.isLoggedIn = true
    if (userResult) {
      this.user.name = userResult.name || this.user.name
      this.user.email = userResult.email || this.user.email
      this.user.username = userResult.username || this.user.username
    }
    authService.saveLocalUser(this.user)
  },

  async logout() {
    await authService.logout()
    this.user.isLoggedIn = false
    authService.saveLocalUser(this.user)
  },

  triggerLogout(router) {
    if (this.isLoggingOut) return
    this.isLoggingOut = true

    setTimeout(() => {
      this.user.isLoggedIn = false
      localStorage.removeItem('auth_token')
      authService.saveLocalUser(this.user)
      this.isLoggingOut = false
      if (router) {
        router.push('/room')
      }

      authService.logout()
    }, LOGOUT_OVERLAY_DURATION_MS)
  },

  addXp(amount) {
    this.user.xp += amount
    if (this.user.xp >= this.user.nextLevelXp) {
      this.user.level += 1
      this.user.nextLevelXp = Math.floor(this.user.nextLevelXp * 1.4)
    }
    authService.saveLocalUser(this.user)
  }
})

watch(() => useAuthStore.user, (newVal) => {
  authService.saveLocalUser(newVal)
}, { deep: true })
