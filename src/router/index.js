import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import MovieList from '../views/MovieList.vue'

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
    name: 'MovieDetail',
    component: () => import('@/views/MovieDetail.vue')  
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router