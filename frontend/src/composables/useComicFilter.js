import { ref, computed } from 'vue'

export function useComicFilter(entriesRef) {
  const searchQuery = ref('')
  const selectedStatus = ref('All')
  const selectedType = ref('All')
  const sortBy = ref('lastRead') // 'lastRead', 'rating', 'title', 'progress'

  const filteredEntries = computed(() => {
    let list = entriesRef.value || []

    // Search filter
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      list = list.filter(item =>
        item.title.toLowerCase().includes(q) ||
        (item.publisher && item.publisher.toLowerCase().includes(q)) ||
        (item.genres && item.genres.some(g => g.toLowerCase().includes(q)))
      )
    }

    // Status filter
    if (selectedStatus.value !== 'All') {
      list = list.filter(item => item.status === selectedStatus.value)
    }

    // Type filter
    if (selectedType.value !== 'All') {
      list = list.filter(item => item.type === selectedType.value)
    }

    // Sorting
    return [...list].sort((a, b) => {
      if (sortBy.value === 'rating') {
        return (b.rating || 0) - (a.rating || 0)
      }
      if (sortBy.value === 'title') {
        return a.title.localeCompare(b.title)
      }
      if (sortBy.value === 'progress') {
        const pctA = a.totalChapters ? a.chapter / a.totalChapters : 0
        const pctB = b.totalChapters ? b.chapter / b.totalChapters : 0
        return pctB - pctA
      }
      // Default: lastRead
      return (b.lastReadAt || 0) - (a.lastReadAt || 0)
    })
  })

  return {
    searchQuery,
    selectedStatus,
    selectedType,
    sortBy,
    filteredEntries
  }
}
