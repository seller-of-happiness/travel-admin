// Типы, которые приходят из API
export interface PointAPI {
  id: string
  lat: number
  lng: number
  name?: string
  description?: string
  photos: Photo[]
}

export interface RouteAPI {
  id: string
  title: string
  description?: string
  cover: Photo | null
  points: PointAPI[]
}

// Внутренние типы стора
export interface Photo {
  id: string
  originalUrl?: string
  webpUrl?: string
  previewUrl?: string
}

export interface Point {
  id: string
  lat: number
  lng: number
  name?: string
  description?: string
  photos: Photo[]
}

export interface Route {
  id: string
  title: string
  description?: string
  cover: Photo | null
  points: Point[]
}

// Вспомогательный для tempPoint
export interface LatLng {
  lat: number
  lng: number
}
