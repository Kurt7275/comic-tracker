<template>
  <span class="base-badge" :class="[variantClass, sizeClass]">
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'primary' }, // 'primary', 'success', 'warning', 'info', 'purple', 'danger'
  size: { type: String, default: 'md' } // 'sm', 'md', 'lg'
})

const variantClass = computed(() => `badge-variant-${props.variant}`)
const sizeClass = computed(() => `badge-size-${props.size}`)
</script>

<style scoped>
.base-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-weight: 600;
  border-radius: 9999px;
  line-height: 1;
  letter-spacing: 0.02em;
}

.badge-size-sm { padding: 0.25rem 0.5rem; font-size: 0.7rem; }
.badge-size-md { padding: 0.35rem 0.75rem; font-size: 0.78rem; }
.badge-size-lg { padding: 0.5rem 1rem; font-size: 0.88rem; }

.badge-variant-primary {
  background: rgba(124, 58, 237, 0.15);
  color: #a78bfa;
  border: 1px solid rgba(124, 58, 237, 0.3);
}

.badge-variant-success {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.badge-variant-warning {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.badge-variant-info {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.badge-variant-purple {
  background: rgba(168, 85, 247, 0.15);
  color: #c084fc;
  border: 1px solid rgba(168, 85, 247, 0.3);
}

.badge-variant-danger {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}
</style>
