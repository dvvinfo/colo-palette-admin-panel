<template>
  <div class="relative" ref="notificationsRef">
    <!-- Кнопка колокольчика -->
    <button
      @click="toggleNotifications"
      class="relative p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
      :class="{ 'text-white bg-white/10': isOpen }"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>

      <!-- Индикатор непрочитанных уведомлений -->
      <span
        v-if="notificationsStore.unreadCount > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
      >
        {{ notificationsStore.unreadCount > 99 ? '99+' : notificationsStore.unreadCount }}
      </span>
    </button>

    <!-- Выпадающий список уведомлений -->
    <div
      v-if="isOpen"
      class="absolute right-0 top-full mt-2 w-80 bg-card-bg border border-white/10 rounded-xl shadow-lg z-50 max-h-96 overflow-hidden"
    >
      <!-- Заголовок -->
      <div class="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 class="text-white font-semibold">{{ $t('notifications.title') }}</h3>
        <div class="flex items-center gap-2">
          <button
            v-if="notificationsStore.unreadCount > 0"
            @click="notificationsStore.markAllAsRead"
            class="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            {{ $t('notifications.markAllRead') }}
          </button>
          <button
            @click="notificationsStore.simulateNewNotification"
            class="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            :title="$t('notifications.addTest')"
          >
            +
          </button>
        </div>
      </div>

      <!-- Список уведомлений -->
      <div class="max-h-64 overflow-y-auto custom-scrollbar">
        <div v-if="notificationsStore.notifications.length === 0" class="p-8 text-center">
          <div class="w-12 h-12 mx-auto mb-3 bg-gray-600/20 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
          </div>
          <p class="text-gray-400 text-sm">{{ $t('notifications.noNotifications') }}</p>
        </div>

        <div
          v-for="notification in notificationsStore.notifications"
          :key="notification.id"
          class="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
          :class="{ 'bg-primary/5 border-l-2 border-l-primary': !notification.read }"
          @click="handleNotificationClick(notification)"
        >
          <div class="flex items-start gap-3">
            <!-- Иконка типа уведомления -->
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              :class="getNotificationIconClass(notification.type)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="getNotificationIconPath(notification.type)"
                />
              </svg>
            </div>

            <div class="flex-1 min-w-0">
              <p class="text-white text-sm font-medium mb-1">{{ notification.title }}</p>
              <p class="text-gray-400 text-xs mb-2 ">{{ notification.message }}</p>
              <p class="text-gray-500 text-xs">{{ formatTime(notification.createdAt) }}</p>
            </div>

            <!-- Кнопки действий -->
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <!-- Индикатор непрочитанного -->
              <div
                v-if="!notification.read"
                class="w-2 h-2 bg-primary rounded-full flex-shrink-0"
              ></div>

              <!-- Кнопка удаления -->
              <button
                @click.stop="notificationsStore.removeNotification(notification.id)"
                class="p-1 text-gray-500 hover:text-red-400 transition-colors"
                :title="$t('notifications.delete')"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Футер -->
      <div class="p-3 border-t border-white/10 flex justify-between">
        <button
          v-if="notificationsStore.notifications.length > 0"
          @click="notificationsStore.clearAllNotifications"
          class="text-xs text-red-400 hover:text-red-300 transition-colors"
        >
          {{ $t('notifications.clearAll') }}
        </button>
        <button
          class="text-xs text-primary hover:text-primary/80 transition-colors ml-auto"
          @click="viewAllNotifications"
        >
          {{ $t('notifications.viewAll') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useNotificationsStore, type Notification } from '@/stores/notifications'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const isOpen = ref(false)
const notificationsRef = ref<HTMLElement>()
const notificationsStore = useNotificationsStore()
const router = useRouter()

function toggleNotifications() {
  isOpen.value = !isOpen.value
}

function handleNotificationClick(notification: Notification) {
  // Отмечаем как прочитанное
  if (!notification.read) {
    notificationsStore.markAsRead(notification.id)
  }

  // Если есть URL для действия, переходим к нему
  if (notification.actionUrl) {
    router.push(notification.actionUrl)
    isOpen.value = false
  }
}

function viewAllNotifications() {
  isOpen.value = false
  // Переходим к странице настроек с активной вкладкой уведомлений
  router.push({ path: '/settings', query: { tab: 'notifications' } })
}

function getNotificationIconClass(type: Notification['type']): string {
  const classes = {
    info: 'bg-blue-500/20 text-blue-400',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    error: 'bg-red-500/20 text-red-400',
    user: 'bg-purple-500/20 text-purple-400',
    system: 'bg-gray-500/20 text-gray-400'
  }
  return classes[type] || classes.info
}

function getNotificationIconPath(type: Notification['type']): string {
  const paths = {
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z',
    error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    system: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
  }
  return paths[type] || paths.info
}

function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return t('notifications.time.justNow')
  if (minutes < 60) return t('notifications.time.minutesAgo', { count: minutes })
  if (hours < 24) return t('notifications.time.hoursAgo', { count: hours })
  if (days < 7) return t('notifications.time.daysAgo', { count: days })

  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  })
}

// Закрытие при клике вне компонента
function handleClickOutside(event: Event) {
  if (notificationsRef.value && !notificationsRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Кастомный скролл для блока уведомлений */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--primary) 30%, transparent) color-mix(in srgb, var(--text-primary) 5%, transparent);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: color-mix(in srgb, var(--text-primary) 5%, transparent);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--primary) 30%, transparent);
  border-radius: 3px;
  transition: background-color 0.2s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: color-mix(in srgb, var(--primary) 50%, transparent);
}

.custom-scrollbar::-webkit-scrollbar-thumb:active {
  background: color-mix(in srgb, var(--primary) 70%, transparent);
}

/* Для старых браузеров без поддержки color-mix */
@supports not (background: color-mix(in srgb, var(--primary) 30%, transparent)) {
  .custom-scrollbar {
    scrollbar-color: rgba(255, 48, 64, 0.3) rgba(255, 255, 255, 0.05);
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 48, 64, 0.3);
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 48, 64, 0.5);
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:active {
    background: rgba(255, 48, 64, 0.7);
  }
}
</style>
