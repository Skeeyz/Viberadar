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
        path: 'search',
        component: SearchResult
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
