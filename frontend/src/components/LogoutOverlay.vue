<template>
  <teleport to="body">
    <transition name="logout-fade">
      <div v-if="comicStore.isLoggingOut" class="logout-overlay">

        <!-- 100% Hardware-Accelerated SVG Sunburst Rays -->
        <div class="logout-sunburst-wrap">
          <svg class="logout-sunburst-svg" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
            <g fill="#8B1A25">
              <path d="M100,100 L350,100 L350,167 Z" transform="rotate(0 100 100)" />
              <path d="M100,100 L350,100 L350,167 Z" transform="rotate(30 100 100)" />
              <path d="M100,100 L350,100 L350,167 Z" transform="rotate(60 100 100)" />
              <path d="M100,100 L350,100 L350,167 Z" transform="rotate(90 100 100)" />
              <path d="M100,100 L350,100 L350,167 Z" transform="rotate(120 100 100)" />
              <path d="M100,100 L350,100 L350,167 Z" transform="rotate(150 100 100)" />
              <path d="M100,100 L350,100 L350,167 Z" transform="rotate(180 100 100)" />
              <path d="M100,100 L350,100 L350,167 Z" transform="rotate(210 100 100)" />
              <path d="M100,100 L350,100 L350,167 Z" transform="rotate(240 100 100)" />
              <path d="M100,100 L350,100 L350,167 Z" transform="rotate(270 100 100)" />
              <path d="M100,100 L350,100 L350,167 Z" transform="rotate(300 100 100)" />
              <path d="M100,100 L350,100 L350,167 Z" transform="rotate(330 100 100)" />
            </g>
          </svg>
        </div>

        <!-- Halftone Dot Texture -->
        <div class="logout-dots"></div>

        <!-- 4 GPU-Accelerated Pop-Art Stars in Corners -->
        <div class="logout-star star-tl">
          <svg viewBox="0 0 24 24" fill="#F5D13B" stroke="#111111" stroke-width="2" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>

        <div class="logout-star star-tr">
          <svg viewBox="0 0 24 24" fill="#F5D13B" stroke="#111111" stroke-width="2" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>

        <div class="logout-star star-bl">
          <svg viewBox="0 0 24 24" fill="#F5D13B" stroke="#111111" stroke-width="2" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>

        <div class="logout-star star-br">
          <svg viewBox="0 0 24 24" fill="#F5D13B" stroke="#111111" stroke-width="2" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>

        <!-- Center Content Box -->
        <div class="logout-content">
          <!-- BYE! -->
          <h1 class="logout-bye-title">BYE!</h1>
          <!-- SEE YOU NEXT TIME! -->
          <p class="logout-subtitle">SEE YOU NEXT TIME!</p>
        </div>

      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { comicStore } from '../stores/useComicStore.js'
</script>

<style scoped>
/* ── Overlay Container ── */
.logout-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background-color: #EE3545;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  user-select: none;
  transform: translate3d(0,0,0);
  will-change: opacity;
}

/* ── SVG Sunburst Rays: GPU Pass By ── */
.logout-sunburst-wrap {
  position: absolute;
  inset: -60%;
  opacity: 0;
  pointer-events: none;
  will-change: transform, opacity;
  transform: translate3d(0,0,0);
  animation: sunburstScaleAndFade 1.35s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
}

.logout-sunburst-svg {
  width: 100%;
  height: 100%;
  display: block;
  transform-origin: center center;
  animation: sunburstConstantSpin 20s linear infinite;
  will-change: transform;
}

@keyframes sunburstScaleAndFade {
  0% {
    opacity: 0;
    transform: scale(0.25);
  }
  45% {
    opacity: 0.85;
    transform: scale(1);
  }
  75% {
    opacity: 0.85;
    transform: scale(1.2);
  }
  100% {
    opacity: 0;
    transform: scale(1.5);
  }
}

@keyframes sunburstConstantSpin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ── Halftone Dot Texture ── */
.logout-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.12) 1.5px, transparent 1.5px);
  background-size: 14px 14px;
  pointer-events: none;
}

/* ── Pop-Art Stars: GPU Accelerated Pass By ── */
.logout-star {
  position: absolute;
  width: clamp(48px, 8vw, 80px);
  height: clamp(48px, 8vw, 80px);
  z-index: 2;
  filter: drop-shadow(3.5px 3.5px 0px #111111);
  opacity: 0;
  will-change: transform, opacity;
  transform: translate3d(0,0,0);
  animation: starGpuPassBy 1.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.star-tl {
  top: 10%;
  left: 8%;
  transform: rotate(-10deg);
  animation-delay: 0.18s;
}

.star-tr {
  top: 12%;
  right: 8%;
  transform: rotate(12deg);
  animation-delay: 0.24s;
}

.star-bl {
  bottom: 12%;
  left: 10%;
  transform: rotate(6deg);
  animation-delay: 0.30s;
}

.star-br {
  bottom: 10%;
  right: 8%;
  transform: rotate(-8deg);
  animation-delay: 0.36s;
}

@keyframes starGpuPassBy {
  0% {
    opacity: 0;
    transform: translate3d(-15px, 20px, 0) scale(0.3) rotate(-15deg);
  }
  40% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
  }
  70% {
    opacity: 1;
    transform: translate3d(5px, -5px, 0) scale(1.05) rotate(5deg);
  }
  100% {
    opacity: 0;
    transform: translate3d(15px, -20px, 0) scale(0.4) rotate(20deg);
  }
}

/* ── Center Content Box ── */
.logout-content {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;
  will-change: transform, opacity;
  transform: translate3d(0,0,0);
}

/* ── Big "BYE!" Title with Comic Shake Impact ── */
.logout-bye-title {
  font-family: 'Bangers', cursive;
  font-size: clamp(5.5rem, 18vw, 11rem);
  letter-spacing: 0.06em;
  font-style: normal;
  color: #F5D13B;
  -webkit-text-stroke: 4px #111111;
  paint-order: stroke fill;
  text-shadow: 6px 6px 0px #111111;
  line-height: 0.95;
  margin: 0;
  will-change: transform, opacity;
  animation: byePopShake 0.50s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.05s forwards;
  opacity: 0;
}

@keyframes byePopShake {
  0% {
    opacity: 0;
    transform: translate3d(0, 16px, 0) scale(0.35) rotate(-6deg);
  }
  32% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1.15) rotate(4deg);
  }
  44% {
    transform: translate3d(-6px, -4px, 0) scale(1.05) rotate(-3deg);
  }
  56% {
    transform: translate3d(6px, 4px, 0) scale(1.05) rotate(3deg);
  }
  68% {
    transform: translate3d(-4px, 3px, 0) scale(1.02) rotate(-2deg);
  }
  80% {
    transform: translate3d(4px, -3px, 0) scale(1.02) rotate(2deg);
  }
  92% {
    transform: translate3d(-2px, 1px, 0) scale(1) rotate(-1deg);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
  }
}

/* ── Subtitle "SEE YOU NEXT TIME!" ── */
.logout-subtitle {
  font-family: 'Bangers', cursive;
  font-size: clamp(1.6rem, 4.5vw, 3rem);
  letter-spacing: 0.1em;
  font-style: normal;
  color: #FFFFFF;
  -webkit-text-stroke: 2px #111111;
  paint-order: stroke fill;
  text-shadow: 3.5px 3.5px 0px #111111;
  margin-top: 0.75rem;
  will-change: transform, opacity;
  animation: subtitleGpuEntrance 0.38s cubic-bezier(0.22, 1, 0.36, 1) 0.57s forwards;
  opacity: 0;
}

@keyframes subtitleGpuEntrance {
  0% {
    opacity: 0;
    transform: translate3d(0, 14px, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

/* ── Liquid Smooth Overlay Fade ── */
.logout-fade-enter-active {
  transition: opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.logout-fade-leave-active {
  transition: opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.logout-fade-enter-from,
.logout-fade-leave-to {
  opacity: 0;
}
</style>
