<template>
  <div class="comic-card" :class="{ 'is-pinned': comic.pinned }">
    <!-- Card Cover Image Container -->
    <div class="cover-wrapper">
      <img :src="comic.cover" :alt="comic.title" class="cover-img" loading="lazy" />
      <div class="cover-overlay">
        <BaseBadge :variant="statusVariant" size="sm">
          {{ comic.status }}
        </BaseBadge>
        <BaseBadge v-if="comic.type" variant="info" size="sm">
          {{ comic.type }}
        </BaseBadge>
      </div>

      <!-- Quick Action Buttons on Hover -->
      <div class="quick-actions">
        <button class="action-btn edit-btn" title="Edit comic details" @click.stop="$emit('edit', comic)">
          <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button class="action-btn delete-btn" title="Delete comic" @click.stop="$emit('delete', comic.id)">
          <svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Card Content -->
    <div class="card-details">
      <div class="header-row">
        <h4 class="comic-title" :title="comic.title">{{ comic.title }}</h4>
        <div v-if="comic.rating" class="rating-pill">
          <svg class="star-icon" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span>{{ comic.rating }}</span>
        </div>
      </div>

      <p v-if="comic.publisher" class="publisher-text">{{ comic.publisher }}</p>

      <!-- Progress Section -->
      <div class="progress-section">
        <div class="progress-info">
          <span class="chapter-text">
            Ch. {{ comic.chapter || 0 }} <span v-if="comic.totalChapters">/ {{ comic.totalChapters }}</span>
          </span>
          <span class="pct-text">{{ progressPct }}%</span>
        </div>

        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progressPct + '%' }"></div>
        </div>
      </div>

      <!-- Footer Quick Increment Button -->
      <div class="card-footer-actions">
        <button class="inc-ch-btn" title="Mark +1 Chapter Read" @click.stop="$emit('increment', comic.id)">
          <svg class="plus-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>+1 Chapter</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseBadge from '../ui/BaseBadge.vue'

const props = defineProps({
  comic: { type: Object, required: true }
})

defineEmits(['edit', 'delete', 'increment'])

const progressPct = computed(() => {
  if (!props.comic.totalChapters || props.comic.totalChapters === 0) return 0
  const pct = Math.round(((props.comic.chapter || 0) / props.comic.totalChapters) * 100)
  return Math.min(100, Math.max(0, pct))
})

const statusVariant = computed(() => {
  switch (props.comic.status) {
    case 'Completed': return 'success'
    case 'Reading': return 'purple'
    case 'Plan to Read': return 'info'
    case 'On Hold': return 'warning'
    case 'Dropped': return 'danger'
    default: return 'primary'
  }
})
</script>

<style scoped>
.comic-card {
  background: var(--bg-card, #131b2e);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.comic-card:hover {
  transform: translateY(-4px);
  border-color: rgba(124, 58, 237, 0.4);
  box-shadow: 0 12px 28px -6px rgba(0, 0, 0, 0.4), 0 0 20px rgba(124, 58, 237, 0.15);
}

.cover-wrapper {
  position: relative;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  background: #0f172a;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.comic-card:hover .cover-img {
  transform: scale(1.04);
}

.cover-overlay {
  position: absolute;
  top: 0.6rem;
  left: 0.6rem;
  right: 0.6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
}

.quick-actions {
  position: absolute;
  bottom: 0.6rem;
  right: 0.6rem;
  display: flex;
  gap: 0.4rem;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.25s ease;
  z-index: 3;
}

.comic-card:hover .quick-actions {
  opacity: 1;
  transform: translateY(0);
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #7c3aed;
  border-color: #a78bfa;
}

.action-btn.delete-btn:hover {
  background: #ef4444;
  border-color: #fca5a5;
}

.icon-svg {
  width: 15px;
  height: 15px;
}

.card-details {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.5rem;
}

.header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
}

.comic-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-main, #ffffff);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rating-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  padding: 0.2rem 0.45rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
}

.star-icon {
  width: 12px;
  height: 12px;
}

.publisher-text {
  margin: 0;
  font-size: 0.78rem;
  color: var(--text-muted, #94a3b8);
}

.progress-section {
  margin-top: auto;
  padding-top: 0.5rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-muted, #94a3b8);
  margin-bottom: 0.35rem;
  font-weight: 600;
}

.pct-text {
  color: #a78bfa;
}

.progress-track {
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #7c3aed, #06b6d4);
  border-radius: 999px;
  transition: width 0.3s ease;
}

.card-footer-actions {
  margin-top: 0.5rem;
}

.inc-ch-btn {
  width: 100%;
  padding: 0.45rem;
  background: rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.25);
  color: #a78bfa;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.inc-ch-btn:hover {
  background: rgba(124, 58, 237, 0.25);
  color: #ffffff;
  border-color: rgba(124, 58, 237, 0.5);
}

.plus-icon {
  width: 14px;
  height: 14px;
}
</style>
