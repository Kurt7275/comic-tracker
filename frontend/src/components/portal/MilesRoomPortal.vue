<template>
  <div 
    class="portal-container" 
    :class="{ 
      'monitor-hover': isHoveringMonitor,
      'lamp-hover': isHoveringLamp,
      'window-hover': isHoveringWindow,
      'paper-hover': isHoveringPaper,
      'lamp-is-off': !isLampOn
    }"
    @mousemove="onPointerMove" 
    @click="onCanvasClick"
  >

    <!-- Parallax layer: all 8 full room backgrounds + monitor screen + tooltips move together as ONE unit -->
    <div class="parallax-layer" ref="parallaxRef">
      
      <!-- 
        All 8 full room frames stacked in DOM with zero-latency GPU opacity.
        Frame 1 = Window wide open (golden dusk sky)
        ...
        Frame 8 = Window completely closed (blinds down, slatted twilight)
      -->
      <!-- Lamp ON frames: 8 full-scene frames stacked, only active frame visible -->
      <div 
        v-for="frameIndex in 8" 
        :key="`on-${frameIndex}`"
        class="room-bg"
        :class="[
          `room-frame-${frameIndex}`,
          { 
            'frame-active': isLampOn && currentFrame === frameIndex,
            'frame-hidden': !isLampOn || currentFrame !== frameIndex
          }
        ]"
      ></div>

      <!-- Lamp OFF frames: 8 matching frames for when the lamp is switched off -->
      <div 
        v-for="frameIndex in 8" 
        :key="`off-${frameIndex}`"
        class="room-bg"
        :class="[
          `room-frame-lamp-off-${frameIndex}`,
          { 
            'frame-active': !isLampOn && currentFrame === frameIndex,
            'frame-hidden': isLampOn || currentFrame !== frameIndex
          }
        ]"
      ></div>

      <!-- Interactive Window Hotspot -->
      <div 
        class="window-hotspot"
        :style="windowHotspotStyle"
      ></div>

      <!-- Monitor Screen Container with live Landing Page preview -->
      <div 
        class="monitor-screen-box" 
        :style="monitorScreenStyle"
        :class="{ zooming: isZooming, 'blue-light-on': isMonitorBlueLightOn }"
      >
        <iframe
          src="/landing"
          class="monitor-landing-preview"
          tabindex="-1"
          aria-hidden="true"
          scrolling="no"
        ></iframe>

        <!-- Subtle CRT scanlines & glass glare overlay -->
        <div class="monitor-glass-overlay"></div>
      </div>

      <!-- Interactive Office.exe-style Hover Prompt Box for MONITOR -->
      <transition name="card-fade">
        <div 
          v-if="isHoveringMonitor && !isZooming" 
          class="prompt-card monitor-card"
          :style="promptCardStyle"
        >
          <div class="prompt-title">THE MONITOR</div>
          <div class="prompt-desc">ComicVerse is running on it.</div>
          <div class="prompt-action">click to enter</div>
        </div>
      </transition>

      <!-- Interactive Office.exe-style Hover Prompt Box for DESK LAMP -->
      <transition name="card-fade">
        <div 
          v-if="isHoveringLamp && !isZooming" 
          class="prompt-card lamp-card"
          :style="lampCardStyle"
        >
          <div class="prompt-title lamp-title">DESK LAMP</div>
          <div class="prompt-desc">{{ isLampOn ? 'warm amber glow is cast.' : 'the lamp is turned off.' }}</div>
          <div class="prompt-action">{{ isLampOn ? 'click to switch off' : 'click to switch on' }}</div>
        </div>
      </transition>

      <!-- Interactive Office.exe-style Hover Prompt Box for WINDOW BLINDS -->
      <transition name="card-fade">
        <div 
          v-if="isHoveringWindow && !isZooming" 
          class="prompt-card window-card"
          :style="windowCardStyle"
        >
          <div class="prompt-title window-title">WINDOW BLINDS</div>
          <div class="prompt-desc">
            {{ currentFrame < 5 ? 'golden dusk filters into the room.' : 'the blinds block out the evening sky.' }}
          </div>
          <div class="prompt-action">
            {{ isBlindsClosed ? 'click to open blinds' : 'click to close blinds' }}
          </div>
        </div>
      </transition>

      <!-- Interactive Office.exe-style Hover Prompt Box for SKETCHBOOK -->
      <transition name="card-fade">
        <div 
          v-if="isHoveringPaper && !isZooming && !isSketchbookOpen" 
          class="prompt-card paper-card"
          :style="paperCardStyle"
        >
          <div class="prompt-title paper-title">SKETCHBOOK</div>
          <div class="prompt-desc">miles' drawings & multiverse notes.</div>
          <div class="prompt-action" :class="{ 'warning-action': isBlindsClosed }">
            {{ isBlindsClosed ? '⚠️ open window blinds first' : 'click to lean in' }}
          </div>
        </div>
      </transition>
    </div>

    <!-- Fixed Overlays -->
    <div class="halftone-film"></div>

    <!-- Shared ComicVerse loader used by the main app/auth flow -->
    <transition name="zoom-loader-fade">
      <div v-if="isZooming" class="app-loader">
        <div class="app-loader-bg"></div>
        <div class="app-loader-content">
          <div class="app-loader-logo">COMIC<span>VERSE</span></div>
          <div class="app-loader-dots">
            <span></span><span></span><span></span>
          </div>
          <div class="app-loader-tagline">Loading your universe...</div>
        </div>
      </div>
    </transition>

    <!-- Custom Spider-Verse Graphic Dialogue Box -->
    <transition name="vn-dialogue">
      <div 
        v-if="dialogueText || isTyping" 
        class="custom-vn-dialogue" 
        @click.stop="dismissDialogue"
      >
        <!-- Dialogue Box Graphic Frame -->
        <img 
          src="/dialogue_frame.png" 
          class="dialogue-frame-img" 
          alt="Dialogue Box" 
          draggable="false"
        />

        <!-- Interior Text Area -->
        <div class="dialogue-text-area">
          <p class="dialogue-speech-text">
            {{ dialogueText }}<span :class="['dialogue-typing-caret', { 'is-typing': isTyping }]">▌</span>
          </p>
        </div>
      </div>
    </transition>

    <!-- Animated Comic Sound Pop Bubbles -->
    <transition name="pop-burst">
      <div v-if="soundFxText" class="comic-sound-burst" :style="soundFxStyle">
        <span class="burst-text">{{ soundFxText }}</span>
      </div>
    </transition>

    <!-- Scene Transition Overlay (Summertime Saga-style fade to black) -->
    <div class="scene-fade" :class="{ active: isSceneFading }" />

    <!-- 2D Working Sketchbook Modal View -->
    <MilesSketchbookModal 
      v-if="isSketchbookOpen" 
      @close="closeSketchbook" 
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import MilesSketchbookModal from "./MilesSketchbookModal.vue";

const emit = defineEmits(["enter-app"]);

const parallaxRef     = ref(null);
const screenCanvasRef = ref(null);

const isZooming          = ref(false);
const isWarping          = ref(false);
const isHoveringMonitor  = ref(false);
const isHoveringLamp     = ref(false);
const isHoveringWindow   = ref(false);
const isHoveringPaper    = ref(false);
const isSketchbookOpen   = ref(false);
const isLeaningIn        = ref(false);
const isSceneFading      = ref(false);
const isLampOn           = ref(true);

// ─── Full-Room Frame-by-Frame Sequence (1 to 8) ──────────────────────────────
// Frame 1 = Blinds wide open (bright sunset sky across room)
// Frame 2 to 7 = Step-by-step lowering & closing of blinds + room lighting shift
// Frame 8 = Blinds fully closed (twilight night room)
const currentFrame         = ref(1);
const isBlindsAnimating    = ref(false);
const isBlindsClosed       = computed(() => currentFrame.value === 8);
// Ambient blue light beside monitor ONLY lights up when the window is closed AND lamp is off
const isMonitorBlueLightOn = computed(() => !isLampOn.value && isBlindsClosed.value);

const monitorScreenStyle  = ref({});
const promptCardStyle     = ref({});
const lampCardStyle       = ref({});
const lampHotspotStyle    = ref({});
const windowHotspotStyle  = ref({});
const windowCardStyle     = ref({});
const paperCardStyle      = ref({});

const soundFxText  = ref("");
const soundFxStyle = ref({});

// ─── Image Specifications (Wide Artwork: 1024 × 682) ────────────────────────
const IMG_W = 1024;
const IMG_H = 682;

// Exact verified monitor inner glass coordinates
const MON_X1 = 472.5;
const MON_X2 = 568.0;
const MON_Y1 = 286.5;
const MON_Y2 = 348.5;

// Exact verified lamp shade & bulb coordinates
const LAMP_X1 = 368.0;
const LAMP_X2 = 442.0;
const LAMP_Y1 = 275.0;
const LAMP_Y2 = 345.0;

// Exact verified window opening coordinates on main 1024x682 artwork
const WIN_X1 = 800.0;
const WIN_X2 = 905.0;
const WIN_Y1 = 65.0;
const WIN_Y2 = 355.0;

// Exact verified sketchbook paper pad coordinates on desk
const PAPER_X1 = 588.0;
const PAPER_X2 = 655.0;
const PAPER_Y1 = 358.0;
const PAPER_Y2 = 384.0;

// ─── Parallax State ─────────────────────────────────────────────────────────
const INSET   = 30;   // Buffer padding to prevent black edges when moving mouse
const MAX_PX  = 20;   // Max horizontal parallax shift
const MAX_PY  = 14;   // Max vertical parallax shift

const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
let animId = null;

// ─── Screen State ───────────────────────────────────────────────────────────
let screenCtx    = null;
let bootStep     = 0;
let bootProgress = 0;

// ─── Audio FX ───────────────────────────────────────────────────────────────
let audioCtx = null;
function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
function playTone(freq, dur = 0.08, type = "triangle") {
  try {
    initAudio();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const now = audioCtx.currentTime;
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(now + dur);
  } catch {}
}

// Satisfying mechanical lamp switch sound
function playLampSwitchSound(turningOn) {
  try {
    initAudio();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const now = audioCtx.currentTime;
    
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(turningOn ? 980 : 720, now);
    osc1.frequency.exponentialRampToValueAtTime(180, now + 0.05);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc1.connect(gain1); gain1.connect(audioCtx.destination);
    osc1.start(); osc1.stop(now + 0.05);

    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(turningOn ? 1400 : 420, now + 0.02);
    gain2.gain.setValueAtTime(0.15, now + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc2.connect(gain2); gain2.connect(audioCtx.destination);
    osc2.start(now + 0.02); osc2.stop(now + 0.06);
  } catch {}
}

// ── Window Opening & Closing Audio (from freesound_community-window-opening-100430.mp3) ──
// First half: window opening sound / Second half: window closing sound
let windowOpenBuffer = null;
let windowCloseBuffer = null;

async function preloadWindowSounds() {
  try {
    initAudio();
    const [openRes, closeRes] = await Promise.all([
      fetch('/sounds/window_open.mp3'),
      fetch('/sounds/window_close.mp3')
    ]);
    const [openData, closeData] = await Promise.all([
      openRes.arrayBuffer(),
      closeRes.arrayBuffer()
    ]);
    windowOpenBuffer = await audioCtx.decodeAudioData(openData);
    windowCloseBuffer = await audioCtx.decodeAudioData(closeData);
  } catch (err) {
    console.warn("Preloading window audio buffers failed:", err);
  }
}

function playWindowSound(isClosing) {
  try {
    initAudio();
    if (audioCtx.state === "suspended") audioCtx.resume();
    // Use the closing sound for both opening and closing
    const buf = windowCloseBuffer || windowOpenBuffer;
    if (buf) {
      const src = audioCtx.createBufferSource();
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.85, audioCtx.currentTime);
      src.buffer = buf;
      src.connect(gain);
      gain.connect(audioCtx.destination);
      src.start(0);
      return;
    }
  } catch {}

  // Fallback to HTML5 audio element
  try {
    const audio = new Audio('/sounds/window_close.mp3');
    audio.volume = 0.85;
    audio.play().catch(() => {});
  } catch {}
}

function playWarpSound() {
  try {
    initAudio();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const now = audioCtx.currentTime;
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(1900, now + 0.55);
    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(now + 0.6);
  } catch {}
}

function triggerSoundBubble(text, x = 50, y = 48) {
  soundFxText.value  = text;
  soundFxStyle.value = { left: `${x}%`, top: `${y}%` };
  setTimeout(() => { soundFxText.value = ""; }, 750);
}

const dialogueFullText  = ref("");
const dialogueText      = ref("");
const dialogueSpeaker   = ref("Miles");
const isTyping          = ref(false);
let dialogueTimer       = null;
let dialogueTimeout     = null;

function playVnBlip() {
  try {
    initAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1175, now + 0.05);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(now + 0.07);
  } catch {}
}

function playTypingTick() {
  try {
    initAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(640 + Math.random() * 80, now);
    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(now + 0.025);
  } catch {}
}

function showDialogue(text, speaker = "Miles") {
  dialogueSpeaker.value  = speaker;
  dialogueFullText.value = text;
  dialogueText.value     = "";
  isTyping.value         = true;
  playVnBlip();

  if (dialogueTimer) clearInterval(dialogueTimer);
  if (dialogueTimeout) clearTimeout(dialogueTimeout);

  let i = 0;
  dialogueTimer = setInterval(() => {
    if (i < dialogueFullText.value.length) {
      dialogueText.value += dialogueFullText.value[i];
      if (i % 2 === 0 && dialogueFullText.value[i] !== " ") {
        playTypingTick();
      }
      i++;
    } else {
      clearInterval(dialogueTimer);
      dialogueTimer = null;
      isTyping.value = false;
      dialogueTimeout = setTimeout(() => {
        dismissDialogue();
      }, 4500);
    }
  }, 20); // 20ms per character typewriter
}

function dismissDialogue() {
  // If user clicks while text is still typing, skip/fast-forward to the end!
  if (isTyping.value) {
    if (dialogueTimer) clearInterval(dialogueTimer);
    dialogueTimer = null;
    dialogueText.value = dialogueFullText.value;
    isTyping.value = false;
    playTone(560, 0.03, "triangle");
    if (dialogueTimeout) clearTimeout(dialogueTimeout);
    dialogueTimeout = setTimeout(() => {
      dismissDialogue();
    }, 4000);
    return;
  }

  // If already finished typing, dismiss the dialogue box
  if (!dialogueText.value) return;
  dialogueText.value = "";
  dialogueFullText.value = "";
  playTone(460, 0.03, "triangle");
  if (dialogueTimeout) clearTimeout(dialogueTimeout);
  if (dialogueTimer) clearInterval(dialogueTimer);
}

// ─── Responsive Cover Transform Math ───────────────────────────────────────
function getCoverTransform(cw, ch) {
  const scale  = Math.max(cw / IMG_W, ch / IMG_H);
  const rendW  = IMG_W * scale;
  const rendH  = IMG_H * scale;
  return {
    scale,
    offsetX: (cw - rendW) / 2,
    offsetY: (ch - rendH) / 2,
  };
}

function getMonitorInLayer() {
  const lw = window.innerWidth  + INSET * 2;
  const lh = window.innerHeight + INSET * 2;
  const { scale, offsetX, offsetY } = getCoverTransform(lw, lh);
  return {
    x: MON_X1 * scale + offsetX,
    y: MON_Y1 * scale + offsetY,
    w: (MON_X2 - MON_X1) * scale,
    h: (MON_Y2 - MON_Y1) * scale,
  };
}

function getLampInLayer() {
  const lw = window.innerWidth  + INSET * 2;
  const lh = window.innerHeight + INSET * 2;
  const { scale, offsetX, offsetY } = getCoverTransform(lw, lh);
  return {
    x: LAMP_X1 * scale + offsetX,
    y: LAMP_Y1 * scale + offsetY,
    w: (LAMP_X2 - LAMP_X1) * scale,
    h: (LAMP_Y2 - LAMP_Y1) * scale,
  };
}

function getWindowInLayer() {
  const lw = window.innerWidth  + INSET * 2;
  const lh = window.innerHeight + INSET * 2;
  const { scale, offsetX, offsetY } = getCoverTransform(lw, lh);
  return {
    x: WIN_X1 * scale + offsetX,
    y: WIN_Y1 * scale + offsetY,
    w: (WIN_X2 - WIN_X1) * scale,
    h: (WIN_Y2 - WIN_Y1) * scale,
  };
}

function getPaperInLayer() {
  const lw = window.innerWidth  + INSET * 2;
  const lh = window.innerHeight + INSET * 2;
  const { scale, offsetX, offsetY } = getCoverTransform(lw, lh);
  return {
    x: PAPER_X1 * scale + offsetX,
    y: PAPER_Y1 * scale + offsetY,
    w: (PAPER_X2 - PAPER_X1) * scale,
    h: (PAPER_Y2 - PAPER_Y1) * scale,
  };
}

function viewportToLayer(vx, vy) {
  return {
    lx: vx + INSET - mouse.x,
    ly: vy + INSET - mouse.y,
  };
}

// ─── Positioning Elements in Parallax Layer ─────────────────────────────────
function placeElements() {
  const r = getMonitorInLayer();
  
  // Position monitor screen container & compute scale for 1200x780 iframe
  monitorScreenStyle.value = {
    left: `${r.x}px`,
    top: `${r.y}px`,
    width: `${r.w}px`,
    height: `${r.h}px`,
    '--mon-scale-x': (r.w / 1200).toFixed(5),
    '--mon-scale-y': (r.h / 780).toFixed(5),
  };

  const canvas = screenCanvasRef.value;
  if (canvas) {
    canvas.width  = Math.round(r.w);
    canvas.height = Math.round(r.h);
    screenCtx = canvas.getContext("2d");
    drawScreen(r.w, r.h);
  }

  // Position monitor prompt card
  promptCardStyle.value = {
    left: `${r.x + r.w + 14}px`,
    top: `${r.y + r.h * 0.45}px`,
  };

  // Position lamp prompt card
  const lamp = getLampInLayer();
  lampHotspotStyle.value = {
    left: `${lamp.x}px`,
    top: `${lamp.y}px`,
    width: `${lamp.w}px`,
    height: `${lamp.h}px`,
  };

  lampCardStyle.value = {
    left: `${lamp.x - 170}px`,
    top: `${lamp.y + 10}px`,
  };

  // Position window hotspot and prompt card
  const win = getWindowInLayer();
  windowHotspotStyle.value = {
    left: `${win.x}px`,
    top: `${win.y}px`,
    width: `${win.w}px`,
    height: `${win.h}px`,
  };

  windowCardStyle.value = {
    left: `${win.x - 180}px`,
    top: `${win.y + win.h * 0.35}px`,
  };

  // Position sketchbook paper prompt card
  const paper = getPaperInLayer();
  paperCardStyle.value = {
    left: `${paper.x + paper.w * 0.1}px`,
    top: `${paper.y - 88}px`,
  };
}

function drawScreen(w, h) {
  const ctx = screenCtx;
  if (!ctx) return;
  ctx.clearRect(0, 0, w, h);

  if (isZooming.value) {
    // ── ComicVerse pop-art loader on the monitor canvas ──
    // Parchment background
    ctx.fillStyle = "#FAF4E8";
    ctx.fillRect(0, 0, w, h);

    // Halftone dot pattern
    const dotSpacing = Math.max(4, w * 0.06);
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    for (let dx = 0; dx < w; dx += dotSpacing) {
      for (let dy = 0; dy < h; dy += dotSpacing) {
        ctx.beginPath();
        ctx.arc(dx, dy, Math.max(0.8, dotSpacing * 0.1), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // "COMIC" in yellow with thick stroke
    const logoSize = Math.max(8, Math.round(h * 0.28));
    ctx.font = `900 ${logoSize}px 'Bangers', Impact, cursive`;
    ctx.textAlign = "center";
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = Math.max(1.5, logoSize * 0.1);
    ctx.lineJoin = "round";

    ctx.fillStyle = "#F5D13B";
    ctx.shadowColor = "#8B3A1C";
    ctx.shadowOffsetX = Math.round(logoSize * 0.12);
    ctx.shadowOffsetY = Math.round(logoSize * 0.12);
    ctx.shadowBlur = 0;
    ctx.strokeText("COMIC", w / 2, h * 0.38);
    ctx.fillText("COMIC", w / 2, h * 0.38);

    // "VERSE" in white
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeText("VERSE", w / 2, h * 0.38 + logoSize * 1.05);
    ctx.fillText("VERSE", w / 2, h * 0.38 + logoSize * 1.05);
    ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; ctx.shadowBlur = 0;

    // Bouncing dots (animate using bootProgress to cycle)
    const dotY = h * 0.82;
    const dotR = Math.max(2, w * 0.055);
    const dotColors = ["#F5D13B", "#EE3545", "#44C555"];
    const dotSpacingX = dotR * 2.8;
    const totalDotsW = dotSpacingX * 2;
    const dotStartX = w / 2 - totalDotsW / 2;
    const time = bootProgress * 0.12;
    dotColors.forEach((col, i) => {
      const bounce = Math.sin(time + i * 1.2) * dotR * 0.7;
      ctx.fillStyle = col;
      ctx.strokeStyle = "#111111";
      ctx.lineWidth = Math.max(0.8, dotR * 0.18);
      ctx.beginPath();
      ctx.arc(dotStartX + i * dotSpacingX, dotY + bounce, dotR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });


    return;
  }

  // ── Idle state: dark terminal look (canvas hidden behind iframe anyway) ──
  ctx.fillStyle = "#0c1828";
  ctx.fillRect(0, 0, w, h);

  const glassGrad = ctx.createLinearGradient(0, 0, w, h);
  glassGrad.addColorStop(0, "rgba(255, 255, 255, 0.08)");
  glassGrad.addColorStop(0.5, "rgba(255, 255, 255, 0)");
  glassGrad.addColorStop(1, "rgba(0, 0, 0, 0.25)");
  ctx.fillStyle = glassGrad;
  ctx.fillRect(0, 0, w, h);
}

// ─── Hit Tests ──────────────────────────────────────────────────────────────
function hitTestMonitor(clientX, clientY) {
  const { lx, ly } = viewportToLayer(clientX, clientY);
  const r = getMonitorInLayer();
  return lx >= r.x && lx <= r.x + r.w && ly >= r.y && ly <= r.y + r.h;
}

function hitTestLamp(clientX, clientY) {
  const { lx, ly } = viewportToLayer(clientX, clientY);
  const l = getLampInLayer();
  return lx >= l.x && lx <= l.x + l.w && ly >= l.y && ly <= l.y + l.h;
}

function hitTestWindow(clientX, clientY) {
  const { lx, ly } = viewportToLayer(clientX, clientY);
  const w = getWindowInLayer();
  return lx >= w.x && lx <= w.x + w.w && ly >= w.y && ly <= w.y + w.h;
}

function hitTestPaper(clientX, clientY) {
  const { lx, ly } = viewportToLayer(clientX, clientY);
  const p = getPaperInLayer();
  return lx >= p.x && lx <= p.x + p.w && ly >= p.y && ly <= p.y + p.h;
}

// ─── Full-Scene Frame-by-Frame Blinds Pull Sequence ─────────────────────────
function toggleWindowBlinds() {
  if (isBlindsAnimating.value) return;
  isBlindsAnimating.value = true;

  const closing = currentFrame.value < 5;
  const targetFrame = closing ? 8 : 1;
  const step = closing ? 1 : -1;
  const frameDelay = 85; // 85ms per frame (~600ms total) matches the natural sound duration

  // Play opening sound (first half) or closing sound (second half)
  playWindowSound(closing);

  function playNextStep() {
    if (currentFrame.value === targetFrame) {
      isBlindsAnimating.value = false;
      return;
    }

    currentFrame.value += step;
    setTimeout(playNextStep, frameDelay);
  }

  playNextStep();
}

// ─── Parallax Loop ──────────────────────────────────────────────────────────
function animate() {
  animId = requestAnimationFrame(animate);
  if (isZooming.value || isLeaningIn.value || isSketchbookOpen.value) return;

  mouse.x += (mouse.tx - mouse.x) * 0.07;
  mouse.y += (mouse.ty - mouse.y) * 0.07;

  const layer = parallaxRef.value;
  if (layer) {
    layer.style.transform = `translate(${mouse.x.toFixed(2)}px, ${mouse.y.toFixed(2)}px)`;
  }
}

// ─── Event Handlers ─────────────────────────────────────────────────────────
function onPointerMove(e) {
  if (isSketchbookOpen.value || isLeaningIn.value) return;

  if (!isZooming.value) {
    const ndcX = (e.clientX / window.innerWidth)  * 2 - 1;
    const ndcY = (e.clientY / window.innerHeight) * 2 - 1;
    mouse.tx = -ndcX * MAX_PX;
    mouse.ty = -ndcY * MAX_PY;
  }

  const hoveringMon = hitTestMonitor(e.clientX, e.clientY);
  const hoveringLmp = !hoveringMon && hitTestLamp(e.clientX, e.clientY);
  const hoveringWin = !hoveringMon && !hoveringLmp && hitTestWindow(e.clientX, e.clientY);
  const hoveringPap = !hoveringMon && !hoveringLmp && !hoveringWin && hitTestPaper(e.clientX, e.clientY);

  if (hoveringMon !== isHoveringMonitor.value) {
    isHoveringMonitor.value = hoveringMon;
    if (hoveringMon) playTone(440, 0.04, "sine");
  }

  if (hoveringLmp !== isHoveringLamp.value) {
    isHoveringLamp.value = hoveringLmp;
    if (hoveringLmp) playTone(520, 0.03, "sine");
  }

  if (hoveringWin !== isHoveringWindow.value) {
    isHoveringWindow.value = hoveringWin;
    if (hoveringWin) playTone(360, 0.04, "sine");
  }

  if (hoveringPap !== isHoveringPaper.value) {
    isHoveringPaper.value = hoveringPap;
    if (hoveringPap) playTone(480, 0.03, "sine");
  }

  document.body.style.cursor = (hoveringMon || hoveringLmp || hoveringWin || hoveringPap) ? "pointer" : "default";
}

function onCanvasClick(e) {
  if (isZooming.value || isSketchbookOpen.value || isLeaningIn.value) return;

  // If a visual novel dialogue is currently open or typing, click anywhere to skip/dismiss it
  if (dialogueText.value || isTyping.value) {
    dismissDialogue();
    return;
  }

  // 1. Click Monitor -> Warp to ComicVerse
  if (hitTestMonitor(e.clientX, e.clientY)) {
    startZoomThrough();
    return;
  }

  // 2. Click Desk Lamp -> Toggle Light ON / OFF
  if (hitTestLamp(e.clientX, e.clientY)) {
    toggleLamp();
    return;
  }

  // 3. Click Window Blinds -> Animate Open / Close
  if (hitTestWindow(e.clientX, e.clientY)) {
    toggleWindowBlinds();
    return;
  }

  // 4. Click Sketchbook Paper -> Lean In to 2D view (or Summertime Saga dialogue if dark)
  if (hitTestPaper(e.clientX, e.clientY)) {
    if (isBlindsClosed.value) {
      showDialogue("It's too dark to see anything in here... I should open the window blinds first.", "Miles");
      return;
    }
    openSketchbook();
    return;
  }
}

// ─── Scene Transition (Summertime Saga-style fade-to-black crossfade) ────────
const FADE_HALF = 280; // ms for fade-out, same for fade-in

function openSketchbook() {
  if (isLeaningIn.value || isSketchbookOpen.value || isZooming.value || isBlindsClosed.value) return;
  isLeaningIn.value = true;
  document.body.style.cursor = "default";
  playTone(520, 0.05, "triangle");

  // 1. Fade TO black
  isSceneFading.value = true;

  setTimeout(() => {
    // 2. At peak black: swap scene
    isSketchbookOpen.value = true;

    // 3. Fade FROM black
    setTimeout(() => {
      isSceneFading.value = false;
    }, 40);
  }, FADE_HALF);
}

function closeSketchbook() {
  if (!isSketchbookOpen.value) return;
  playTone(420, 0.05, "triangle");

  // 1. Fade TO black
  isSceneFading.value = true;

  setTimeout(() => {
    // 2. At peak black: swap scene back
    isSketchbookOpen.value = false;

    // Reset room layer that was set to scale(5) during openSketchbook
    const layer = parallaxRef.value;
    if (layer) {
      layer.style.transition = "none";
      layer.style.transform = "";
      layer.style.transformOrigin = "";
    }

    // 3. Fade FROM black
    setTimeout(() => {
      isSceneFading.value = false;
      isLeaningIn.value = false;
    }, 40);
  }, FADE_HALF);
}

function toggleLamp() {
  isLampOn.value = !isLampOn.value;
  playLampSwitchSound(isLampOn.value);
}

function onResize() {
  placeElements();
}

// ─── Warp Transition ────────────────────────────────────────────────────────
function startZoomThrough() {
  if (isZooming.value) return;
  isZooming.value = true;
  document.body.style.cursor = "default";

  const layer     = parallaxRef.value;
  const startTime = performance.now();
  const duration  = 1200;

  const r = getMonitorInLayer();
  const monCenterX = r.x + r.w / 2;
  const monCenterY = r.y + r.h / 2;

  if (layer) {
    layer.style.transformOrigin = `${monCenterX}px ${monCenterY}px`;
  }

  function stepZoom() {
    const elapsed = performance.now() - startTime;
    const t       = Math.min(elapsed / duration, 1);
    const ease    = t * t * (3 - 2 * t);
    const scale   = 1 + ease * 4.5;

    if (layer) {
      layer.style.transform = `scale(${scale})`;
    }

    if (t < 1) {
      requestAnimationFrame(stepZoom);
    } else {
      triggerPunchThrough();
    }
  }
  requestAnimationFrame(stepZoom);
}

function triggerPunchThrough() {
  emit("enter-app");
}

// ─── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(() => {
  // Preload all 8 lamp-on full-scene frames immediately into browser memory
  for (let i = 1; i <= 8; i++) {
    const f = new Image();
    f.src = `/full_frames/frame_${i}.jpg`;
  }
  // Preload all 8 lamp-off full-scene frames immediately into browser memory
  for (let i = 1; i <= 8; i++) {
    const f = new Image();
    f.src = `/full_frames/frame_lamp_off_${i}.jpg`;
  }

  // Preload desk close-up background for instant lean-in
  const deskBg = new Image();
  deskBg.src = "/desk_sketchbook_bg.jpg";

  placeElements();
  animate();
  window.addEventListener("resize", onResize);
  preloadWindowSounds();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animId);
  window.removeEventListener("resize", onResize);
  document.body.style.cursor = "default";
});
</script>

<style scoped>
.portal-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #06111a;
}

/* Fade-to-black overlay for scene crossfade transitions */
.scene-fade {
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 200;
  pointer-events: none;
  opacity: 0;
  transition: opacity 280ms ease-in-out;
}
.scene-fade.active {
  opacity: 1;
}

/* Parallax layer: extends beyond viewport by INSET px for smooth panning */
.parallax-layer {
  position: absolute;
  inset: -30px;
  will-change: transform;
  transform-origin: center center;
  transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

/* Room Artwork Backgrounds - All 8 Full Scene Frames Stacked in DOM */
.room-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  will-change: opacity;
  pointer-events: none;
}

/* Individual Full Scene Frames 1 to 8 — Lamp ON */
.room-frame-1 { background-image: url('/full_frames/frame_1.jpg'); z-index: 1; }
.room-frame-2 { background-image: url('/full_frames/frame_2.jpg'); z-index: 2; }
.room-frame-3 { background-image: url('/full_frames/frame_3.jpg'); z-index: 3; }
.room-frame-4 { background-image: url('/full_frames/frame_4.jpg'); z-index: 4; }
.room-frame-5 { background-image: url('/full_frames/frame_5.jpg'); z-index: 5; }
.room-frame-6 { background-image: url('/full_frames/frame_6.jpg'); z-index: 6; }
.room-frame-7 { background-image: url('/full_frames/frame_7.jpg'); z-index: 7; }
.room-frame-8 { background-image: url('/full_frames/frame_8.jpg'); z-index: 8; }

/* Individual Full Scene Frames 1 to 8 — Lamp OFF (darker room, blinds matching) */
.room-frame-lamp-off-1 { background-image: url('/full_frames/frame_lamp_off_1.jpg'); z-index: 9; }
.room-frame-lamp-off-2 { background-image: url('/full_frames/frame_lamp_off_2.jpg'); z-index: 10; }
.room-frame-lamp-off-3 { background-image: url('/full_frames/frame_lamp_off_3.jpg'); z-index: 11; }
.room-frame-lamp-off-4 { background-image: url('/full_frames/frame_lamp_off_4.jpg'); z-index: 12; }
.room-frame-lamp-off-5 { background-image: url('/full_frames/frame_lamp_off_5.jpg'); z-index: 13; }
.room-frame-lamp-off-6 { background-image: url('/full_frames/frame_lamp_off_6.jpg'); z-index: 14; }
.room-frame-lamp-off-7 { background-image: url('/full_frames/frame_lamp_off_7.jpg'); z-index: 15; }
.room-frame-lamp-off-8 { background-image: url('/full_frames/frame_lamp_off_8.jpg'); z-index: 16; }

.frame-active {
  opacity: 1;
}

.frame-hidden {
  opacity: 0;
}

/* Window Hotspot */
.window-hotspot {
  position: absolute;
  z-index: 20;
  pointer-events: none;
}

/* Monitor Screen Container — holds live Landing Page preview, CRT glass, and overlay */
.monitor-screen-box {
  position: absolute;
  overflow: hidden;
  border-radius: 2px;
  background: #faf4e8;
  z-index: 20;
  will-change: transform, filter, box-shadow;
  pointer-events: none;
  filter: blur(0.35px) contrast(1.04) brightness(0.96);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.45);
  transition: filter 0.3s ease, box-shadow 0.5s ease;
}

.monitor-landing-preview {
  position: absolute;
  top: 0;
  left: 0;
  width: 1200px;
  height: 780px;
  border: none;
  pointer-events: none;
  user-select: none;
  transform-origin: 0 0;
  transform: scale(var(--mon-scale-x, 0.08), var(--mon-scale-y, 0.08));
}

.monitor-glass-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.45);
}

.monitor-screen-box .screen-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
  z-index: 5;
}

/* ── Monitor Zoom Loader ── */
.zoom-loader-fade-enter-active { transition: opacity 0.25s ease; }
.zoom-loader-fade-leave-active { transition: opacity 0.2s ease; }
.zoom-loader-fade-enter-from,
.zoom-loader-fade-leave-to { opacity: 0; }

/* Blue ambient backlight beside monitor — ONLY lights up when window is closed AND lamp is off */
.monitor-screen-box.blue-light-on {
  filter: contrast(1.08) brightness(1.04);
  box-shadow: 
    inset 0 0 6px rgba(0, 0, 0, 0.45),
    0 0 16px rgba(56, 189, 248, 0.5),
    0 0 38px rgba(56, 189, 248, 0.28);
}

/* Hover aura when pointing at monitor */
.portal-container.monitor-hover .monitor-screen-box {
  box-shadow: 
    inset 0 0 8px rgba(0, 0, 0, 0.45),
    0 0 14px rgba(56, 189, 248, 0.55),
    0 0 24px rgba(244, 63, 94, 0.35);
}

.portal-container.monitor-hover .monitor-screen-box.blue-light-on {
  box-shadow: 
    inset 0 0 8px rgba(0, 0, 0, 0.45),
    0 0 20px rgba(56, 189, 248, 0.8),
    0 0 45px rgba(56, 189, 248, 0.45),
    0 0 32px rgba(244, 63, 94, 0.35);
}

.monitor-screen-box.zooming {
  filter: blur(0px) contrast(1.05) brightness(1.02);
}

/* Office.exe Style Terminal Hover Cards */
.prompt-card {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 14px;
  background: rgba(10, 18, 28, 0.94);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.65);
  border-radius: 2px;
  backdrop-filter: blur(8px);
  z-index: 25;
  pointer-events: none;
  min-width: 175px;
  font-family: monospace;
}

/* Monitor card (Cyber Green) */
.monitor-card {
  border: 1px solid rgba(74, 222, 128, 0.4);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.65),
    0 0 12px rgba(74, 222, 128, 0.18);
}
.prompt-title {
  color: #4ade80;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* Lamp card (Warm Amber) */
.lamp-card {
  border: 1px solid rgba(250, 204, 21, 0.45);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.65),
    0 0 12px rgba(250, 204, 21, 0.22);
}
.lamp-title {
  color: #facc15;
}

/* Window card (Sunset Orange / Coral) */
.window-card {
  border: 1px solid rgba(249, 115, 22, 0.45);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.65),
    0 0 14px rgba(249, 115, 22, 0.25);
}
.window-title {
  color: #fb923c;
}

/* Sketchbook Paper card (Golden Parchment / Miles Red Accent) */
.paper-card {
  border: 1px solid rgba(251, 191, 36, 0.5);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.65),
    0 0 14px rgba(251, 191, 36, 0.25),
    0 0 24px rgba(225, 29, 72, 0.2);
}
.paper-title {
  color: #fbbf24;
}

.prompt-desc {
  color: #cbd5e1;
  font-size: 0.68rem;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.prompt-action {
  color: #94a3b8;
  font-size: 0.62rem;
  font-style: italic;
  margin-top: 2px;
}

.prompt-action.warning-action {
  color: #f87171;
  font-weight: 700;
  letter-spacing: 0.03em;
}

/* ─── Custom Spider-Verse Graphic Dialogue Box ─────────────────────────────── */
.custom-vn-dialogue {
  position: fixed;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: min(960px, calc(100vw - 32px));
  aspect-ratio: 1005 / 195;
  z-index: 120;
  cursor: pointer;
  user-select: none;
  /* Only dark drop-shadow — no red glow */
  filter: drop-shadow(0 12px 28px rgba(0, 0, 0, 0.92));
  transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), filter 0.18s ease;
}

.custom-vn-dialogue:hover {
  filter: drop-shadow(0 16px 36px rgba(0, 0, 0, 0.98));
}

.dialogue-frame-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  display: block;
}

/* Text area — vertically centered inside the dark interior, text starting from the left */
.dialogue-text-area {
  position: absolute;
  left: 17.5%;
  top: 56.5%;
  transform: translateY(-50%);
  width: 69%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  z-index: 2;
  pointer-events: none;
}

.dialogue-speech-text {
  margin: 0;
  text-align: left;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  font-size: clamp(0.85rem, 1.4vw, 1.12rem);
  line-height: 1.45;
  color: #f8fafc;
  font-style: italic;
  font-weight: 500;
  letter-spacing: 0.015em;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9), 0 0 8px rgba(0, 0, 0, 0.7);
}

.dialogue-typing-caret {
  display: inline-block;
  color: #e11d48;
  margin-left: 3px;
  font-style: normal;
  font-weight: 900;
  /* hidden and static when not typing — prevents reflow on state change */
  opacity: 0;
  animation: none;
}

.dialogue-typing-caret.is-typing {
  opacity: 1;
  animation: caretPulse 0.35s infinite alternate;
}

@keyframes caretPulse {
  0%   { opacity: 0.2; }
  100% { opacity: 1; text-shadow: 0 0 8px #e11d48; }
}

/* Pulsing glow aligned with the red ▼ arrow in the PNG (92.2%, 81%) */
.dialogue-arrow-glow {
  position: absolute;
  left: 92.2%;
  top: 81%;
  transform: translate(-50%, -50%);
  color: #f43f5e;
  font-size: clamp(0.75rem, 1.1vw, 0.95rem);
  pointer-events: none;
  z-index: 3;
  animation: arrowPulse 0.75s ease-in-out infinite alternate;
}

@keyframes arrowPulse {
  0%   { transform: translate(-50%, -50%) scale(0.9); opacity: 0.35; }
  100% { transform: translate(-50%, -46%) scale(1.18); opacity: 1; text-shadow: 0 0 10px #f43f5e, 0 0 18px #e11d48; }
}

.dialogue-skip-hint {
  position: absolute;
  left: 92.2%;
  top: 81%;
  transform: translate(-50%, -50%);
  color: #facc15;
  font-size: 0.8rem;
  pointer-events: none;
  z-index: 3;
  animation: skipBlink 0.4s infinite alternate;
}

@keyframes skipBlink {
  0%   { opacity: 0.3; }
  100% { opacity: 1; text-shadow: 0 0 8px #facc15; }
}

/* VN Dialogue slide in / out transition */
.vn-dialogue-enter-active {
  transition: all 0.26s cubic-bezier(0.16, 1, 0.3, 1);
}
.vn-dialogue-leave-active {
  transition: all 0.18s ease-out;
}
.vn-dialogue-enter-from {
  opacity: 0;
  transform: translate(-50%, 24px) scale(0.98);
}
.vn-dialogue-leave-to {
  opacity: 0;
  transform: translate(-50%, 14px) scale(0.98);
}

/* Card fade & pop animation */
.card-fade-enter-active {
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}
.card-fade-leave-active {
  transition: all 0.15s ease-out;
}
.card-fade-enter-from {
  opacity: 0;
  transform: translateX(-6px) scale(0.96);
}
.card-fade-leave-to {
  opacity: 0;
  transform: translateX(-4px) scale(0.98);
}

/* Halftone Film Texture */
.halftone-film {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    radial-gradient(#000 14%, transparent 15%),
    radial-gradient(#000 14%, transparent 15%);
  background-size: 6px 6px;
  background-position: 0 0, 3px 3px;
  opacity: 0.10;
  z-index: 20;
}


/* Comic FX Bursts */
.comic-sound-burst {
  position: absolute;
  transform: translate(-50%, -50%) rotate(-6deg);
  z-index: 70;
  pointer-events: none;
}
.burst-text {
  font-family: Impact, "Arial Black", sans-serif;
  font-size: 3.8rem;
  font-weight: 900;
  color: #facc15;
  text-shadow:
    4px 4px 0 #000, -4px -4px 0 #000,
    4px -4px 0 #000, -4px  4px 0 #000,
    8px 8px 0 #e11d48;
  letter-spacing: 0.05em;
  animation: burstShake 0.4s ease;
}
@keyframes burstShake {
  0%   { transform: scale(0.3) rotate(-15deg); }
  50%  { transform: scale(1.3) rotate(6deg); }
  100% { transform: scale(1)   rotate(-6deg); }
}
.pop-burst-enter-active { animation: burstShake 0.4s ease; }
.pop-burst-leave-active { transition: opacity 0.15s; }
.pop-burst-leave-to     { opacity: 0; }

/* ── Fullscreen ComicVerse Warp Loader ── */
.cv-warp-loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FAF4E8;
  overflow: hidden;
}

.cv-warp-loader-bg {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(0,0,0,0.08) 1.2px, transparent 1.2px);
  background-size: 13px 13px;
}

.cv-warp-loader-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.cv-warp-loader-logo {
  font-family: 'Bangers', 'Impact', cursive;
  font-size: clamp(3.5rem, 10vw, 6rem);
  letter-spacing: 0.08em;
  color: #F5D13B;
  -webkit-text-stroke: 3px #111111;
  text-shadow: 5px 5px 0px #8B3A1C;
  line-height: 1;
  animation: cv-logo-pop 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}

.cv-warp-loader-logo span {
  color: #FFFFFF;
  -webkit-text-stroke: 3px #111111;
}

@keyframes cv-logo-pop {
  0%   { transform: scale(0.6); opacity: 0; }
  60%  { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1); }
}

.cv-warp-loader-dots {
  display: flex;
  gap: 0.6rem;
}

.cv-warp-loader-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #F5D13B;
  border: 2px solid #111111;
  animation: cv-loader-bounce 0.7s ease-in-out infinite;
}

.cv-warp-loader-dots span:nth-child(2) { animation-delay: 0.15s; background: #EE3545; }
.cv-warp-loader-dots span:nth-child(3) { animation-delay: 0.30s; background: #44C555; }

@keyframes cv-loader-bounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-10px); }
}

.cv-warp-loader-tagline {
  font-family: 'Bangers', 'Impact', cursive;
  font-size: 1.1rem;
  letter-spacing: 0.12em;
  color: rgba(17,17,17,0.45);
}

/* Loader transition */
.cv-loader-fade-enter-active { transition: opacity 0.3s ease; }
.cv-loader-fade-leave-active { transition: opacity 0.5s ease; }
.cv-loader-fade-enter-from,
.cv-loader-fade-leave-to     { opacity: 0; }
</style>
