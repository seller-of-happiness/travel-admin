import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Route } from './types'
import { useApi } from '@/api/useApiTS'

export const useRoutesStore = defineStore('routesList', () => {
  const routes = ref<Route[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchRoutes = async () => {
    loading.value = true
    error.value = null
    try {
      const { data } = await useApi<Route[]>('/api/routes')
      if (data.value) {
        routes.value = data.value.map((route) => ({
          ...route,
          cover: !route.cover
            ? null
            : typeof route.cover === 'string'
            ? JSON.parse(route.cover)
            : route.cover,
          points: (route.points ?? []).map((p) => ({
            ...p,
            photos: Array.isArray(p.photos)
              ? p.photos.map((ph) =>
                  typeof ph === 'string' ? JSON.parse(ph) : ph
                )
              : [],
          })),
        }))
      } else {
        routes.value = []
      }
    } catch (err: any) {
      error.value = err instanceof Error ? err : new Error(String(err))
    } finally {
      loading.value = false
    }
  }

  const deleteRoute = async (id: string) => {
    try {
      await useApi<void>(`/api/routes/${id}`, { method: 'DELETE' })
      // после успешного удаления — перезагружаем список
      await fetchRoutes()
    } catch (err) {
      console.error('deleteRoute error', err)
    }
  }

  return {
    routes,
    loading,
    error,
    fetchRoutes,
    deleteRoute,
  }
})
