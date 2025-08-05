<template>
  <nav class="breadcrumbs text-sm">
    <ul>
      <li v-for="(crumb, idx) in items" :key="idx">
        <RouterLink
          v-if="idx < items.length - 1"
          :to="crumb.path"
          class="hover:underline"
        >
          {{ crumb.meta?.title || crumb.name }}
        </RouterLink>
        <span v-else>
          {{ crumb.meta?.title || crumb.name }}
        </span>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface Crumb {
  path: string
  name?: string
  meta?: Record<string, any>
}

const route = useRoute()

const items = computed<Crumb[]>(() => {
  // 1) Начинаем с базового «Маршруты»
  const crumbs: Crumb[] = [
    { path: '/admin', name: 'Admin', meta: { title: 'Маршруты' } },
  ]

  // 2) Добавляем все совпавшие маршруты
  route.matched.forEach((r) => {
    let path = r.path
    // Подставляем реальные параметры вместо :id и т. п.
    Object.entries(route.params).forEach(([key, val]) => {
      path = path.replace(`:${key}`, String(val))
    })
    crumbs.push({
      path: path === '' ? '/' : path,
      name: r.name as string,
      meta: r.meta as Record<string, any>,
    })
  })

  // 3) Возвращаем готовый массив
  return crumbs
})
</script>

<style scoped>
/* по желанию можно переопределить стили */
</style>
