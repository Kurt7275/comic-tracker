<template>
  <div>
    <!-- Pop-Art Loading Screen -->
    <transition name="loader-fade">
      <div v-if="loading" class="app-loader">
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

    <!-- Main App -->
    <router-view v-slot="{ Component, route }">
      <transition :name="getRouteTransition(route)">
        <component :is="Component" :key="route.fullPath" />
      </transition>
    </router-view>

    <!-- Global Pop-Art Add Modal -->
    <AddModal />

    <!-- Global Profile Modal -->
    <ProfileModal />

    <!-- Global Pop-Art Logout Overlay -->
    <LogoutOverlay />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AddModal from './components/AddModal.vue'
import ProfileModal from './components/ProfileModal.vue'
import LogoutOverlay from './components/LogoutOverlay.vue'

const route = useRoute()
const loading = ref(false)
const dashboardRouteNames = new Set([
  'Shelf',
  'Watchlist',
  'Discover',
  'Feed',
  'Timelines',
  'Achievements',
  'Stats',
  'Profile',
])

function getRouteTransition(routeLocation) {
  if (routeLocation.name === 'MilesRoom') return 'room-route'
  if (routeLocation.query.from === 'monitor') return 'monitor-route'
  if (dashboardRouteNames.has(routeLocation.name)) return 'dashboard-route'
  if (
    (routeLocation.name === 'Login' || routeLocation.name === 'Register') &&
    routeLocation.query.transition === 'signin'
  ) {
    return 'login-fade'
  }
  return 'page-fade'
}

// Manage scrollbars per route: hide completely in Miles Room, restore in regular pages
watch(
  () => route.path,
  (path) => {
    const isRoomRoute = path === '/' || path === '/room' || path === '/portal'
    document.documentElement.classList.toggle('is-room-route', isRoomRoute)

    if (isRoomRoute) {
      document.documentElement.style.overflow = 'hidden'
      document.documentElement.style.overflowY = 'hidden'
      document.documentElement.style.scrollbarGutter = 'auto'
      document.body.style.overflow = 'hidden'
      document.body.style.overflowY = 'hidden'
    } else {
      document.documentElement.style.overflow = ''
      document.documentElement.style.overflowY = ''
      document.documentElement.style.scrollbarGutter = ''
      document.body.style.overflow = ''
      document.body.style.overflowY = ''
    }
  },
  { immediate: true }
)
</script>

<style>
/* ── Category Page Pop-Up Animation ── */
.category-pop-enter-active {
  animation: categoryPopUp 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.category-pop-leave-active {
  transition: opacity 0.15s ease-out, transform 0.15s ease-out;
}

.category-pop-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(12px);
}

@keyframes categoryPopUp {
  0% {
    opacity: 0;
    transform: scale(0.93) translateY(24px);
  }
  65% {
    opacity: 1;
    transform: scale(1.018) translateY(-4px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
/* ── Reference-style page transition ── */
.page-fade-enter-active {
  transition: opacity 500ms ease, transform 500ms ease;
}

.page-fade-leave-active {
  position: absolute;
  inset: 0;
  width: 100%;
  max-height: 100vh;
  overflow: hidden;
  pointer-events: none;
  opacity: 0;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(24px);
}

.room-route-enter-active,
.room-route-leave-active,
.dashboard-route-enter-active,
.dashboard-route-leave-active {
  transition: none;
}

.login-fade-enter-active,
.login-fade-leave-active {
  transition:
    opacity 300ms cubic-bezier(0.4, 0, 0.2, 1),
    transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.login-fade-enter-active {
  position: relative;
  z-index: 1;
}

.login-fade-leave-active {
  position: fixed;
  inset: 0;
  z-index: 2;
  width: 100%;
  max-height: 100vh;
  overflow: hidden;
  pointer-events: none;
}

.login-fade-enter-from {
  opacity: 0;
  transform: translateY(24px) scale(0.99);
}

.login-fade-leave-to {
  opacity: 0;
  transform: translateY(-18px) scale(0.985);
}

/* ── Loader Fade Out ── */
.loader-fade-leave-active {
  transition: opacity 0.6s ease;
}
.loader-fade-leave-to {
  opacity: 0;
}

/* ── Loading Screen ── */
.app-loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FAF4E8;
  overflow: hidden;
}

/* Same dot pattern as landing page */
.app-loader-bg {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(0,0,0,0.08) 1.2px, transparent 1.2px);
  background-size: 13px 13px;
}

.app-loader-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.app-loader-logo {
  font-family: 'Bangers', cursive;
  font-size: clamp(3.5rem, 10vw, 6rem);
  letter-spacing: 0.08em;
  color: #F5D13B;
  -webkit-text-stroke: 3px #111111;
  text-shadow: 5px 5px 0px #8B3A1C;
  line-height: 1;
}

.app-loader-logo span {
  color: #FFFFFF;
  -webkit-text-stroke: 3px #111111;
}

/* Bouncing dots */
.app-loader-dots {
  display: flex;
  gap: 0.6rem;
}

.app-loader-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #F5D13B;
  border: 2px solid #111111;
  animation: loader-bounce 0.7s ease-in-out infinite;
}

.app-loader-dots span:nth-child(2) { animation-delay: 0.15s; background: #EE3545; }
.app-loader-dots span:nth-child(3) { animation-delay: 0.30s; background: #44C555; }

@keyframes loader-bounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-10px); }
}

.app-loader-tagline {
  font-family: 'Bangers', cursive;
  font-size: 1.1rem;
  letter-spacing: 0.12em;
  color: rgba(17,17,17,0.45);
}
</style>
