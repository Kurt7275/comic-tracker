<template>
  <Teleport to="body">
    <div class="desk-view" :class="{ 'is-exiting': isExiting }">

      <!-- Full-screen desk background image -->
      <img
        ref="bgImgRef"
        class="desk-bg"
        src="/desk_sketchbook_bg.jpg"
        draggable="false"
        @load="layoutCanvas"
      />

      <!-- Transparent drawing canvas, positioned over the paper in the image -->
      <canvas
        ref="drawCanvas"
        class="paper-canvas"
        :class="{
          'cur-eraser': activeTool === 'eraser',
          'cur-cross':  activeTool !== 'eraser',
        }"
        :style="canvasStyle"
        @pointerdown="startDraw"
        @pointermove="draw"
        @pointerup="endDraw"
        @pointerleave="endDraw"
      />

      <!-- Blinking ink caret on paper -->
      <!-- Blinking ink caret on paper (only when typing mode is ON) -->
      <div
        v-if="isTypingMode"
        class="paper-caret"
        :style="caretStyle"
      />

      <!-- Floating HUD toolbar at bottom center -->
      <div class="hud" @click.stop>

        <!-- Back -->
        <button class="hud-btn back-btn" title="Lean Back" @click="handleClose">
          ← Back
        </button>

        <div class="hud-sep" />

        <!-- Tools -->
        <button
          v-for="t in tools"
          :key="t.id"
          class="hud-btn tool-btn"
          :class="{ active: activeTool === t.id }"
          :title="t.label"
          @click="setTool(t.id)"
        >{{ t.icon }}</button>

        <div class="hud-sep" />

        <!-- Type Mode Toggle -->
        <button
          class="hud-btn type-toggle-btn"
          :class="{ active: isTypingMode }"
          :title="isTypingMode ? 'Typing Mode: ON (Click to disable)' : 'Typing Mode: OFF (Click to enable)'"
          @click="toggleTypingMode"
        >
          <span class="type-icon">⌨️</span>
          <span class="type-label">Type: {{ isTypingMode ? 'ON' : 'OFF' }}</span>
        </button>

        <div class="hud-sep" />

        <!-- Sizes -->
        <button
          v-for="sz in sizes"
          :key="sz.value"
          class="hud-btn size-btn"
          :class="{ active: activeSize === sz.value }"
          :title="sz.label"
          @click="setSize(sz.value)"
        >
          <span class="hud-dot" :style="{ width: sz.dot + 'px', height: sz.dot + 'px', background: activeColor }" />
        </button>

        <div class="hud-sep" />

        <!-- Colors -->
        <button
          v-for="s in swatches"
          :key="s.color"
          class="hud-swatch"
          :class="{ active: activeColor === s.color }"
          :style="{ background: s.color }"
          :title="s.name"
          @click="setColor(s.color)"
        />

        <div class="hud-sep" />

        <!-- Actions -->
        <button class="hud-btn" title="Undo" :disabled="undoStack.length === 0" @click="undo">↩</button>
        <button class="hud-btn danger-btn" title="Clear all" @click="clearAll">✕</button>

      </div>

    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits(['close'])

// ── DOM refs ───────────────────────────────────────────────────────────────────
const bgImgRef  = ref(null)
const drawCanvas = ref(null)
let   ctx        = null

// ── Transition state ───────────────────────────────────────────────────────────
const isExiting  = ref(false)

// ── Paper position in viewport ─────────────────────────────────────────────────
// Source image: 1024 × 682 px
// Paper corners (pixel-analyzed precisely):
//   TL=(330, 201)  TR=(594, 191)
//   BL=(323, 545)  BR=(625, 530)
//   → bounding rect: x1=323 y1=191  x2=625 y2=545
const IMG_W = 1024, IMG_H = 682
const P_X1 = 323, P_Y1 = 191, P_X2 = 625, P_Y2 = 545
// NOTE: No CSS rotation on canvas — rotation causes getBoundingClientRect to
// return a rotated AABB, misaligning canvas coords with mouse position.
// The clip-path polygon handles the paper tilt visually instead.

const paperRect = reactive({ left: 0, top: 0, width: 0, height: 0 })

const canvasStyle = computed(() => ({
  left:   paperRect.left   + 'px',
  top:    paperRect.top    + 'px',
  width:  paperRect.width  + 'px',
  height: paperRect.height + 'px',
}))

function layoutCanvas() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  // object-fit: cover scaling
  const scale = Math.max(vw / IMG_W, vh / IMG_H)
  const renderedW = IMG_W * scale
  const renderedH = IMG_H * scale
  const offX = (vw - renderedW) / 2
  const offY = (vh - renderedH) / 2

  paperRect.left   = offX + P_X1 * scale
  paperRect.top    = offY + P_Y1 * scale
  paperRect.width  = (P_X2 - P_X1) * scale
  paperRect.height = (P_Y2 - P_Y1) * scale

  nextTick(() => initCanvas())
}

function initCanvas() {
  const canvas = drawCanvas.value
  if (!canvas) return
  const dpr = window.devicePixelRatio || 1
  const w   = canvas.clientWidth
  const h   = canvas.clientHeight
  canvas.width  = Math.round(w * dpr)
  canvas.height = Math.round(h * dpr)
  ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)

  // Restore previous session drawing
  const saved = localStorage.getItem('miles_paper_drawing')
  if (saved) {
    const img2 = new Image()
    img2.onload = () => ctx.drawImage(img2, 0, 0, w, h)
    img2.src = saved
  }
}

// ── Drawing tools ──────────────────────────────────────────────────────────────
const tools = [
  { id: 'pencil', icon: '✏️', label: 'Pencil' },
  { id: 'pen',    icon: '🖊️', label: 'Ink Pen' },
  { id: 'marker', icon: '🖌️', label: 'Marker' },
  { id: 'eraser', icon: '◻️', label: 'Eraser'  },
]

const swatches = [
  { color: '#1a1a1a', name: 'Carbon'  },
  { color: '#2563eb', name: 'Blue'    },
  { color: '#dc2626', name: 'Red'     },
  { color: '#16a34a', name: 'Green'   },
  { color: '#d97706', name: 'Amber'   },
  { color: '#7c3aed', name: 'Purple'  },
  { color: '#be185d', name: 'Pink'    },
  { color: '#0f172a', name: 'Navy'    },
]

const sizes = [
  { value: 1.5,  dot: 4,  label: 'Fine'   },
  { value: 3,    dot: 7,  label: 'Medium' },
  { value: 7,    dot: 11, label: 'Thick'  },
  { value: 16,   dot: 16, label: 'Brush'  },
]

const activeTool  = ref('pencil')
const activeColor = ref('#1a1a1a')
const activeSize  = ref(3)

// ── Automatic paper typing state (fixed upper-left notebook position) ────────
const isTypingMode = ref(true)

function toggleTypingMode() {
  isTypingMode.value = !isTypingMode.value
}

const START_X = 24
const START_Y = 28

const typingCursor = reactive({
  x: START_X,
  y: START_Y,
  startX: START_X,
  cursorStack: [],
})

const caretStyle = computed(() => {
  const fontSize = activeSize.value === 1.5 ? 16 : activeSize.value === 3 ? 22 : activeSize.value === 7 ? 30 : 42
  return {
    left: `${paperRect.left + typingCursor.x}px`,
    top:  `${paperRect.top + typingCursor.y}px`,
    height: `${fontSize}px`,
    borderColor: activeColor.value,
  }
})

let audioCtx = null
function playPencilSound() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    if (audioCtx.state === 'suspended') audioCtx.resume()
    const now = audioCtx.currentTime
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(320 + Math.random() * 220, now)
    gain.gain.setValueAtTime(0.016, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start()
    osc.stop(now + 0.03)
  } catch {}
}

function setTool(id)   { activeTool.value = id }
function setColor(c)   { activeColor.value = c }
function setSize(v)    { activeSize.value = v }

// ── Canvas drawing ─────────────────────────────────────────────────────────────
let isDrawing  = false
const undoStack = ref([])
const MAX_UNDO  = 80

function canvasPos(e) {
  const rect = drawCanvas.value.getBoundingClientRect()
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  }
}

function applyStrokeStyle() {
  const tool = activeTool.value
  ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over'
  switch (tool) {
    case 'pencil':
      ctx.lineWidth   = activeSize.value
      ctx.globalAlpha = 0.82
      ctx.lineCap     = 'round'
      ctx.lineJoin    = 'round'
      ctx.strokeStyle = activeColor.value
      break
    case 'pen':
      ctx.lineWidth   = activeSize.value * 0.7
      ctx.globalAlpha = 1.0
      ctx.lineCap     = 'round'
      ctx.lineJoin    = 'round'
      ctx.strokeStyle = activeColor.value
      break
    case 'marker':
      ctx.lineWidth   = activeSize.value * 3
      ctx.globalAlpha = 0.45
      ctx.lineCap     = 'square'
      ctx.lineJoin    = 'bevel'
      ctx.strokeStyle = activeColor.value
      break
    case 'eraser':
      ctx.lineWidth   = activeSize.value * 4
      ctx.globalAlpha = 1.0
      ctx.lineCap     = 'round'
      ctx.lineJoin    = 'round'
      ctx.strokeStyle = 'rgba(0,0,0,1)'
      break
  }
}

function typeCharacter(char) {
  if (!ctx || !drawCanvas.value) return
  const w = drawCanvas.value.clientWidth

  const fontSize = activeSize.value === 1.5 ? 16 : activeSize.value === 3 ? 22 : activeSize.value === 7 ? 30 : 42
  const lineHeight = fontSize * 1.75
  const fontStr = `600 ${fontSize}px 'Chalkboard SE', 'Comic Sans MS', 'Caveat', cursive, sans-serif`

  ctx.save()
  ctx.font = fontStr
  ctx.textBaseline = 'top'
  const charWidth = ctx.measureText(char).width

  // Auto-wrap to next line if past the right paper margin
  if (typingCursor.x + charWidth > w - 24) {
    typingCursor.x = typingCursor.startX
    typingCursor.y += lineHeight
  }

  // Save undo snapshot
  undoStack.value.push(ctx.getImageData(0, 0, drawCanvas.value.width, drawCanvas.value.height))
  if (undoStack.value.length > MAX_UNDO) undoStack.value.shift()

  // Track position history for backspacing
  typingCursor.cursorStack.push({
    x: typingCursor.x,
    y: typingCursor.y,
  })

  // Draw letter onto the paper canvas in real time
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = activeTool.value === 'pencil' ? 0.85 : 1.0
  ctx.fillStyle = activeColor.value
  ctx.fillText(char, typingCursor.x, typingCursor.y)
  ctx.restore()

  typingCursor.x += charWidth
  playPencilSound()
  saveDrawing()
}

function typeNewline() {
  const fontSize = activeSize.value === 1.5 ? 16 : activeSize.value === 3 ? 22 : activeSize.value === 7 ? 30 : 42
  const lineHeight = fontSize * 1.75

  typingCursor.cursorStack.push({
    x: typingCursor.x,
    y: typingCursor.y,
  })

  typingCursor.x = typingCursor.startX
  typingCursor.y += lineHeight
}

function handleBackspace() {
  if (typingCursor.cursorStack.length > 0) {
    const prev = typingCursor.cursorStack.pop()
    typingCursor.x = prev.x
    typingCursor.y = prev.y
    if (undoStack.value.length > 0) {
      ctx.putImageData(undoStack.value.pop(), 0, 0)
      saveDrawing()
    }
  }
}

function startDraw(e) {
  if (e.button !== 0 && e.pointerType !== 'touch' && e.pointerType !== 'pen') return
  e.preventDefault()

  const pos = canvasPos(e)
  drawCanvas.value.setPointerCapture(e.pointerId)
  isDrawing = true

  // Push undo snapshot
  const dpr = window.devicePixelRatio || 1
  const w   = drawCanvas.value.width  / dpr
  const h   = drawCanvas.value.height / dpr
  undoStack.value.push(ctx.getImageData(0, 0, drawCanvas.value.width, drawCanvas.value.height))
  if (undoStack.value.length > MAX_UNDO) undoStack.value.shift()

  ctx.beginPath()
  applyStrokeStyle()
  ctx.moveTo(pos.x, pos.y)
}

function draw(e) {
  if (!isDrawing) return
  e.preventDefault()
  const pos = canvasPos(e)
  ctx.lineTo(pos.x, pos.y)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(pos.x, pos.y)
}

function endDraw(e) {
  if (!isDrawing) return
  isDrawing = false
  ctx.globalAlpha = 1.0
  // Autosave
  saveDrawing()
}

function undo() {
  if (!undoStack.value.length) return
  ctx.putImageData(undoStack.value.pop(), 0, 0)
  if (typingCursor.cursorStack.length > 0) {
    const prev = typingCursor.cursorStack.pop()
    typingCursor.x = prev.x
    typingCursor.y = prev.y
  }
  saveDrawing()
}

function clearAll() {
  undoStack.value.push(ctx.getImageData(0, 0, drawCanvas.value.width, drawCanvas.value.height))
  const dpr = window.devicePixelRatio || 1
  ctx.clearRect(0, 0, drawCanvas.value.width / dpr, drawCanvas.value.height / dpr)
  typingCursor.x = START_X
  typingCursor.y = START_Y
  typingCursor.startX = START_X
  typingCursor.cursorStack = []
  saveDrawing()
}

function saveDrawing() {
  const url = drawCanvas.value.toDataURL('image/png')
  localStorage.setItem('miles_paper_drawing', url)
}

// ── Close ──────────────────────────────────────────────────────────────────────
function handleClose() {
  if (isExiting.value) return
  isExiting.value = true
  emit('close')
}

// ── Keyboard ───────────────────────────────────────────────────────────────────
function onKeydown(e) {
  if (e.key === 'Escape') {
    handleClose()
    return
  }

  if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
    e.preventDefault()
    undo()
    return
  }

  // If typing mode is toggled OFF, ignore typing keys
  if (!isTypingMode.value) return

  if (e.key === 'Backspace') {
    e.preventDefault()
    handleBackspace()
    return
  }

  if (e.key === 'Enter') {
    e.preventDefault()
    typeNewline()
    return
  }

  // Printable characters automatically typed directly onto paper
  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
    e.preventDefault()
    typeCharacter(e.key)
    return
  }
}

// ── Lifecycle ──────────────────────────────────────────────────────────────────
onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', layoutCanvas)
  // If image already loaded, layout immediately
  if (bgImgRef.value?.complete) layoutCanvas()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', layoutCanvas)
})
</script>

<style scoped>
/* ── Full-screen desk view ───────────────────────────────────────────────── */
.desk-view {
  position: fixed;
  inset: 0;
  z-index: 100;
  user-select: none;
}

/* ── Background image fills viewport (matches portal's bg-size: cover) ───── */
.desk-bg {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  pointer-events: none;
  z-index: 0;
  display: block;
}

/* ── Drawing canvas ──────────────────────────────────────────────────────── */
.paper-canvas {
  position: fixed;
  z-index: 10;
  touch-action: none;
  /* Transparent — drawing shows on canvas, paper texture shows through */
  background: transparent;
  /* Clip to the exact quadrilateral shape of the paper in the desk image.
     Corners as % of canvas bounding box (TL→TR→BR→BL):
       TL=(330,201) → (2.3%, 2.8%)
       TR=(594,191) → (89.7%, 0%)
       BR=(625,530) → (100%, 95.8%)
       BL=(323,545) → (0%, 100%)  */
  clip-path: polygon(2.3% 2.8%, 89.7% 0%, 100% 95.8%, 0% 100%);
}
.paper-canvas.cur-eraser { cursor: cell; }
.paper-canvas.cur-cross  { cursor: crosshair; }

/* ── Blinking ink caret on paper ─────────────────────────────────────────── */
.paper-caret {
  position: fixed;
  width: 2px;
  border-left: 2px solid;
  pointer-events: none;
  z-index: 15;
  animation: caretBlink 0.9s infinite;
}

@keyframes caretBlink {
  0%, 45%  { opacity: 0.85; }
  50%, 100% { opacity: 0; }
}

/* ── Floating HUD toolbar ────────────────────────────────────────────────── */
.hud {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: rgba(10, 10, 16, 0.82);
  backdrop-filter: blur(14px) saturate(180%);
  -webkit-backdrop-filter: blur(14px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 40px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06);
}

.hud-sep {
  width: 1px;
  height: 22px;
  background: rgba(255,255,255,0.12);
  margin: 0 4px;
  flex-shrink: 0;
}

/* ── Generic HUD button ─────────────────────────────────────────────────── */
.hud-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  min-width: 34px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: 20px;
  background: transparent;
  color: rgba(255,255,255,0.72);
  font-size: 16px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  white-space: nowrap;
}
.hud-btn:hover {
  background: rgba(255,255,255,0.10);
  color: #fff;
}
.hud-btn.active {
  background: rgba(255,255,255,0.16);
  border-color: rgba(255,255,255,0.22);
  color: #fff;
}
.hud-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.back-btn {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: rgba(255,255,255,0.55);
  padding: 0 12px;
}
.back-btn:hover { color: #fff; }

.type-toggle-btn {
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.03em;
  padding: 0 12px;
}

.type-toggle-btn.active {
  background: rgba(37, 99, 235, 0.28);
  border-color: rgba(96, 165, 250, 0.4);
  color: #93c5fd;
}

.type-icon {
  font-size: 15px;
}

.type-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.danger-btn {
  color: rgba(255, 90, 90, 0.7);
}
.danger-btn:hover {
  background: rgba(220, 38, 38, 0.18);
  color: #ff6b6b;
}

/* ── Size buttons ───────────────────────────────────────────────────────── */
.size-btn {
  min-width: 30px;
  height: 30px;
  padding: 0;
}

.hud-dot {
  display: block;
  border-radius: 50%;
  pointer-events: none;
  transition: background 0.15s;
}

/* ── Color swatches ─────────────────────────────────────────────────────── */
.hud-swatch {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.15s, border-color 0.15s, box-shadow 0.15s;
  flex-shrink: 0;
}
.hud-swatch:hover {
  transform: scale(1.2);
}
.hud-swatch.active {
  border-color: #fff;
  box-shadow: 0 0 0 2px rgba(0,0,0,0.5);
  transform: scale(1.15);
}
</style>
