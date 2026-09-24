import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/base.css'
import './assets/auth.css'
import LandingView from './views/LandingView.vue'
import LoginView from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'

// Lazy-loaded route views
const ShelfView        = () => import('./views/ShelfView.vue')
const DiscoverView     = () => import('./views/DiscoverView.vue')
const FeedView         = () => import('./views/FeedView.vue')
const TimelinesView    = () => import('./views/TimelinesView.vue')
const WatchlistView    = () => import('./views/WatchlistView.vue')
const StatsView        = () => import('./views/StatsView.vue')
const AchievementsView = () => import('./views/AchievementsView.vue')
const ProfileView      = () => import('./views/ProfileView.vue')
const AuthCallbackView = () => import('./views/AuthCallbackView.vue')
const MilesRoomView    = () => import('./views/MilesRoomView.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',             name: 'MilesRoom',    component: MilesRoomView, alias: ['/room', '/portal'] },
    { path: '/landing',      name: 'Landing',      component: LandingView },
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
