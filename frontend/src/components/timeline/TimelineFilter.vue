<template>
  <div class="timeline-filter">
    <div class="universe-tabs">
      <button
        v-for="universe in universes"
        :key="universe.id"
        class="universe-tab"
        :class="{ active: selectedUniverse === universe.id }"
        @click="$emit('update:selectedUniverse', universe.id)"
      >
        <span class="univ-name">{{ universe.name }}</span>
      </button>
    </div>

    <div class="search-box">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        :value="searchQuery"
        type="text"
        placeholder="Filter timeline events..."
        class="search-input"
        @input="$emit('update:searchQuery', $event.target.value)"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  universes: { type: Array, required: true },
  selectedUniverse: { type: String, required: true },
  searchQuery: { type: String, default: '' }
})

defineEmits(['update:selectedUniverse', 'update:searchQuery'])
</script>

<style scoped>
.timeline-filter {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.universe-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.universe-tab {
  padding: 0.55rem 1rem;
  background: var(--bg-card, #131b2e);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  border-radius: 10px;
  color: var(--text-muted, #94a3b8);
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.universe-tab:hover {
  color: #ffffff;
  border-color: rgba(124, 58, 237, 0.4);
}

.universe-tab.active {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.25), rgba(6, 182, 212, 0.15));
  color: #ffffff;
  border-color: #7c3aed;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
}

.search-box {
  position: relative;
  width: 260px;
}

.search-icon {
  position: absolute;
  left: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  width: 15px;
  height: 15px;
  color: var(--text-muted, #94a3b8);
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.85rem 0.5rem 2.3rem;
  background: var(--bg-card, #131b2e);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
  border-radius: 10px;
  color: #ffffff;
  font-size: 0.85rem;
  outline: none;
}

.search-input:focus {
  border-color: #7c3aed;
}
</style>
