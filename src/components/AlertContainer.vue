<!-- src/components/AlertContainer.vue -->
<template>
  <div class="fixed top-4 right-4 space-y-2 z-[9999]">
    <div v-for="alert in alertStore.alerts" :key="alert.id">
      <div
        :class="[
          'alert shadow-lg',
          alert.type === 'success' ? 'alert-success' : 'alert-error',
        ]"
      >
        <div>
          <span>{{ alert.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAlertStore } from '@/stores/alert'
const alertStore = useAlertStore()
</script>
