<script setup lang="ts">
import { useDocumentTitle } from '@/composables/useDocumentTitle'
import { useNotifications } from '@/composables/useNotifications'
import NotificationToast from '@/components/NotificationToast.vue'

// Инициализируем управление заголовком документа
useDocumentTitle()

// Инициализируем систему уведомлений
const { notifications, removeNotification } = useNotifications()
</script>

<template>
  <div class="min-h-screen bg-background text-white mx-auto px-4 py-8">
    <div class=" mx-auto w-full">
      <router-view />
    </div>

    <!-- Уведомления -->
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <NotificationToast
        v-for="notification in notifications"
        :key="notification.id"
        :title="notification.title"
        :message="notification.message"
        :type="notification.type"
        :duration="notification.duration"
        @close="removeNotification(notification.id)"
      />
    </div>
  </div>
</template>

<style scoped></style>
