<template>
  <div class="miles-room-view">
    <!-- Interactive Bedroom Portal -->
    <MilesRoomPortal @enter-app="handleEnterApp" />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import MilesRoomPortal from '../components/portal/MilesRoomPortal.vue'
import { useAuthStore } from '../stores/useAuthStore.js'

const router = useRouter()

onMounted(() => {
  document.documentElement.style.overflow = 'hidden'
  document.documentElement.style.overflowY = 'hidden'
  document.documentElement.style.scrollbarGutter = 'auto'
  document.body.style.overflow = 'hidden'
  document.body.style.overflowY = 'hidden'
})

onBeforeUnmount(() => {
  document.documentElement.style.overflow = ''
  document.documentElement.style.overflowY = ''
  document.documentElement.style.scrollbarGutter = ''
  document.body.style.overflow = ''
  document.body.style.overflowY = ''
})

function handleEnterApp() {
  if (useAuthStore.user.isLoggedIn) {
    router.push('/shelf')
    return
  }

  // Mark this navigation so LandingView can play the monitor-only scale transition.
  router.push({ path: '/landing', query: { from: 'monitor' } })
}
</script>

<style scoped>
.miles-room-view {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #08090d;
  z-index: 50;
}
</style>
