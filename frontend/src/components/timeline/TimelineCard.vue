<template>
  <div class="timeline-card" :class="{ completed: isCompleted }">
    <div class="card-left">
      <button
        class="checkbox-btn"
        :class="{ checked: isCompleted }"
        :title="isCompleted ? 'Mark as Unread' : 'Mark as Read'"
        @click="$emit('toggle', issue.id)"
      >
        <svg v-if="isCompleted" class="check-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </button>

      <div class="issue-info">
        <div class="title-row">
          <span class="order-badge">#{{ issue.order || index + 1 }}</span>
          <h4 class="issue-title">{{ issue.title }}</h4>
        </div>
        <p v-if="issue.description" class="issue-desc">{{ issue.description }}</p>
        <div class="tags-row">
          <span v-if="issue.series" class="tag series-tag">{{ issue.series }}</span>
          <span v-if="issue.type" class="tag type-tag">{{ issue.type }}</span>
          <span v-if="issue.releaseYear" class="tag year-tag">{{ issue.releaseYear }}</span>
        </div>
      </div>
    </div>

    <div v-if="issue.cover" class="cover-thumbnail">
      <img :src="issue.cover" :alt="issue.title" loading="lazy" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  issue: { type: Object, required: true },
  index: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false }
})

defineEmits(['toggle'])
</script>

<style scoped>
.timeline-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: var(--bg-card, #131b2e);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  border-radius: 14px;
  transition: all 0.2s ease;
}

.timeline-card:hover {
  border-color: rgba(124, 58, 237, 0.35);
  background: rgba(19, 27, 46, 0.95);
  transform: translateX(4px);
}

.timeline-card.completed {
  border-color: rgba(16, 185, 129, 0.3);
  background: rgba(16, 185, 129, 0.04);
}

.card-left {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  flex: 1;
}

.checkbox-btn {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-top: 0.15rem;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.checkbox-btn:hover {
  border-color: #7c3aed;
}

.checkbox-btn.checked {
  background: #10b981;
  border-color: #10b981;
  color: #ffffff;
}

.check-svg {
  width: 14px;
  height: 14px;
}

.issue-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.order-badge {
  font-size: 0.72rem;
  font-weight: 800;
  color: #a78bfa;
  background: rgba(124, 58, 237, 0.15);
  padding: 0.15rem 0.4rem;
  border-radius: 6px;
}

.issue-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-main, #ffffff);
}

.timeline-card.completed .issue-title {
  text-decoration: line-through;
  opacity: 0.75;
}

.issue-desc {
  margin: 0;
  font-size: 0.82rem;
  color: var(--text-muted, #94a3b8);
}

.tags-row {
  display: flex;
  gap: 0.4rem;
  margin-top: 0.25rem;
}

.tag {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-muted, #94a3b8);
}

.series-tag { color: #60a5fa; background: rgba(59, 130, 246, 0.1); }
.type-tag { color: #c084fc; background: rgba(168, 85, 247, 0.1); }

.cover-thumbnail {
  width: 48px;
  height: 68px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  background: #0f172a;
}

.cover-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
