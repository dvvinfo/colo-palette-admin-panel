import { ref } from 'vue'

export interface Notification {
  id: string
  title: string
  message?: string
  type: 'success' | 'error' | 'info'
  duration?: number
}

const notifications = ref<Notification[]>([])

export function useNotifications() {
  function addNotification(notification: Omit<Notification, 'id'>) {
    const id = Date.now().toString()
    notifications.value.push({
      ...notification,
      id
    })
  }

  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  function showSuccess(title: string, message?: string, duration = 4000) {
    addNotification({
      title,
      message,
      type: 'success',
      duration
    })
  }

  function showError(title: string, message?: string, duration = 6000) {
    addNotification({
      title,
      message,
      type: 'error',
      duration
    })
  }

  function showInfo(title: string, message?: string, duration = 4000) {
    addNotification({
      title,
      message,
      type: 'info',
      duration
    })
  }

  function clearAll() {
    notifications.value = []
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
    clearAll
  }
}
