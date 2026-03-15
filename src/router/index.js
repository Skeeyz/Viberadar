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
    path: '/movies',
    component: MovieList
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