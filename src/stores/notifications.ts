import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { notificationsApi } from '@/services/api'
import type { UserNotification, NotificationCreateRequest } from '@/types'

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<UserNotification[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Серверный счетчик непрочитанных уведомлений
  const serverUnreadCount = ref<number | null>(null)
  const countLoading = ref(false)

  // Используем серверный счетчик, если доступен, иначе локальный
  const unreadCount = computed(() => {
    if (serverUnreadCount.value !== null) {
      return serverUnreadCount.value
    }
    return notifications.value.filter(n => !n.is_read).length
  })

  const sortedNotifications = computed(() =>
    [...notifications.value].sort((a, b) =>
      new Date(b.notification.created_at).getTime() - new Date(a.notification.created_at).getTime()
    )
  )

  // Загрузка счетчика непрочитанных уведомлений с сервера
  async function fetchUnreadCount() {
    try {
      countLoading.value = true
      const response = await notificationsApi.getCount('unread')
      serverUnreadCount.value = response.data
      return response.data
    } catch (err: unknown) {
      console.error('Error fetching unread count:', err)
      // В случае ошибки используем локальный подсчет
      serverUnreadCount.value = null
    } finally {
      countLoading.value = false
    }
  }

  // Загрузка всех уведомлений
  async function fetchNotifications() {
    try {
      loading.value = true
      error.value = null
      const response = await notificationsApi.getAll()
      notifications.value = response.data

      // Также обновляем счетчик с сервера
      await fetchUnreadCount()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при загрузке уведомлений'
      error.value = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || errorMessage
      console.error('Error fetching notifications:', err)
    } finally {
      loading.value = false
    }
  }

  // Создание нового уведомления
  async function createNotification(data: NotificationCreateRequest) {
    try {
      loading.value = true
      error.value = null
      await notificationsApi.create(data)
      // Перезагружаем уведомления после создания
      await fetchNotifications()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при создании уведомления'
      error.value = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || errorMessage
      console.error('Error creating notification:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Изменение статуса уведомления
  async function toggleNotificationStatus(id: number) {
    try {
      error.value = null
      await notificationsApi.toggleStatus(id)

      // Обновляем локальное состояние
      const notification = notifications.value.find(n => n.id === id)
      if (notification) {
        const wasUnread = !notification.is_read
        notification.is_read = !notification.is_read
        notification.read_at = notification.is_read ? new Date().toISOString() : null

        // Обновляем серверный счетчик
        if (serverUnreadCount.value !== null) {
          if (wasUnread && notification.is_read) {
            serverUnreadCount.value = Math.max(0, serverUnreadCount.value - 1)
          } else if (!wasUnread && !notification.is_read) {
            serverUnreadCount.value += 1
          }
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при изменении статуса уведомления'
      error.value = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || errorMessage
      console.error('Error toggling notification status:', err)
      throw err
    }
  }

  // Отметить все уведомления как прочитанные
  async function markAllAsRead() {
    try {
      error.value = null
      await notificationsApi.markAllAsRead()

      // Обновляем локальное состояние
      notifications.value.forEach(notification => {
        notification.is_read = true
        notification.read_at = new Date().toISOString()
      })

      // Обнуляем серверный счетчик
      serverUnreadCount.value = 0
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при изменении статуса уведомлений'
      error.value = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || errorMessage
      console.error('Error marking all notifications as read:', err)
      throw err
    }
  }

  // Удаление уведомления
  async function deleteNotification(id: number) {
    try {
      error.value = null

      // Проверяем, было ли уведомление непрочитанным перед удалением
      const notification = notifications.value.find(n => n.id === id)
      const wasUnread = notification ? !notification.is_read : false

      await notificationsApi.delete(id)

      // Удаляем из локального состояния
      const index = notifications.value.findIndex(n => n.id === id)
      if (index > -1) {
        notifications.value.splice(index, 1)
      }

      // Обновляем серверный счетчик, если удаленное уведомление было непрочитанным
      if (wasUnread && serverUnreadCount.value !== null) {
        serverUnreadCount.value = Math.max(0, serverUnreadCount.value - 1)
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при удалении уведомления'
      error.value = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || errorMessage
      console.error('Error deleting notification:', err)
      throw err
    }
  }

  // Удаление всех уведомлений
  async function deleteAllNotifications() {
    try {
      error.value = null
      await notificationsApi.deleteAll()

      // Очищаем локальное состояние
      notifications.value.splice(0)

      // Обнуляем серверный счетчик
      serverUnreadCount.value = 0
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при удалении уведомлений'
      error.value = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || errorMessage
      console.error('Error deleting all notifications:', err)
      throw err
    }
  }

  // Получение количества уведомлений
  async function getNotificationCount(status?: 'read' | 'unread') {
    try {
      error.value = null
      const response = await notificationsApi.getCount(status)

      // Если запрашиваем количество непрочитанных, обновляем кэш
      if (status === 'unread' || !status) {
        serverUnreadCount.value = response.data
      }

      return response.data
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при получении количества уведомлений'
      error.value = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || errorMessage
      console.error('Error getting notification count:', err)
      throw err
    }
  }

  // Устаревшие методы для обратной совместимости
  function markAsRead(id: number) {
    return toggleNotificationStatus(id)
  }

  function removeNotification(id: number) {
    return deleteNotification(id)
  }

  function clearAllNotifications() {
    return deleteAllNotifications()
  }

  function addNotification(notification: NotificationCreateRequest) {
    return createNotification(notification)
  }

  return {
    // Состояние
    notifications: sortedNotifications,
    loading,
    error,
    unreadCount,
    countLoading,

    // Основные методы для работы с API
    fetchNotifications,
    fetchUnreadCount,
    createNotification,
    toggleNotificationStatus,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    getNotificationCount,

    // Устаревшие методы для обратной совместимости
    markAsRead,
    removeNotification,
    clearAllNotifications,
    addNotification,
  }
})
