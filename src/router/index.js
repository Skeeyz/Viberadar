import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '@/layouts/MainLayout.vue'
import Home from '../views/Home.vue'
import MovieDetail from '../views/MovieDetail.vue'
import FilterPanel from '@/components/FilterPanel.vue'


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
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
