<template>
  <teleport to="body">
    <transition name="share-modal-fade">
      <div v-if="visible" class="share-overlay">
        <div class="share-modal-scroll" @mousedown.self="$emit('close')">
          <div class="share-modal-container" @mousedown.stop>

            <!-- Header -->
            <div class="share-header">
              <h2 class="share-title">SHARE {{ timelineName }} CHECKLIST!</h2>
              <p class="share-subtitle">Pick your photo, a style, and generate a card to share!</p>
            </div>

            <!-- YOUR PHOTO -->
            <div class="share-section">
              <label class="share-section-label">YOUR PHOTO</label>
              <div
                class="share-photo-picker"
                :class="{ 'has-photo': userPhoto }"
                @click="triggerFilePicker"
              >
                <img v-if="userPhoto" :src="userPhoto" class="share-photo-preview" alt="Your photo" />
                <div v-if="userPhoto" class="share-photo-change-overlay">
                  <span class="share-photo-change-text">CHANGE PHOTO</span>
                </div>
                <div v-else class="share-photo-placeholder">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span class="share-photo-label">PICK PHOTO</span>
                </div>
              </div>
              <input
                ref="fileInputRef"
                type="file"
                accept="image/*"
                style="display:none"
                @change="handlePhotoSelect"
              />
            </div>

            <!-- PHASES -->
            <div class="share-section">
              <label class="share-section-label">PHASES</label>
              <div class="share-phases-list">
                <button
                  v-for="phase in phases"
                  :key="phase.name"
                  type="button"
                  class="share-phase-row"
                  :class="{ 'phase-complete': phaseToggles[phase.name] }"
                  @click="togglePhase(phase.name)"
                >
                  <div class="phase-fill-bar" :style="{ background: phaseToggles[phase.name] ? universeColors.primary : 'transparent' }"></div>
                  <span class="phase-row-text">
                    {{ phaseToggles[phase.name] ? (phase.name + ' COMPLETE') : (phase.name + ' — ' + phase.done + '/' + phase.total) }}
                  </span>
                </button>
              </div>
            </div>

            <!-- STYLE -->
            <div class="share-section">
              <label class="share-section-label">STYLE</label>
              <div class="share-style-btns">
                <button
                  v-for="s in STYLES"
                  :key="s.key"
                  type="button"
                  class="share-style-btn"
                  :class="[
                    'style-btn-' + s.key,
                    { active: selectedStyle === s.key }
                  ]"
                  @click="selectedStyle = s.key"
                >{{ s.label }}</button>
              </div>
            </div>

            <!-- SAVE IMAGE -->
            <button type="button" class="share-save-btn" @click="saveImage" :disabled="saving">
              <span v-if="saving" class="save-spinner"></span>
              {{ saving ? 'GENERATING...' : 'SAVE IMAGE!' }}
            </button>

            <!-- CLOSE -->
            <button type="button" class="share-close-btn" @click="$emit('close')">CLOSE</button>

            <!-- PREVIEW -->
            <div class="share-preview-section">
              <label class="share-preview-label">PREVIEW</label>

              <!-- ====== CARD TO CAPTURE ====== -->
              <div ref="cardRef" class="share-card" :class="'card-style-' + selectedStyle">

                <!-- ─── CLASSIC STYLE ─── -->
                <template v-if="selectedStyle === 'classic'">
                  <div class="card-classic">
                    <!-- User photo background -->
                    <div v-if="userPhoto" class="classic-photo-bg">
                      <img :src="userPhoto" alt="" />
                    </div>
                    <!-- Header -->
                    <div class="classic-header" :style="{ background: universeColors.headerGradient }">
                      <div class="classic-header-texture"></div>
                      <div class="classic-title-area">
                        <span class="classic-universe-name" :style="{ color: universeColors.accent }">{{ timelineName }}</span>
                        <span class="classic-progress-count">{{ totalDone }}/{{ totalItems }} WATCHED</span>
                      </div>
                    </div>
                    <!-- Item list -->
                    <div class="classic-body">
                      <div class="classic-items-scroll">
                        <template v-for="phase in phases" :key="phase.name">
                          <!-- If phase is toggled complete, render single summary row -->
                          <div v-if="phaseToggles[phase.name]" class="classic-item-row phase-complete-row">
                            <span class="classic-item-check item-done">✓</span>
                            <span class="classic-item-title item-done phase-complete-text">
                              {{ phase.name }} COMPLETE
                            </span>
                          </div>
                          <!-- Otherwise, list all individual items in this phase -->
                          <template v-else>
                            <div
                              v-for="item in phase.items"
                              :key="item.originalIdx"
                              class="classic-item-row"
                            >
                              <span class="classic-item-check" :class="{ 'item-done': isItemDone(item.originalIdx) }">
                                {{ isItemDone(item.originalIdx) ? '✓' : '○' }}
                              </span>
                              <span class="classic-item-title" :class="{ 'item-done': isItemDone(item.originalIdx) }">
                                {{ item.title }}
                              </span>
                            </div>
                          </template>
                        </template>
                      </div>
                    </div>
                    <!-- Footer -->
                    <div class="classic-footer" :style="{ background: universeColors.primary }">
                      <span class="classic-brand">COMICVERSE</span>
                      <span class="classic-brand-sub">{{ SHARE_FOOTER_TEXT }}</span>
                    </div>
                  </div>
                </template>

                <!-- ─── MINIMAL STYLE ─── -->
                <template v-if="selectedStyle === 'minimal'">
                  <div class="card-minimal">
                    <!-- User photo bg faded -->
                    <div v-if="userPhoto" class="minimal-photo-bg">
                      <img :src="userPhoto" alt="" />
                    </div>
                    <div class="minimal-top-row">
                      <span class="minimal-brand">COMICVERSE</span>
                      <span class="minimal-date">{{ currentDate }}</span>
                    </div>
                    <div class="minimal-center">
                      <span class="minimal-watching" :style="{ color: universeColors.primary }">WATCHING</span>
                      <span class="minimal-universe">{{ timelineName }}</span>
                      <span class="minimal-fraction">{{ totalDone }}/{{ totalItems }}</span>
                    </div>
                    <div class="minimal-bottom">
                      <span class="minimal-footer-text">{{ SHARE_FOOTER_TEXT }}</span>
                    </div>
                  </div>
                </template>

                <!-- ─── SPOTLIGHT STYLE ─── -->
                <template v-if="selectedStyle === 'spotlight'">
                  <div class="card-spotlight">
                    <!-- User photo bg faded -->
                    <div v-if="userPhoto" class="spotlight-photo-bg">
                      <img :src="userPhoto" alt="" />
                    </div>
                    <div class="spotlight-glow" :style="{ background: universeColors.glowGradient }"></div>
                    <div class="spotlight-content">
                      <span class="spotlight-label" :style="{ color: universeColors.primary }">PROGRESS</span>
                      <span class="spotlight-percent" :style="{ color: universeColors.primary }">{{ progressPercent }}%</span>
                      <span class="spotlight-universe">{{ timelineName }}</span>
                      <span class="spotlight-fraction">{{ totalDone }} of {{ totalItems }}</span>
                      <div class="spotlight-bar-track">
                        <div class="spotlight-bar-fill" :style="{ width: progressPercent + '%', background: universeColors.primary }"></div>
                      </div>
                    </div>
                    <div class="spotlight-bottom">
                      <span class="spotlight-brand">{{ SHARE_FOOTER_TEXT }}</span>
                    </div>
                  </div>
                </template>

              </div>
            </div>

          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, watch, reactive, onUnmounted } from 'vue'
import html2canvas from 'html2canvas'

const props = defineProps({
  visible: Boolean,
  timelineKey: String,
  timelineData: Object,
  progress: Object,
})

const emit = defineEmits(['close'])
const SHARE_FOOTER_TEXT = 'COMICVERSE'

const STYLES = [
  { key: 'classic', label: 'CLASSIC' },
  { key: 'minimal', label: 'MINIMAL' },
  { key: 'spotlight', label: 'SPOTLIGHT' },
]

// ─── Universe Color Themes ───
const UNIVERSE_COLORS = {
  mcu:        { primary: '#EE3545', secondary: '#8B1A25', accent: '#F5D13B', headerGradient: 'linear-gradient(135deg, #3a0a0a 0%, #5c1515 50%, #3a0a0a 100%)', glowGradient: 'radial-gradient(ellipse at center bottom, rgba(238,53,69,0.35) 0%, transparent 70%)' },
  dcau:       { primary: '#6A1B9A', secondary: '#3C0F57', accent: '#CE93D8', headerGradient: 'linear-gradient(135deg, #1a0a2e 0%, #3C0F57 50%, #1a0a2e 100%)', glowGradient: 'radial-gradient(ellipse at center bottom, rgba(106,27,154,0.35) 0%, transparent 70%)' },
  onepiece:   { primary: '#E65100', secondary: '#8B3100', accent: '#FFB74D', headerGradient: 'linear-gradient(135deg, #1a0f05 0%, #5c2800 50%, #1a0f05 100%)', glowGradient: 'radial-gradient(ellipse at center bottom, rgba(230,81,0,0.35) 0%, transparent 70%)' },
  naruto:     { primary: '#E65100', secondary: '#8B3100', accent: '#FF9800', headerGradient: 'linear-gradient(135deg, #1a0f05 0%, #5c2800 50%, #1a0f05 100%)', glowGradient: 'radial-gradient(ellipse at center bottom, rgba(230,81,0,0.35) 0%, transparent 70%)' },
  aot:        { primary: '#546E7A', secondary: '#37474F', accent: '#B0BEC5', headerGradient: 'linear-gradient(135deg, #0a1215 0%, #263238 50%, #0a1215 100%)', glowGradient: 'radial-gradient(ellipse at center bottom, rgba(84,110,122,0.35) 0%, transparent 70%)' },
  marvel:     { primary: '#EE3545', secondary: '#8B1A25', accent: '#F5D13B', headerGradient: 'linear-gradient(135deg, #3a0a0a 0%, #5c1515 50%, #3a0a0a 100%)', glowGradient: 'radial-gradient(ellipse at center bottom, rgba(238,53,69,0.35) 0%, transparent 70%)' },
  dragonball: { primary: '#FF6F00', secondary: '#E65100', accent: '#FFCA28', headerGradient: 'linear-gradient(135deg, #1a0f00 0%, #5c3000 50%, #1a0f00 100%)', glowGradient: 'radial-gradient(ellipse at center bottom, rgba(255,111,0,0.35) 0%, transparent 70%)' },
  godzilla:   { primary: '#2E7D32', secondary: '#1B5E20', accent: '#66BB6A', headerGradient: 'linear-gradient(135deg, #0a1a0a 0%, #1B5E20 50%, #0a1a0a 100%)', glowGradient: 'radial-gradient(ellipse at center bottom, rgba(46,125,50,0.35) 0%, transparent 70%)' },
}

const selectedStyle = ref('classic')
const userPhoto = ref(null)
const fileInputRef = ref(null)
const cardRef = ref(null)
const saving = ref(false)
const phaseToggles = reactive({})

const universeColors = computed(() => UNIVERSE_COLORS[props.timelineKey] || UNIVERSE_COLORS.mcu)

const timelineName = computed(() => props.timelineData?.shortName || props.timelineKey?.toUpperCase() || 'TIMELINE')

const currentDate = computed(() => {
  const d = new Date()
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
})

// ─── Compute phases from timeline data ───
const phases = computed(() => {
  if (!props.timelineData?.items) return []
  const map = {}
  props.timelineData.items.forEach((item, idx) => {
    if (!map[item.part]) {
      map[item.part] = { name: item.part, items: [], done: 0, total: 0 }
    }
    const group = map[item.part]
    group.items.push({ ...item, originalIdx: idx })
    group.total++
    if (props.progress?.[`${props.timelineKey}_${idx}`]) {
      group.done++
    }
  })
  return Object.values(map)
})

// ─── All items flat list ───
const allItems = computed(() => {
  if (!props.timelineData?.items) return []
  return props.timelineData.items.map((item, idx) => ({ ...item, originalIdx: idx }))
})

const totalItems = computed(() => allItems.value.length)

const totalDone = computed(() => {
  return allItems.value.filter(item => isItemDone(item.originalIdx)).length
})

const progressPercent = computed(() => {
  if (totalItems.value === 0) return 0
  return Math.round((totalDone.value / totalItems.value) * 100)
})

function isItemDone(idx) {
  return !!props.progress?.[`${props.timelineKey}_${idx}`]
}

// ─── Initialize phase toggles & lock body/documentElement scroll when modal opens ───
watch(() => props.visible, (val) => {
  if (val) {
    phases.value.forEach(phase => {
      phaseToggles[phase.name] = phase.done === phase.total && phase.total > 0
    })
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
  }
}, { immediate: true })

onUnmounted(() => {
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
})

function togglePhase(phaseName) {
  phaseToggles[phaseName] = !phaseToggles[phaseName]
}

// ─── Photo handling ───
function triggerFilePicker() {
  fileInputRef.value?.click()
}

function handlePhotoSelect(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    userPhoto.value = ev.target.result
  }
  reader.readAsDataURL(file)
  // Reset input so the same file can be re-selected
  e.target.value = ''
}

// ─── Save image with html2canvas ───
async function saveImage() {
  if (!cardRef.value || saving.value) return
  saving.value = true
  try {
    const canvas = await html2canvas(cardRef.value, {
      scale: 3,
      backgroundColor: null,
      useCORS: true,
      allowTaint: true,
      logging: false,
    })
    const link = document.createElement('a')
    link.download = `comicverse-${props.timelineKey}-checklist.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (err) {
    console.error('Failed to save image:', err)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
/* ── Overlay ── */
.share-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  overscroll-behavior: contain;
}

.share-modal-scroll {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2.5rem 1rem 3rem;
  overscroll-behavior: contain;
}

.share-modal-container {
  width: 100%;
  max-width: 480px;
  background: #FAF4E8;
  border: 4px solid #111;
  border-radius: 6px;
  box-shadow: 8px 8px 0 #a35028;
  padding: 1.75rem 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  animation: shareModalSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  background-image: radial-gradient(circle, rgba(0,0,0,0.06) 1.2px, transparent 1.2px);
  background-size: 10px 10px;
  position: relative;
  flex-shrink: 0;
}

@keyframes shareModalSlideUp {
  0%   { opacity: 0; transform: translateY(30px) scale(0.97); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

/* ── Header ── */
.share-header {
  text-align: center;
}

.share-title {
  font-family: 'Bangers', cursive;
  font-size: 1.85rem;
  letter-spacing: 0.06em;
  color: #F5D13B;
  -webkit-text-stroke: 1.5px #111;
  text-shadow: 3px 3px 0 #8B3A1C;
  line-height: 1.1;
}

.share-subtitle {
  font-family: 'Outfit', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  color: #777;
  margin-top: 0.25rem;
}

/* ── Section ── */
.share-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.share-section-label {
  font-family: 'Bangers', cursive;
  font-size: 1rem;
  letter-spacing: 0.06em;
  color: #111;
}

/* ── Photo Picker ── */
.share-photo-picker {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  border: 3px dashed #bbb;
  border-radius: 6px;
  background: #FFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.2s ease, transform 0.15s ease;
}

.share-photo-picker:hover {
  border-color: #888;
  transform: translateY(-1px);
}

.share-photo-picker.has-photo {
  border-style: solid;
  border-color: #111;
}

.share-photo-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.share-photo-change-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.share-photo-picker:hover .share-photo-change-overlay {
  opacity: 1;
}

.share-photo-change-text {
  font-family: 'Bangers', cursive;
  font-size: 1.05rem;
  letter-spacing: 0.06em;
  color: #FFF;
  background: rgba(238,53,69,0.85);
  padding: 0.35rem 1rem;
  border-radius: 4px;
  border: 2px solid #FFF;
}

.share-photo-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #999;
}

.share-photo-label {
  font-family: 'Outfit', sans-serif;
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ── Phases ── */
.share-phases-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.share-phase-row {
  position: relative;
  width: 100%;
  padding: 0.55rem 0.85rem;
  border: 2.5px solid #111;
  border-radius: 4px;
  background: #FFF;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  box-shadow: 2px 2px 0 rgba(0,0,0,0.12);
}

.share-phase-row:hover {
  transform: translateY(-1px);
  box-shadow: 3px 3px 0 rgba(0,0,0,0.15);
}

.share-phase-row.phase-complete {
  border-color: #111;
}

.phase-fill-bar {
  position: absolute;
  inset: 0;
  transition: background 0.25s ease;
}

.phase-row-text {
  position: relative;
  z-index: 1;
  font-family: 'Outfit', sans-serif;
  font-size: 0.78rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #111;
  transition: color 0.2s ease;
}

.share-phase-row.phase-complete .phase-row-text {
  color: #FFF;
}

/* ── Style Buttons ── */
.share-style-btns {
  display: flex;
  gap: 0.5rem;
}

.share-style-btn {
  flex: 1;
  padding: 0.45rem 0.75rem;
  font-family: 'Bangers', cursive;
  font-size: 0.95rem;
  letter-spacing: 0.05em;
  border: 2.5px solid #111;
  border-radius: 4px;
  background: #FFF;
  color: #111;
  cursor: pointer;
  box-shadow: 2.5px 2.5px 0 rgba(0,0,0,0.12);
  transition: all 0.15s ease;
}

.share-style-btn:hover {
  transform: translateY(-1px);
  box-shadow: 3px 3px 0 rgba(0,0,0,0.18);
}

.share-style-btn.style-btn-classic.active {
  background: #F5D13B;
  color: #111;
  box-shadow: 2.5px 2.5px 0 #a3850f;
}

.share-style-btn.style-btn-minimal.active {
  background: #1a1a1a;
  color: #FFF;
  box-shadow: 2.5px 2.5px 0 #000;
}

.share-style-btn.style-btn-spotlight.active {
  background: #9C27B0;
  color: #FFF;
  box-shadow: 2.5px 2.5px 0 #5c0f6e;
}

/* ── Save Button ── */
.share-save-btn {
  width: 100%;
  padding: 0.85rem 1rem;
  font-family: 'Bangers', cursive;
  font-size: 1.4rem;
  letter-spacing: 0.08em;
  color: #FFF;
  background: linear-gradient(135deg, #E040FB 0%, #D500F9 35%, #AA00FF 100%);
  border: 3px solid #111;
  border-radius: 5px;
  box-shadow: 4px 4px 0 #5c0066;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.share-save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 5px 5px 0 #5c0066;
}

.share-save-btn:active {
  transform: translateY(0);
  box-shadow: 2px 2px 0 #5c0066;
}

.share-save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.save-spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: #FFF;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Close Button ── */
.share-close-btn {
  width: 100%;
  padding: 0.6rem 1rem;
  font-family: 'Bangers', cursive;
  font-size: 1.05rem;
  letter-spacing: 0.06em;
  color: #111;
  background: #FFF;
  border: 2.5px solid #111;
  border-radius: 5px;
  box-shadow: 3px 3px 0 rgba(0,0,0,0.12);
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.share-close-btn:hover {
  transform: translateY(-1px);
  box-shadow: 4px 4px 0 rgba(0,0,0,0.15);
}

/* ── Preview Section ── */
.share-preview-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
  border-top: 2.5px dashed #ccc;
  padding-top: 1rem;
}

.share-preview-label {
  font-family: 'Bangers', cursive;
  font-size: 1rem;
  letter-spacing: 0.08em;
  color: #888;
}

/* ======================================
   SHARE CARD — Canvas Capture Target
   ====================================== */
.share-card {
  width: 320px;
  min-height: 480px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  font-family: 'Outfit', sans-serif;
}

/* ── CLASSIC CARD ── */
.card-classic {
  width: 100%;
  min-height: 480px;
  display: flex;
  flex-direction: column;
  background: #1a0a0a;
  position: relative;
}

.classic-photo-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.classic-photo-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.38;
  filter: blur(1px);
}

.classic-photo-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.75) 100%);
  pointer-events: none;
}

.classic-header {
  position: relative;
  z-index: 1;
  padding: 1.25rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.classic-header-texture {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 6px 6px;
}

.classic-title-area {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.classic-universe-name {
  font-family: 'Bangers', cursive;
  font-size: 2.2rem;
  letter-spacing: 0.1em;
  text-shadow: 2px 2px 0 rgba(0,0,0,0.5);
  line-height: 1;
}

.classic-progress-count {
  font-family: 'Outfit', sans-serif;
  font-size: 0.75rem;
  font-weight: 800;
  color: rgba(255,255,255,0.8);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.classic-body {
  flex: 1;
  position: relative;
  z-index: 1;
  padding: 0.65rem 0.85rem;
  overflow: hidden;
}

.classic-items-scroll {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  max-height: 310px;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.classic-items-scroll::-webkit-scrollbar {
  width: 5px;
}

.classic-items-scroll::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
}

.classic-items-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.classic-items-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.classic-item-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.15rem 0.25rem;
  border-radius: 3px;
}

.classic-item-row.phase-complete-row {
  padding: 0.28rem 0.45rem;
  margin: 0.15rem 0;
  background: rgba(76, 175, 80, 0.18);
  border: 1px solid rgba(76, 175, 80, 0.45);
  border-radius: 4px;
}

.phase-complete-text {
  font-weight: 900 !important;
  color: #81C784 !important;
  letter-spacing: 0.06em !important;
  font-size: 0.68rem !important;
}

.classic-item-check {
  font-size: 0.65rem;
  font-weight: 900;
  color: rgba(255,255,255,0.35);
  flex-shrink: 0;
  width: 14px;
  text-align: center;
}

.classic-item-check.item-done {
  color: #66BB6A;
}

.classic-item-title {
  font-size: 0.62rem;
  font-weight: 700;
  color: rgba(255,255,255,0.5);
  letter-spacing: 0.03em;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.classic-item-title.item-done {
  color: #A5D6A7;
}

.classic-footer {
  position: relative;
  z-index: 1;
  padding: 0.6rem 0.85rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.05rem;
}

.classic-brand {
  font-family: 'Bangers', cursive;
  font-size: 1rem;
  letter-spacing: 0.12em;
  color: #FFF;
  text-shadow: 1px 1px 0 rgba(0,0,0,0.3);
}

.classic-brand-sub {
  font-size: 0.55rem;
  font-weight: 600;
  color: rgba(255,255,255,0.6);
  letter-spacing: 0.05em;
}

/* ── MINIMAL CARD ── */
.card-minimal {
  width: 100%;
  min-height: 480px;
  background: #111;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  padding: 1.25rem;
}

.minimal-photo-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}

.minimal-photo-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.32;
  filter: blur(2px);
}

.minimal-photo-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  pointer-events: none;
}

.minimal-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.minimal-brand {
  font-family: 'Bangers', cursive;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  color: #FFF;
}

.minimal-date {
  font-family: 'Outfit', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  color: rgba(255,255,255,0.5);
  letter-spacing: 0.04em;
}

.minimal-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  position: relative;
  z-index: 1;
}

.minimal-watching {
  font-family: 'Outfit', sans-serif;
  font-size: 0.85rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.minimal-universe {
  font-family: 'Bangers', cursive;
  font-size: 3.5rem;
  letter-spacing: 0.08em;
  color: #FFF;
  line-height: 1;
  text-shadow: 0 0 30px rgba(255,255,255,0.1);
}

.minimal-fraction {
  font-family: 'Outfit', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: rgba(255,255,255,0.7);
  letter-spacing: 0.05em;
}

.minimal-bottom {
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.minimal-footer-text {
  font-size: 0.6rem;
  font-weight: 600;
  color: rgba(255,255,255,0.3);
  letter-spacing: 0.06em;
}

/* ── SPOTLIGHT CARD ── */
.card-spotlight {
  width: 100%;
  min-height: 480px;
  background: #0f0f0f;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 1.5rem 1.25rem;
}

.spotlight-photo-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}

.spotlight-photo-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.30;
  filter: blur(2px);
}

.spotlight-photo-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  pointer-events: none;
}

.spotlight-glow {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.spotlight-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 1;
  flex: 1;
  justify-content: center;
}

.spotlight-label {
  font-family: 'Bangers', cursive;
  font-size: 1.1rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.spotlight-percent {
  font-family: 'Bangers', cursive;
  font-size: 5rem;
  line-height: 1;
  letter-spacing: 0.02em;
  text-shadow: 0 0 40px currentColor;
}

.spotlight-universe {
  font-family: 'Bangers', cursive;
  font-size: 1.8rem;
  letter-spacing: 0.1em;
  color: #FFF;
  margin-top: 0.25rem;
}

.spotlight-fraction {
  font-family: 'Outfit', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: rgba(255,255,255,0.55);
  letter-spacing: 0.06em;
}

.spotlight-bar-track {
  width: 80%;
  height: 6px;
  background: rgba(255,255,255,0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 0.75rem;
}

.spotlight-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;
}

.spotlight-bottom {
  position: relative;
  z-index: 1;
  padding-top: 1rem;
}

.spotlight-brand {
  font-size: 0.6rem;
  font-weight: 600;
  color: rgba(255,255,255,0.25);
  letter-spacing: 0.06em;
}

/* ── Modal Transitions ── */
.share-modal-fade-enter-active {
  transition: opacity 0.3s ease;
}
.share-modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.share-modal-fade-leave-active .share-modal-container {
  transition: transform 0.25s ease, opacity 0.25s ease;
  transform: translateY(15px) scale(0.97);
  opacity: 0;
}
.share-modal-fade-enter-from,
.share-modal-fade-leave-to {
  opacity: 0;
}

/* ── Mobile ── */
@media (max-width: 520px) {
  .share-modal-container {
    padding: 1.25rem 1rem 1.5rem;
  }
  .share-title {
    font-size: 1.45rem;
  }
  .share-card {
    width: 280px;
    min-height: 420px;
  }
  .classic-universe-name { font-size: 1.8rem; }
  .minimal-universe { font-size: 2.8rem; }
  .spotlight-percent { font-size: 4rem; }
}
</style>
