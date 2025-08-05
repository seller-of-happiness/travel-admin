// src/stores/routes/index.ts

import { defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'
import router from '@/router'
import type { Point, Route, Photo, LatLng, RouteAPI, PointAPI } from './types'
import { useApi } from '@/api/useApiTS'
import { uploadPhoto } from '@/utils/uploadPhoto'

export const useRouteStore = defineStore('route', () => {
  const apiBase = import.meta.env.VITE_API_URL

  const id = ref<string | null>(null)
  const title = ref('')
  const description = ref('')
  const points = ref<Point[]>([])
  const tempPoint = ref<LatLng | null>(null)
  const coverImage = ref<Photo | null>(null)

  // Восстановление текстового черновика из localStorage
  const textDraftRaw = localStorage.getItem('routeDraftText')
  if (textDraftRaw) {
    try {
      const textDraft = JSON.parse(textDraftRaw)
      title.value = textDraft.title || ''
      description.value = textDraft.description || ''
      points.value = (textDraft.points || []).map((p: any) => ({
        id: '',
        lat: p.lat,
        lng: p.lng,
        name: p.name,
        description: p.description,
        photos: [],
      }))
    } catch (e) {
      // ignore parse error
    }
  }

  // Автосохранение текстовых данных маршрута (без картинок) в localStorage
  watchEffect(() => {
    const draft = {
      title: title.value,
      description: description.value,
      points: points.value.map((p) => ({
        lat: p.lat,
        lng: p.lng,
        name: p.name,
        description: p.description,
      })),
    }
    localStorage.setItem('routeDraftText', JSON.stringify(draft))
  })

  const setTempPoint = (pt: LatLng | null) => {
    tempPoint.value = pt
  }

  const updatePointCoords = (idx: number, lat: number, lng: number) => {
    const arr = points.value
    if (arr[idx]) {
      arr[idx].lat = lat
      arr[idx].lng = lng
    }
  }

  const addPoint = (pt: LatLng) => {
    points.value.push({
      id: '',
      lat: pt.lat,
      lng: pt.lng,
      name: '',
      description: '',
      photos: [],
    })
    tempPoint.value = null
  }

  const reorderPoints = (newList: Point[]) => {
    if (Array.isArray(newList)) {
      points.value = newList.slice()
    }
  }

  const removePoint = (idx: number) => {
    points.value.splice(idx, 1)
  }

  const addPhotosToPoint = async (idx: number, files: FileList) => {
    const arr = points.value[idx].photos
    for (let i = 0; i < files.length; i++) {
      const ph = await uploadPhoto(files[i])
      arr.push(ph)
    }
  }

  const removePhoto = (ptIdx: number, phIdx: number) => {
    points.value[ptIdx].photos.splice(phIdx, 1)
  }

  const setCoverImageFn = async (files: FileList) => {
    if (!files.length) return
    const ph = await uploadPhoto(files[0])
    coverImage.value = ph
  }

  const removeCoverImage = () => {
    coverImage.value = null
  }

  /** Сбрасывает все поля стора в начальное состояние */
  const clear = () => {
    id.value = null
    title.value = ''
    description.value = ''
    points.value = []
    tempPoint.value = null
    coverImage.value = null
  }

  /**
   * Создаёт или обновляет маршрут,
   * затем сбрасывает стор и переводит на /admin
   */
  const saveRoute = async (): Promise<Route> => {
    // 1) Формируем DTO под API
    const apiDto: Omit<RouteAPI, 'id'> = {
      title: title.value,
      description: description.value,
      cover: coverImage.value,
      points: points.value.map((p) => ({
        id: '',
        lat: p.lat,
        lng: p.lng,
        name: p.name,
        description: p.description,
        photos: (p.photos ?? []).map((ph) =>
          typeof ph === 'object'
            ? (ph as Photo)
            : { id: '', originalUrl: ph, webpUrl: ph, previewUrl: ph }
        ),
      })),
    }

    // 2) Выбираем метод и путь
    const method = id.value ? 'PATCH' : 'POST'
    const path = id.value ? `/api/routes/${id.value}` : '/api/routes'

    // 3) Делаем запрос
    const { data, error } = await useApi<RouteAPI>(
      path,
      { method, body: JSON.stringify(apiDto) },
      true,
      id.value ? 'Маршрут обновлён' : 'Маршрут создан'
    )
    if (error.value) throw error.value
    const apiRoute = data.value!

    // 4) Преобразуем API-модель в локальную и записываем в стор
    id.value = apiRoute.id
    title.value = apiRoute.title
    description.value = apiRoute.description ?? ''
    points.value = apiRoute.points.map<Point>((p: PointAPI) => ({
      id: p.id,
      lat: p.lat,
      lng: p.lng,
      name: p.name,
      description: p.description ?? '',
      photos: (p.photos ?? []).map((ph) =>
        typeof ph === 'object'
          ? (ph as Photo)
          : { id: '', originalUrl: ph, webpUrl: ph, previewUrl: ph }
      ),
    }))
    coverImage.value = !apiRoute.cover
      ? null
      : typeof apiRoute.cover === 'string'
      ? JSON.parse(apiRoute.cover) // <-- вот оно!
      : apiRoute.cover

    // 5) Сбрасываем поля и переходим на /admin
    clear()
    localStorage.removeItem('routeDraftText')
    router.push('/admin')

    // 6) Возвращаем локальную модель
    return {
      id: apiRoute.id,
      title: apiRoute.title,
      description: apiRoute.description,
      cover: coverImage.value,
      points: points.value,
    }
  }

  /** Загружает маршрут по ID и заполняет стор */
  const fetchRouteById = async (routeId: string) => {
    const { data, error } = await useApi<RouteAPI>(`/api/routes/${routeId}`)
    if (error.value) throw error.value
    const apiRoute = data.value!

    id.value = apiRoute.id
    title.value = apiRoute.title
    description.value = apiRoute.description ?? ''
    points.value = apiRoute.points.map<Point>((p: PointAPI) => ({
      id: p.id,
      lat: p.lat,
      lng: p.lng,
      name: p.name,
      description: p.description ?? '',
      photos: (p.photos ?? []).map((ph) =>
        typeof ph === 'object'
          ? (ph as Photo)
          : { id: '', originalUrl: ph, webpUrl: ph, previewUrl: ph }
      ),
    }))
    coverImage.value = !apiRoute.cover
      ? null
      : typeof apiRoute.cover === 'string'
      ? JSON.parse(apiRoute.cover) // <-- вот оно!
      : apiRoute.cover
  }

  return {
    id,
    title,
    description,
    points,
    tempPoint,
    coverImage,
    setTempPoint,
    updatePointCoords,
    addPoint,
    reorderPoints,
    removePoint,
    addPhotosToPoint,
    removePhoto,
    setCoverImage: setCoverImageFn,
    removeCoverImage,
    saveRoute,
    fetchRouteById,
    clear,
  }
})
