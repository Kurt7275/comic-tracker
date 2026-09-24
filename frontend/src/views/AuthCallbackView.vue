<template>
  <div class="app-loader">
    <div class="app-loader-bg"></div>
    <div class="app-loader-content">
      <div class="app-loader-logo">COMIC<span>VERSE</span></div>
      <div class="app-loader-dots">
        <span></span><span></span><span></span>
      </div>
      <div class="app-loader-tagline">Loading your universe...</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { comicStore } from '../stores/useComicStore.js'
import { authService } from '../services/authService.js'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const token = route.query.token
  const name = route.query.name || 'Comic Fan'
  const email = route.query.email || ''

  if (token) {
    localStorage.setItem('auth_token', token)
    const user = await authService.fetchCurrentUser()
    comicStore.login(user)
  } else {
    comicStore.login({ name, email, isLoggedIn: true })
  }
  router.push('/shelf')
})
</script>

<style scoped>
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
