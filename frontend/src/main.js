import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/base.css'
import './assets/auth.css'

// Lazy-loaded route views
const LandingView      = () => import('./views/LandingView.vue')
const LoginView        = () => import('./views/LoginView.vue')
const RegisterView     = () => import('./views/RegisterView.vue')
const ShelfView        = () => import('./views/ShelfView.vue')
const DiscoverView     = () => import('./views/DiscoverView.vue')
const FeedView         = () => import('./views/FeedView.vue')
const TimelinesView    = () => import('./views/TimelinesView.vue')
const WatchlistView    = () => import('./views/WatchlistView.vue')
const StatsView        = () => import('./views/StatsView.vue')
const AchievementsView = () => import('./views/AchievementsView.vue')
const ProfileView      = () => import('./views/ProfileView.vue')
const AuthCallbackView = () => import('./views/AuthCallbackView.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',             name: 'Landing',      component: LandingView },
    { path: '/login',        name: 'Login',        component: LoginView },
    { path: '/register',     name: 'Register',     component: LoginView },
    { path: '/auth/callback',name: 'AuthCallback', component: AuthCallbackView },
    { path: '/shelf',        name: 'Shelf',        component: ShelfView },
    { path: '/discover',     name: 'Discover',     component: DiscoverView },
    { path: '/feed',         name: 'Feed',         component: FeedView },
    { path: '/timelines',    name: 'Timelines',    component: TimelinesView },
    { path: '/watchlist',    name: 'Watchlist',    component: WatchlistView },
    { path: '/stats',        name: 'Stats',        component: StatsView },
    { path: '/achievements', name: 'Achievements', component: AchievementsView },
    { path: '/profile',      name: 'Profile',      component: ProfileView },
  ],
})

const app = createApp(App)
app.use(router)
app.mount('#app')
