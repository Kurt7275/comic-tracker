<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="base-modal-backdrop" @click.self="handleBackdropClick">
        <div class="base-modal-dialog" :class="[sizeClass, customClass]" role="dialog" aria-modal="true">
          <!-- Modal Header -->
          <div v-if="$slots.header || title" class="base-modal-header">
            <slot name="header">
              <div class="modal-title-wrap">
                <h3 v-if="title" class="modal-title">{{ title }}</h3>
                <p v-if="subtitle" class="modal-subtitle">{{ subtitle }}</p>
              </div>
            </slot>
            <button class="modal-close-btn" aria-label="Close modal" @click="close">
              ✕
            </button>
          </div>

          <!-- Modal Body -->
          <div class="base-modal-body">
            <slot />
          </div>

          <!-- Modal Footer -->
          <div v-if="$slots.footer" class="base-modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  size: { type: String, default: 'md' }, // 'sm', 'md', 'lg', 'xl'
  closeOnBackdrop: { type: Boolean, default: true },
  customClass: { type: String, default: '' }
})

const emit = defineEmits(['close'])

const sizeClass = computed(() => `modal-size-${props.size}`)

function close() {
  emit('close')
}

function handleBackdropClick() {
  if (props.closeOnBackdrop) {
    close()
  }
}

function handleKeydown(e) {
  if (e.key === 'Escape' && props.isOpen) {
    close()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
.base-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(10, 15, 30, 0.75);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.base-modal-dialog {
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-card, #131b2e);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(124, 58, 237, 0.15);
  overflow: hidden;
}

.modal-size-sm { max-width: 440px; }
.modal-size-md { max-width: 600px; }
.modal-size-lg { max-width: 800px; }
.modal-size-xl { max-width: 1050px; }

.base-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main, #ffffff);
}

.modal-subtitle {
  margin: 0.25rem 0 0 0;
  font-size: 0.85rem;
  color: var(--text-muted, #94a3b8);
}

.modal-close-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-muted, #94a3b8);
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.4);
}

.base-modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.base-modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
