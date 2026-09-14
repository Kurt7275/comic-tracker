<template>
  <div class="auth-callback-loading">
    <h2>AUTHENTICATING WITH GOOGLE…</h2>
    <p>Please wait while we set up your session!</p>
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
.auth-callback-loading {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: var(--f-font-display, sans-serif);
  color: #111111;
  text-align: center;
}
</style>
