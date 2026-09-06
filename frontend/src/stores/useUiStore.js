import { reactive, watch } from 'vue'

const THEME_KEY = 'comicverse-bgtheme'
const DARK_MODE_KEY = 'comicverse-dark'

export const useUiStore = reactive({
  theme: localStorage.getItem(THEME_KEY) || 'comic',
  isDarkMode: localStorage.getItem(DARK_MODE_KEY) !== 'false',
  activeModal: null, // 'add', 'share', 'logout', etc.

  setTheme(themeName) {
    this.theme = themeName
    localStorage.setItem(THEME_KEY, themeName)
  },

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode
    localStorage.setItem(DARK_MODE_KEY, String(this.isDarkMode))
    this.applyDarkModeAttribute()
  },

  applyDarkModeAttribute() {
    if (this.isDarkMode) {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
    }
  },

  openModal(modalName) {
    this.activeModal = modalName
  },

  closeModal() {
    this.activeModal = null
  }
})

// Apply initial dark mode attribute on startup
useUiStore.applyDarkModeAttribute()

watch(() => useUiStore.theme, (newVal) => {
  localStorage.setItem(THEME_KEY, newVal)
})
