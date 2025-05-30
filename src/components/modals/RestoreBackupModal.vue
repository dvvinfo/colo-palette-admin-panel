<template>
  <BaseModal :is-open="isOpen" @close="emit('close')" :title="$t('modals.restoreBackup.title')">
    <div v-if="backup" class="space-y-6">
      <!-- Информация о бэкапе -->
      <div class="bg-gray-800/50 rounded-lg p-4">
        <h3 class="text-white font-medium mb-3">{{ $t('modals.restoreBackup.backupInfo') }}</h3>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-400">{{ $t('modals.restoreBackup.backupName') }}:</span>
            <span class="text-white">{{ backup.name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">{{ $t('modals.restoreBackup.backupType') }}:</span>
            <span class="text-white">{{ getTypeLabel(backup.type) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">{{ $t('modals.restoreBackup.backupSize') }}:</span>
            <span class="text-white">{{ formatFileSize(backup.size) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">{{ $t('modals.restoreBackup.createdAt') }}:</span>
            <span class="text-white">{{ formatDate(backup.createdAt) }}</span>
          </div>
        </div>
      </div>

      <!-- Компоненты для восстановления -->
      <div>
        <h3 class="text-white font-medium mb-3">{{ $t('modals.restoreBackup.componentsToRestore') }}</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            v-for="component in backup.components"
            :key="component"
            class="flex items-center p-3 bg-gray-800/30 rounded-lg"
          >
            <input
              :id="`restore-${component}`"
              v-model="selectedComponents"
              :value="component"
              type="checkbox"
              class="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
            />
            <label
              :for="`restore-${component}`"
              class="ml-3 flex-1 cursor-pointer"
            >
              <div class="flex items-center gap-2">
                <div
                  class="w-6 h-6 rounded flex items-center justify-center"
                  :class="getComponentIconClass(component)"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getComponentIconPath(component)"/>
                  </svg>
                </div>
                <div>
                  <p class="text-white text-sm font-medium">{{ getComponentLabel(component) }}</p>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Параметры восстановления -->
      <div>
        <h3 class="text-white font-medium mb-3">{{ $t('modals.restoreBackup.restoreOptions') }}</h3>
        <div class="space-y-3">
          <label class="flex items-center">
            <input
              v-model="options.createBackupBeforeRestore"
              type="checkbox"
              class="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
            />
            <span class="ml-3 text-white text-sm">
              {{ $t('modals.restoreBackup.createBackupBeforeRestore') }}
            </span>
          </label>

          <label class="flex items-center">
            <input
              v-model="options.overwriteExisting"
              type="checkbox"
              class="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
            />
            <span class="ml-3 text-white text-sm">
              {{ $t('modals.restoreBackup.overwriteExisting') }}
            </span>
          </label>

          <label class="flex items-center">
            <input
              v-model="options.verifyIntegrity"
              type="checkbox"
              class="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
            />
            <span class="ml-3 text-white text-sm">
              {{ $t('modals.restoreBackup.verifyIntegrity') }}
            </span>
          </label>
        </div>
      </div>

      <!-- Критическое предупреждение -->
      <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <svg class="w-6 h-6 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <div>
            <p class="text-red-400 font-medium text-sm mb-2">{{ $t('modals.restoreBackup.criticalWarning') }}</p>
            <ul class="text-red-300 text-xs space-y-1">
              <li>{{ $t('modals.restoreBackup.warningText1') }}</li>
              <li>{{ $t('modals.restoreBackup.warningText2') }}</li>
              <li>{{ $t('modals.restoreBackup.warningText3') }}</li>
              <li>{{ $t('modals.restoreBackup.warningText4') }}</li>
              <li>{{ $t('modals.restoreBackup.warningText5') }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Подтверждение -->
      <div class="bg-gray-800/50 rounded-lg p-4">
        <label class="flex items-start gap-3">
          <input
            v-model="confirmationAccepted"
            type="checkbox"
            class="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2 mt-0.5"
          />
          <span class="text-white text-sm">
            {{ $t('modals.restoreBackup.confirmationText') }}
          </span>
        </label>
      </div>

      <!-- Кнопки -->
      <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
        <BaseButton
          type="button"
          variant="outline"
          @click="emit('close')"
        >
          {{ $t('common.cancel') }}
        </BaseButton>
        <BaseButton
          type="button"
          variant="danger"
          :disabled="!canRestore"
          @click="confirmRestore"
          class="flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          {{ $t('modals.restoreBackup.restoreFromBackup') }}
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useI18n } from 'vue-i18n'
import type { Backup } from '@/stores/backups'

interface Props {
  isOpen: boolean
  backup: Backup | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  restoreConfirmed: [options: {
    components: string[],
    options: {
      createBackupBeforeRestore: boolean
      overwriteExisting: boolean
      verifyIntegrity: boolean
    }
  }]
}>()

const { t } = useI18n()

const selectedComponents = ref<string[]>([])
const confirmationAccepted = ref(false)

const options = ref({
  createBackupBeforeRestore: true,
  overwriteExisting: true,
  verifyIntegrity: true
})

const canRestore = computed(() => {
  return confirmationAccepted.value &&
         selectedComponents.value.length > 0
})

// Сброс состояния при открытии модального окна
watch(() => props.backup, (newBackup) => {
  if (newBackup) {
    selectedComponents.value = [...newBackup.components]
    confirmationAccepted.value = false
    options.value = {
      createBackupBeforeRestore: true,
      overwriteExisting: true,
      verifyIntegrity: true
    }
  }
})

function confirmRestore() {
  if (canRestore.value) {
    emit('restoreConfirmed', {
      components: selectedComponents.value,
      options: options.value
    })
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatDate(date: Date): string {
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getTypeLabel(type: Backup['type']): string {
  return t(`backupLabels.${type}`)
}

function getComponentLabel(component: string): string {
  return t(`backupComponents.${component}`)
}

function getComponentIconClass(component: string): string {
  const classes: Record<string, string> = {
    users: 'bg-purple-500/20 text-purple-400',
    games: 'bg-blue-500/20 text-blue-400',
    transactions: 'bg-green-500/20 text-green-400',
    bonuses: 'bg-yellow-500/20 text-yellow-400',
    uploads: 'bg-indigo-500/20 text-indigo-400',
    configs: 'bg-gray-500/20 text-gray-400',
    settings: 'bg-gray-500/20 text-gray-400',
    logs: 'bg-orange-500/20 text-orange-400',
    database: 'bg-blue-500/20 text-blue-400',
    files: 'bg-green-500/20 text-green-400',
    avatars: 'bg-pink-500/20 text-pink-400',
    documents: 'bg-cyan-500/20 text-cyan-400',
    analytics: 'bg-purple-500/20 text-purple-400'
  }
  return classes[component] || 'bg-gray-500/20 text-gray-400'
}

function getComponentIconPath(component: string): string {
  const paths: Record<string, string> = {
    users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
    games: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    transactions: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    bonuses: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
    uploads: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
    configs: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    logs: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    database: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4',
    files: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    avatars: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    documents: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    analytics: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  }
  return paths[component] || 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
}
</script>
