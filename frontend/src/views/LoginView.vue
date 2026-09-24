<template>
  <div class="cs-standalone-login-page">

    <!-- ── Top-Left Back Button ── -->
    <router-link
      to="/landing"
      :class="['cs-login-back-btn', { 'login-content-enter': shouldAnimateSignIn }]"
      title="Back to Landing Page"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
    </router-link>

    <!-- ── Center Exact Login Card ── -->
    <div :class="['cs-standalone-center-wrap', { 'login-content-enter': shouldAnimateSignIn }]">
      <div class="f-exact-login-card">

        <!-- Red Header Banner -->
        <div class="f-exact-card-header">
          <div class="f-exact-header-title">COMICVERSE</div>
          <div class="f-exact-header-subtitle">YOUR ULTIMATE READING TRACKER!</div>
        </div>

        <!-- White Card Body -->
        <div class="f-exact-card-body">
          <h3 class="f-exact-body-headline">SIGN IN TO CONTINUE!</h3>
          <p class="f-exact-body-subtext">Track your manga, manhwa, webtoons &amp; more!</p>

          <!-- Yellow Google Sign-In Button -->
          <button
            type="button"
            id="btn-google-signin"
            class="f-exact-google-btn"
            :disabled="isLoading"
            @click="handleGoogleSignIn"
          >
            <div class="f-google-icon-circle">
              <!-- Google Colored 'G' SVG Logo -->
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <span>{{ isLoading ? 'SIGNING IN…' : 'SIGN IN WITH GOOGLE!' }}</span>
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { authService } from '../services/authService.js'
import '../assets/auth.css'

const route = useRoute()
const isLoading = ref(false)
const shouldAnimateSignIn = computed(() => route.query.transition === 'signin')

function handleGoogleSignIn() {
  isLoading.value = true
  // Redirect browser to Laravel Socialite Google OAuth endpoint
  window.location.href = authService.getGoogleRedirectUrl()
}
</script>

<style scoped>
.cs-standalone-login-page {
  min-height: 100vh;
  width: 100vw;
  background-color: var(--f-bg);
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.08) 1.2px, transparent 1.2px);
  background-size: 13px 13px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

/* Back button at top-left */
.cs-login-back-btn {
  position: absolute;
  top: 24px;
  left: 24px;
  width: 52px;
  height: 34px;
  background: #FFFFFF;
  border: 3px solid #111111;
  border-radius: 4px;
  box-shadow: 3px 3px 0px #111111;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111111;
  cursor: pointer;
  transition: transform 100ms ease, box-shadow 100ms ease, background 100ms ease;
  z-index: 50;
}

.cs-login-back-btn:hover {
  background: var(--f-yellow);
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0px #111111;
}

.cs-login-back-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px #111111;
}

.cs-standalone-center-wrap {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-content-enter {
  animation: loginReferenceEnter 420ms ease both;
  will-change: opacity, transform;
}

@keyframes loginReferenceEnter {
  from {
    opacity: 0;
    transform: translateY(24px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
