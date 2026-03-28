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
    path: '/movies/:id',
    name: 'MovieDetail',
    component: () => import('@/views/MovieDetail.vue')  
  },
  {
    path: '/search',
    name: 'SearchResult',
    component: () => import('../views/SearchResult.vue'),
},
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router