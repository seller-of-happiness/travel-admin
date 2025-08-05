<template>
  <!-- flex-контейнер по вертикали и высотой в экран -->
  <div class="flex flex-col h-screen">
    <!-- Header фиксированной высоты 64px -->
    <Header class="flex-shrink-0 h-16" />

    <!-- Основной контент растягивается на всё, что осталось -->
    <main class="flex-1 overflow-hidden">
      <router-view />
    </main>
  </div>

  <AlertContainer />
</template>

<script setup lang="ts">
import Header from '@/layout/Header.vue'
import AlertContainer from '@/components/AlertContainer.vue'
</script>
