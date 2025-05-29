<template>
  <AdminLayout
    page-title="Управление бэкапами"
    page-description="Создание, просмотр и управление резервными копиями системы"
  >
    <template #header-actions>
      <BaseButton
        @click="openCreateBackupModal"
        variant="primary"
        class="flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        <span class="hidden md:inline">Создать бэкап</span>
      </BaseButton>
    </template>

    <!-- Статистика бэкапов -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-xs md:text-sm">Всего бэкапов</p>
            <p class="text-white text-xl md:text-2xl font-bold">{{ backupsStore.totalBackups }}</p>
          </div>
        </div>
      </div>

      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-xs md:text-sm">Успешных</p>
            <p class="text-white text-xl md:text-2xl font-bold">{{ backupsStore.successfulBackups }}</p>
          </div>
        </div>
      </div>

      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-xs md:text-sm">Ошибок</p>
            <p class="text-white text-xl md:text-2xl font-bold">{{ backupsStore.failedBackups }}</p>
          </div>
        </div>
      </div>

      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-xs md:text-sm">Общий размер</p>
            <p class="text-white text-xl md:text-2xl font-bold">{{ backupsStore.formatFileSize(backupsStore.totalSize) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Активные задачи бэкапа -->
    <div v-if="backupsStore.activeJobs.length > 0" class="mb-6 md:mb-8">
      <h2 class="text-xl md:text-2xl font-bold text-white mb-4">Активные задачи</h2>
      <div class="space-y-4">
        <div
          v-for="job in backupsStore.activeJobs"
          :key="job.id"
          class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg"
        >
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-white font-medium">{{ job.name }}</h3>
              <p class="text-gray-400 text-sm">{{ job.description }}</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-400">{{ Math.round(job.progress) }}%</span>
              <div
                class="w-3 h-3 rounded-full"
                :class="{
                  'bg-yellow-400 animate-pulse': job.status === 'running',
                  'bg-gray-400': job.status === 'pending',
                  'bg-green-400': job.status === 'completed',
                  'bg-red-400': job.status === 'failed'
                }"
              ></div>
            </div>
          </div>
          <div class="w-full bg-gray-700 rounded-full h-2">
            <div
              class="bg-primary h-2 rounded-full transition-all duration-300"
              :style="{ width: `${job.progress}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Последний успешный бэкап -->
    <div v-if="backupsStore.latestBackup" class="mb-6 md:mb-8">
      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-green-400 font-medium mb-1">Последний успешный бэкап</h3>
            <p class="text-white font-bold">{{ backupsStore.latestBackup.name }}</p>
            <p class="text-gray-400 text-sm">
              {{ formatDate(backupsStore.latestBackup.createdAt) }} •
              {{ backupsStore.formatFileSize(backupsStore.latestBackup.size) }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <BaseButton
              @click="downloadBackup(backupsStore.latestBackup)"
              variant="outline"
              size="sm"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
            </BaseButton>
            <BaseButton
              @click="restoreBackup(backupsStore.latestBackup)"
              variant="primary"
              size="sm"
            >
              Восстановить
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Список бэкапов -->
    <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
      <div class="flex items-center justify-between mb-4 md:mb-6">
        <h2 class="text-xl md:text-2xl font-bold text-white">История бэкапов</h2>
        <div class="flex items-center gap-3">
          <select
            v-model="selectedType"
            class="bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Все типы</option>
            <option value="full">Полный</option>
            <option value="database">База данных</option>
            <option value="files">Файлы</option>
            <option value="partial">Частичный</option>
          </select>
          <BaseButton variant="outline" size="sm" @click="refreshBackups">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </BaseButton>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-white/10">
              <th class="text-left py-3 px-4 text-gray-400 font-medium">Название</th>
              <th class="text-left py-3 px-4 text-gray-400 font-medium">Тип</th>
              <th class="text-left py-3 px-4 text-gray-400 font-medium">Размер</th>
              <th class="text-left py-3 px-4 text-gray-400 font-medium">Статус</th>
              <th class="text-left py-3 px-4 text-gray-400 font-medium">Дата</th>
              <th class="text-right py-3 px-4 text-gray-400 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="backup in filteredBackups"
              :key="backup.id"
              class="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <td class="py-4 px-4">
                <div>
                  <p class="text-white font-medium">{{ backup.name }}</p>
                  <p class="text-gray-400 text-sm">{{ backup.description }}</p>
                </div>
              </td>
              <td class="py-4 px-4">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="getTypeClass(backup.type)"
                >
                  {{ getTypeLabel(backup.type) }}
                </span>
              </td>
              <td class="py-4 px-4 text-gray-300">
                {{ backup.size > 0 ? backupsStore.formatFileSize(backup.size) : '-' }}
              </td>
              <td class="py-4 px-4">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="getStatusClass(backup.status)"
                >
                  {{ getStatusLabel(backup.status) }}
                </span>
              </td>
              <td class="py-4 px-4 text-gray-300">
                {{ formatDate(backup.createdAt) }}
              </td>
              <td class="py-4 px-4">
                <div class="flex items-center justify-end gap-2">
                  <BaseButton
                    v-if="backup.status === 'completed' && backup.downloadUrl"
                    @click="downloadBackup(backup)"
                    variant="ghost"
                    size="sm"
                    title="Скачать"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                    </svg>
                  </BaseButton>
                  <BaseButton
                    v-if="backup.status === 'completed'"
                    @click="restoreBackup(backup)"
                    variant="ghost"
                    size="sm"
                    title="Восстановить"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                  </BaseButton>
                  <BaseButton
                    @click="deleteBackup(backup.id)"
                    variant="ghost"
                    size="sm"
                    class="text-red-400 hover:text-red-300"
                    title="Удалить"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </BaseButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Модальное окно создания бэкапа -->
    <CreateBackupModal
      :is-open="isCreateBackupModalOpen"
      @close="closeCreateBackupModal"
      @backup-created="onBackupCreated"
    />

    <!-- Модальное окно подтверждения восстановления -->
    <RestoreBackupModal
      :is-open="isRestoreModalOpen"
      :backup="selectedBackup"
      @close="closeRestoreModal"
      @restore-confirmed="onRestoreConfirmed"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminLayout from '@/components/layouts/AdminLayout.vue'
import BaseButton from '@/components/BaseButton.vue'
import CreateBackupModal from '@/components/modals/CreateBackupModal.vue'
import RestoreBackupModal from '@/components/modals/RestoreBackupModal.vue'
import { useBackupsStore, type Backup } from '@/stores/backups'

const backupsStore = useBackupsStore()

const selectedType = ref('')
const isCreateBackupModalOpen = ref(false)
const isRestoreModalOpen = ref(false)
const selectedBackup = ref<Backup | null>(null)

const filteredBackups = computed(() => {
  if (!selectedType.value) return backupsStore.backups
  return backupsStore.backups.filter(backup => backup.type === selectedType.value)
})

function openCreateBackupModal() {
  isCreateBackupModalOpen.value = true
}

function closeCreateBackupModal() {
  isCreateBackupModalOpen.value = false
}

function onBackupCreated() {
  closeCreateBackupModal()
}

function openRestoreModal(backup: Backup) {
  selectedBackup.value = backup
  isRestoreModalOpen.value = true
}

function closeRestoreModal() {
  isRestoreModalOpen.value = false
  selectedBackup.value = null
}

async function onRestoreConfirmed() {
  if (selectedBackup.value) {
    await backupsStore.restoreBackup(selectedBackup.value)
    closeRestoreModal()
  }
}

async function downloadBackup(backup: Backup) {
  await backupsStore.downloadBackup(backup)
}

async function restoreBackup(backup: Backup) {
  openRestoreModal(backup)
}

async function deleteBackup(id: number) {
  if (confirm('Вы уверены, что хотите удалить этот бэкап?')) {
    await backupsStore.deleteBackup(id)
  }
}

function refreshBackups() {
  // В реальном приложении здесь был бы запрос к API
  console.log('Обновление списка бэкапов')
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

function getTypeClass(type: Backup['type']): string {
  const classes = {
    full: 'bg-purple-500/20 text-purple-300',
    database: 'bg-blue-500/20 text-blue-300',
    files: 'bg-green-500/20 text-green-300',
    partial: 'bg-yellow-500/20 text-yellow-300'
  }
  return classes[type] || classes.partial
}

function getTypeLabel(type: Backup['type']): string {
  const labels = {
    full: 'Полный',
    database: 'БД',
    files: 'Файлы',
    partial: 'Частичный'
  }
  return labels[type] || type
}

function getStatusClass(status: Backup['status']): string {
  const classes = {
    completed: 'bg-green-500/20 text-green-300',
    in_progress: 'bg-yellow-500/20 text-yellow-300',
    failed: 'bg-red-500/20 text-red-300',
    corrupted: 'bg-orange-500/20 text-orange-300'
  }
  return classes[status] || classes.failed
}

function getStatusLabel(status: Backup['status']): string {
  const labels = {
    completed: 'Завершен',
    in_progress: 'В процессе',
    failed: 'Ошибка',
    corrupted: 'Поврежден'
  }
  return labels[status] || status
}
</script>
