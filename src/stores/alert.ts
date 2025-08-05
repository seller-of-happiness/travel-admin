// src/stores/alert.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Alert = {
  id: number
  message: string
  type: 'success' | 'error'
}

export const useAlertStore = defineStore('alert', () => {
  const alerts = ref<Alert[]>([])
  let nextId = 1

  const addAlert = (message: string, type: 'success' | 'error') => {
    const id = nextId++
    alerts.value.push({ id, message, type })
    // автоматически удаляем через 5 секунд
    setTimeout(() => removeAlert(id), 5000)
  }

  const removeAlert = (id: number) => {
    alerts.value = alerts.value.filter((a) => a.id !== id)
  }

  return { alerts, addAlert, removeAlert }
})
