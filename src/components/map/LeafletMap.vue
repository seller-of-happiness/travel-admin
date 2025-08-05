<template>
  <div class="relative h-full w-full">
    <div ref="mapRef" class="h-screen w-full" style="min-height: 400px"></div>

    <div
      class="card w-44 bg-base-100 card-xs shadow-sm absolute bottom-4 left-3 z-[9999]"
      v-if="routeStore.tempPoint"
    >
      <div class="card-body">
        <h2 class="card-title">Координаты:</h2>
        <p>
          Ш: {{ routeStore.tempPoint.lat.toFixed(5) }}, Д:
          {{ routeStore.tempPoint.lng.toFixed(5) }}
        </p>
        <div class="justify-end card-actions">
          <button class="btn btn-primary w-full" @click="addTempPoint">
            Добавить точку
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="routeSummary"
      class="absolute top-3 left-14 bg-white p-2 rounded shadow z-[9999] text-black"
    >
      <div>
        Длина маршрута: {{ (routeSummary.distance / 1000).toFixed(2) }} км
      </div>
      <div>Время в пути: {{ Math.round(routeSummary.time / 60) }} мин</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouteStore } from '@/stores/routes'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import 'leaflet-routing-machine'

const routeStore = useRouteStore()
const mapRef = ref<HTMLDivElement | null>(null)
let map!: L.Map

let markers: L.Marker[] = []
let routingControl: any = null
const routeSummary = ref<{ distance: number; time: number } | null>(null)

// Добавление точки из tempPoint
const addTempPoint = () => {
  if (routeStore.tempPoint) {
    routeStore.addPoint(routeStore.tempPoint)
    routeStore.setTempPoint(null)
  }
}

// Построение маркеров и маршрута
const updateMarkersAndRoute = () => {
  markers.forEach((m) => m.remove())
  markers = []

  // маркеры с кастомной иконкой и цифрой
  routeStore.points.forEach((pt, idx) => {
    const icon = L.divIcon({
      className: 'marker',
      html: `<span class="marker__label"><span>${idx + 1}</span></span>`,
    })
    const marker = L.marker([pt.lat, pt.lng], { draggable: true, icon }).addTo(
      map
    )
    marker.on('dragend', (e) => {
      const ll = (e.target as any).getLatLng()
      routeStore.updatePointCoords(idx, ll.lat, ll.lng)
    })
    markers.push(marker)
  })

  // маршрут
  if (routingControl) {
    routingControl.remove()
    routingControl = null
  }
  if (routeStore.points.length > 1) {
    routingControl = (L as any).Routing.control({
      waypoints: routeStore.points.map((p) => L.latLng(p.lat, p.lng)),
      lineOptions: { styles: [{ color: 'blue', weight: 4 }] },
      createMarker: () => null,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      routeWhileDragging: false,
    }).addTo(map)
    routingControl.on('routesfound', (e: any) => {
      const s = e.routes[0].summary
      routeSummary.value = { distance: s.totalDistance, time: s.totalTime }
    })
  } else {
    routeSummary.value = null
  }
}

// пересчет при изменении точек
watch(
  () => routeStore.points.map((pt) => ({ lat: pt.lat, lng: pt.lng })),
  updateMarkersAndRoute,
  { deep: true }
)

onMounted(() => {
  // 1) Инициализируем карту с любыми нач.координатами
  map = L.map(mapRef.value!, {
    center: [55.76, 37.64],
    zoom: 10,
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }),
    ],
  })

  // 2) Пытаемся получить геопозицию браузера
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // если успех — центрируем на user
        map.setView([pos.coords.latitude, pos.coords.longitude], 13)
      },
      () => {
        // если отказ или ошибка — центрируем на Амстердам
        map.setView([52.370216, 4.895168], 12)
      },
      { enableHighAccuracy: true, timeout: 5000 }
    )
  } else {
    // если API не поддерживается — тоже Амстердам
    map.setView([52.370216, 4.895168], 12)
  }

  // клик по карте для tempPoint
  map.on('click', (e: L.LeafletMouseEvent) => {
    routeStore.setTempPoint({ lat: e.latlng.lat, lng: e.latlng.lng })
  })

  // первый рендер маркеров/маршрута
  updateMarkersAndRoute()
})
</script>

<style lang="scss">
.marker {
  &__label {
    width: 36px;
    height: 36px;
    background-color: #605dff;
    border-radius: 60px 60px 0 60px;
    transform: rotate(45deg);
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      transform: rotate(-45deg);
      font-weight: bold;
      font-size: 14px;
    }
  }
}
</style>
