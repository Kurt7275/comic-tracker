import { computed } from 'vue'
import { useUiStore } from '../stores/useUiStore'

export function useTheme() {
  const currentTheme = computed(() => useUiStore.theme)
  const isDarkMode = computed(() => useUiStore.isDarkMode)

  function setTheme(name) {
    useUiStore.setTheme(name)
  }

  function toggleDarkMode() {
    useUiStore.toggleDarkMode()
  }

  return {
    theme: currentTheme,
    isDarkMode,
    setTheme,
    toggleDarkMode
  }
}
