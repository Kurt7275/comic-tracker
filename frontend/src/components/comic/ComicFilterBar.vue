<template>
  <div class="comic-filter-bar">
    <!-- Search Bar -->
    <div class="search-input-wrap">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        :value="searchQuery"
        type="text"
        placeholder="Search comics, manhwa, publishers..."
        class="search-input"
        @input="$emit('update:searchQuery', $event.target.value)"
      />
    </div>

    <!-- Status Tabs -->
    <div class="status-tabs">
      <button
        v-for="status in statuses"
        :key="status"
        class="tab-btn"
        :class="{ active: selectedStatus === status }"
        @click="$emit('update:selectedStatus', status)"
      >
        {{ status }}
      </button>
    </div>

    <!-- Type & Sort Selectors -->
    <div class="selectors-wrap">
      <select
        :value="selectedType"
        class="filter-select"
        @change="$emit('update:selectedType', $event.target.value)"
      >
        <option value="All">All Formats</option>
        <option value="Comic">Comic</option>
        <option value="Manga">Manga</option>
        <option value="Manhwa">Manhwa</option>
        <option value="Webtoon">Webtoon</option>
      </select>

      <select
        :value="sortBy"
        class="filter-select"
        @change="$emit('update:sortBy', $event.target.value)"
      >
        <option value="lastRead">Recently Read</option>
        <option value="rating">Highest Rated</option>
        <option value="title">Title (A-Z)</option>
        <option value="progress">Reading Progress</option>
      </select>
    </div>
  </div>
</template>

<script setup>
defineProps({
  searchQuery: { type: String, default: '' },
  selectedStatus: { type: String, default: 'All' },
  selectedType: { type: String, default: 'All' },
  sortBy: { type: String, default: 'lastRead' }
})

defineEmits([
  'update:searchQuery',
  'update:selectedStatus',
  'update:selectedType',
  'update:sortBy'
])

const statuses = ['All', 'Reading', 'Completed', 'Plan to Read', 'On Hold']
</script>

<style scoped>
.comic-filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: var(--bg-card, #131b2e);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  border-radius: 16px;
  padding: 0.85rem 1.25rem;
}

.search-input-wrap {
  position: relative;
  flex: 1 1 240px;
  max-width: 380px;
}

.search-icon {
  position: absolute;
  left: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--text-muted, #94a3b8);
}

.search-input {
  width: 100%;
  padding: 0.55rem 0.85rem 0.55rem 2.4rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #ffffff;
  font-size: 0.88rem;
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.2);
}

.status-tabs {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  overflow-x: auto;
}

.tab-btn {
  padding: 0.45rem 0.85rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  color: var(--text-muted, #94a3b8);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.04);
}

.tab-btn.active {
  background: rgba(124, 58, 237, 0.2);
  color: #a78bfa;
  border-color: rgba(124, 58, 237, 0.4);
}

.selectors-wrap {
  display: flex;
  gap: 0.5rem;
}

.filter-select {
  padding: 0.45rem 0.75rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.82rem;
  font-weight: 600;
  outline: none;
  cursor: pointer;
}

.filter-select option {
  background: #131b2e;
  color: #fff;
}
</style>
