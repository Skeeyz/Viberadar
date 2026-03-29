import { createRouter, createWebHistory } from 'vue-router'

import SearchResult from '@/components/SearchResult.vue'
import FilterPanel from '@/components/FilterPanel.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import Home from '../views/HomePage.vue'
import MovieDetail from '../views/MovieDetail.vue'

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
        path: 'search',
        component: SearchResult
      }],
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  // Lấy token từ LocalStorage
  const token = localStorage.getItem('token');
  
  // Nếu vào trang yêu cầu đăng nhập (Home) mà chưa có token
  if (to.meta.requiresAuth && !token) {
    return next('/auth/signin');
  }

  // Nếu đã có token (đã đăng nhập) mà vẫn muốn vào trang Sign In/Sign Up
  if (to.path.startsWith('/auth') && token) {
    return next('/'); // Đẩy về Home
  }

  next(); // Cho đi tiếp bình thường
});

export default router
