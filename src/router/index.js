import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import MovieList from '../views/MovieList.vue'
import MovieDetail from '../views/MovieDetail.vue'

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/movie/:id',
    name: 'MovieDetail',
    component: () => import('@/views/MovieDetail.vue')
  },
  {
    path: '/movie/:id',
    component: MovieDetail
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router