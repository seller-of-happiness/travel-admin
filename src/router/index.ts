import { createRouter, createWebHistory } from 'vue-router'
import AdminRoutes from '@/pages/AdminRoutes.vue'
import AdminRouteCreate from '@/pages/AdminRouteCreate.vue'

const routes = [
  { path: '/', redirect: '/admin' },
  { path: '/admin', component: AdminRoutes, meta: { title: 'Маршруты' } },
  {
    path: '/admin/create',
    component: AdminRouteCreate,
    meta: { title: 'Создать маршрут' },
  },
  {
    path: '/admin/:id',
    component: AdminRouteCreate,
    props: true,
    meta: { title: 'Редактировать маршрут' },
  },
]

export default createRouter({ history: createWebHistory(), routes })
