import { createRouter, createWebHistory } from 'vue-router'

import SearchResult from '@/components/SearchResult.vue'
import FilterPanel from '@/components/FilterPanel.vue'
import MainLayout from '@/layouts/MainLayout.vue'
// import Home from '../views/HomePage.vue'
import MovieDetail from '../views/MovieDetail.vue'
import Home from '../views/Home.vue'
import MovieList from '../views/MovieList.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        component: Home
      },
      {
        path: 'filter',
        component: FilterPanel
      },
      {
        path: 'movies/:id',
        component: MovieDetail
      },
      {
        path: 'favorites',
        component: () => import('@/views/FavoriteView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'watchlist',
        component: () => import('@/views/WatchListView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'profile',
        component: () => import('@/views/ProfileView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'search',
        component: SearchResult
      },
      {
        path: 'movies',
        component: MovieList
      },
      {
        path: 'movies/:id',
        name: 'MovieDetail',
        component: () => import('@/views/MovieDetail.vue')  
      },
      {
        path: 'search',
        name: 'SearchResult',
        component: () => import('../views/SearchResult.vue'),
      },
      {
        path: '/view-all/:section',
        name: 'ViewAll',
        component: () => import('../views/ViewAll.vue'),
      },
    ],
  },
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'signin',
        name: 'SignIn',
        component: () => import('@/views/auth/SignInView.vue')
      },
      {
        path: 'signup',
        name: 'SignUp',
        component: () => import('@/views/auth/SignUpView.vue')
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: () => import('@/views/auth/ForgotPasswordView.vue')
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from) => {
  const token = localStorage.getItem('token');
  
  if (to.meta.requiresAuth && !token) {
    return '/auth/signin';
  }

  if (to.path.startsWith('/auth') && token) {
    return '/';
  }

  return true;
});

export default router