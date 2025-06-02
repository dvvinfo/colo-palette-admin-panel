<template>
  <div class="bg-card-bg rounded-2xl p-6 border border-white/10">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-bold text-white">{{ $t('notifications.createNew') }}</h3>
      <button
        v-if="isCollapsed"
        @click="isCollapsed = false"
        class="text-primary hover:text-primary/80 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
      </button>
      <button
        v-else
        @click="isCollapsed = true"
        class="text-gray-400 hover:text-white transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <form v-if="!isCollapsed" @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Тип уведомления -->
      <div>
        <label class="block text-sm font-medium text-white mb-2">
          {{ $t('notifications.type') }}
        </label>
        <select
          v-model="form.type"
          class="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none"
          required
        >
          <option value="">{{ $t('notifications.selectType') }}</option>
          <option value="info">{{ $t('notifications.types.info') }}</option>
          <option value="success">{{ $t('notifications.types.success') }}</option>
          <option value="warning">{{ $t('notifications.types.warning') }}</option>
          <option value="error">{{ $t('notifications.types.error') }}</option>
          <option value="new_user">{{ $t('notifications.types.newUser') }}</option>
          <option value="system">{{ $t('notifications.types.system') }}</option>
        </select>
      </div>

      <!-- Заголовок -->
      <div>
        <label class="block text-sm font-medium text-white mb-2">
          {{ $t('notifications.notificationTitle') }}
        </label>
        <input
          v-model="form.title"
          type="text"
          class="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-primary focus:outline-none"
          :placeholder="$t('notifications.titlePlaceholder')"
          required
          maxlength="100"
        />
      </div>

      <!-- Сообщение -->
      <div>
        <label class="block text-sm font-medium text-white mb-2">
          {{ $t('notifications.message') }}
        </label>
        <textarea
          v-model="form.message"
          rows="3"
          class="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-primary focus:outline-none resize-none"
          :placeholder="$t('notifications.messagePlaceholder')"
          required
          maxlength="500"
        ></textarea>
        <div class="text-xs text-gray-400 mt-1">
          {{ form.message.length }}/500
        </div>
      </div>

      <!-- Предварительный просмотр -->
      <div v-if="form.title || form.message" class="border border-white/10 rounded-lg p-4 bg-background">
        <div class="text-sm text-gray-400 mb-2">{{ $t('notifications.preview') }}</div>
        <div class="flex items-start gap-3">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            :class="getNotificationIconClass(form.type)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="getNotificationIconPath(form.type)"
              />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-white text-sm font-medium mb-1">
              {{ form.title || $t('notifications.titlePlaceholder') }}
            </p>
            <p class="text-gray-400 text-xs">
              {{ form.message || $t('notifications.messagePlaceholder') }}
            </p>
            <p class="text-gray-500 text-xs mt-1">{{ $t('notifications.time.justNow') }}</p>
          </div>
        </div>
      </div>

      <!-- Кнопки -->
      <div class="flex gap-3 pt-2">
        <button
          type="submit"
          :disabled="loading || !form.title || !form.message || !form.type"
          class="flex-1 bg-primary hover:bg-primary/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <span v-if="loading" class="flex items-center justify-center gap-2">
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {{ $t('notifications.creating') }}
          </span>
          <span v-else>{{ $t('notifications.create') }}</span>
        </button>
        <button
          type="button"
          @click="resetForm"
          class="px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          {{ $t('common.reset') }}
        </button>
      </div>
    </form>

    <!-- Сообщение об ошибке -->
    <div v-if="error" class="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
      <p class="text-red-400 text-sm">{{ error }}</p>
    </div>

    <!-- Сообщение об успехе -->
    <div v-if="success" class="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
      <p class="text-green-400 text-sm">{{ success }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useNotificationsStore } from '@/stores/notifications'
import type { NotificationCreateRequest } from '@/types'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const notificationsStore = useNotificationsStore()

const isCollapsed = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

const form = reactive<NotificationCreateRequest>({
  title: '',
  message: '',
  type: 'info'
})

async function handleSubmit() {
  if (!form.title || !form.message || !form.type) return

  try {
    loading.value = true
    error.value = null
    success.value = null

    await notificationsStore.createNotification({
      title: form.title,
      message: form.message,
      type: form.type
    })

    success.value = t('notifications.createSuccess')
    resetForm()

    // Скрываем сообщение об успехе через 3 секунды
    setTimeout(() => {
      success.value = null
    }, 3000)
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('notifications.createError')
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.title = ''
  form.message = ''
  form.type = 'info'
  error.value = null
}

function getNotificationIconClass(type: string): string {
  const classes = {
    info: 'bg-blue-500/20 text-blue-400',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    error: 'bg-red-500/20 text-red-400',
    new_user: 'bg-purple-500/20 text-purple-400',
    system: 'bg-gray-500/20 text-gray-400'
  }
  return classes[type as keyof typeof classes] || classes.info
}

function getNotificationIconPath(type: string): string {
  const paths = {
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z',
    error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    new_user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    system: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
  }
  return paths[type as keyof typeof paths] || paths.info
}
</script>
