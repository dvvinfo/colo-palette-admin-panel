import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Notification {
  id: number
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'user' | 'system'
  read: boolean
  createdAt: Date
  actionUrl?: string
}

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([
    {
      id: 1,
      title: 'Новый пользователь зарегистрирован',
      message: 'Пользователь john_doe успешно зарегистрировался в системе',
      type: 'user',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5) // 5 минут назад
    },
    {
      id: 2,
      title: 'Система обновлена',
      message: 'Система успешно обновлена до версии 2.1.0. Все новые функции доступны.',
      type: 'system',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 минут назад
    },
    {
      id: 3,
      title: 'Критическая ошибка исправлена',
      message: 'Исправлена критическая ошибка в модуле платежей',
      type: 'error',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 часа назад
    },
    {
      id: 4,
      title: 'Резервное копирование завершено',
      message: 'Автоматическое резервное копирование базы данных завершено успешно',
      type: 'success',
      read: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6) // 6 часов назад
    },
    {
      id: 5,
      title: 'Предупреждение о месте на диске',
      message: 'Свободное место на диске составляет менее 15%. Рекомендуется очистка.',
      type: 'warning',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12) // 12 часов назад
    },
    {
      id: 6,
      title: 'Новая транзакция требует подтверждения',
      message: 'Пользователь alice_smith запросил вывод средств на сумму 5000₽',
      type: 'warning',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 минут назад
      actionUrl: '/transactions'
    },
    {
      id: 7,
      title: 'Достигнут лимит одновременных игроков',
      message: 'Количество одновременных игроков достигло 95% от максимального значения',
      type: 'info',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 45) // 45 минут назад
    }
  ])

  const unreadCount = computed(() =>
    notifications.value.filter(n => !n.read).length
  )

  const sortedNotifications = computed(() =>
    [...notifications.value].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  )

  function addNotification(notification: Omit<Notification, 'id' | 'createdAt'>) {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      createdAt: new Date()
    }
    notifications.value.unshift(newNotification)
  }

  function markAsRead(id: number) {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  function markAllAsRead() {
    notifications.value.forEach(notification => {
      notification.read = true
    })
  }

  function removeNotification(id: number) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  function clearAllNotifications() {
    notifications.value.splice(0)
  }

  // Симуляция получения новых уведомлений
  function simulateNewNotification() {
    const types: Notification['type'][] = ['info', 'success', 'warning', 'error', 'user', 'system']
    const randomType = types[Math.floor(Math.random() * types.length)]

    const messages = {
      info: 'Информационное сообщение о работе системы',
      success: 'Операция выполнена успешно',
      warning: 'Обратите внимание на этот момент',
      error: 'Произошла ошибка в системе',
      user: 'Новая активность пользователя',
      system: 'Системное уведомление'
    }

    addNotification({
      title: `Новое ${randomType} уведомление`,
      message: messages[randomType],
      type: randomType,
      read: false
    })
  }

  return {
    notifications: sortedNotifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    simulateNewNotification
  }
})
