import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Backup {
  id: number
  name: string
  description: string
  type: 'full' | 'partial' | 'database' | 'files'
  size: number // в байтах
  createdAt: Date
  status: 'completed' | 'in_progress' | 'failed' | 'corrupted'
  downloadUrl?: string
  components: string[] // компоненты, включенные в бэкап
}

export interface BackupJob {
  id: number
  name: string
  type: 'full' | 'partial' | 'database' | 'files'
  description: string
  components: string[]
  progress: number
  status: 'pending' | 'running' | 'completed' | 'failed'
  startedAt?: Date
  estimatedCompletion?: Date
}

export const useBackupsStore = defineStore('backups', () => {
  const backups = ref<Backup[]>([
    {
      id: 1,
      name: 'Ежедневный бэкап БД',
      description: 'Автоматическое резервное копирование базы данных',
      type: 'database',
      size: 2147483648, // 2GB
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 часов назад
      status: 'completed',
      downloadUrl: '/api/backups/download/1',
      components: ['users', 'games', 'transactions', 'settings']
    },
    {
      id: 2,
      name: 'Полный бэкап системы',
      description: 'Полное резервное копирование системы и данных',
      type: 'full',
      size: 5368709120, // 5GB
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 день назад
      status: 'completed',
      downloadUrl: '/api/backups/download/2',
      components: ['database', 'files', 'configs', 'logs']
    },
    {
      id: 3,
      name: 'Бэкап файлов',
      description: 'Резервное копирование пользовательских файлов',
      type: 'files',
      size: 1073741824, // 1GB
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 часов назад
      status: 'completed',
      downloadUrl: '/api/backups/download/3',
      components: ['uploads', 'avatars', 'documents']
    },
    {
      id: 4,
      name: 'Критический бэкап',
      description: 'Экстренное резервное копирование перед обновлением',
      type: 'database',
      size: 0,
      createdAt: new Date(Date.now() - 1000 * 60 * 10), // 10 минут назад
      status: 'failed',
      components: ['users', 'transactions']
    },
    {
      id: 5,
      name: 'Поврежденный бэкап',
      description: 'Бэкап с обнаруженными ошибками целостности',
      type: 'partial',
      size: 3221225472, // 3GB
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 дня назад
      status: 'corrupted',
      components: ['games', 'bonuses', 'analytics']
    }
  ])

  const activeJobs = ref<BackupJob[]>([])

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const totalBackups = computed(() => backups.value.length)

  const totalSize = computed(() => {
    return backups.value
      .filter(backup => backup.status === 'completed')
      .reduce((sum, backup) => sum + backup.size, 0)
  })

  const successfulBackups = computed(() =>
    backups.value.filter(backup => backup.status === 'completed').length
  )

  const failedBackups = computed(() =>
    backups.value.filter(backup => backup.status === 'failed').length
  )

  const latestBackup = computed(() => {
    return backups.value
      .filter(backup => backup.status === 'completed')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]
  })

  const sortedBackups = computed(() =>
    [...backups.value].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  )

  // Actions
  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  async function createBackup(backupData: {
    name: string
    description: string
    type: Backup['type']
    components: string[]
  }) {
    try {
      isLoading.value = true
      error.value = null

      // Создаем новую задачу бэкапа
      const newJob: BackupJob = {
        id: Date.now(),
        ...backupData,
        progress: 0,
        status: 'pending',
        startedAt: new Date()
      }

      activeJobs.value.push(newJob)

      // Симуляция процесса создания бэкапа
      await simulateBackupProcess(newJob)

    } catch (err) {
      error.value = 'Ошибка при создании бэкапа'
      console.error('Backup creation error:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function simulateBackupProcess(job: BackupJob) {
    // Обновляем статус на "выполняется"
    job.status = 'running'
    job.startedAt = new Date()
    job.estimatedCompletion = new Date(Date.now() + 120000) // 2 минуты

    // Симуляция прогресса
    const progressInterval = setInterval(() => {
      if (job.progress < 100 && job.status === 'running') {
        job.progress += Math.random() * 15
        if (job.progress > 100) job.progress = 100
      }
    }, 1000)

    // Завершение через 8-12 секунд
    const completionTime = 8000 + Math.random() * 4000

    setTimeout(() => {
      clearInterval(progressInterval)

      // 90% шанс успеха
      const isSuccess = Math.random() > 0.1

      if (isSuccess) {
        job.status = 'completed'
        job.progress = 100

        // Создаем новый бэкап
        const newBackup: Backup = {
          id: Date.now(),
          name: job.name,
          description: job.description,
          type: job.type,
          size: Math.floor(Math.random() * 5000000000) + 500000000, // 500MB - 5GB
          createdAt: new Date(),
          status: 'completed',
          downloadUrl: `/api/backups/download/${Date.now()}`,
          components: job.components
        }

        backups.value.unshift(newBackup)
      } else {
        job.status = 'failed'
      }

      // Удаляем задачу через 5 секунд
      setTimeout(() => {
        const index = activeJobs.value.findIndex(j => j.id === job.id)
        if (index > -1) {
          activeJobs.value.splice(index, 1)
        }
      }, 5000)
    }, completionTime)
  }

  async function deleteBackup(id: number) {
    try {
      isLoading.value = true
      const index = backups.value.findIndex(backup => backup.id === id)
      if (index > -1) {
        backups.value.splice(index, 1)
      }
    } catch (err) {
      error.value = 'Ошибка при удалении бэкапа'
      console.error('Backup deletion error:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function downloadBackup(backup: Backup) {
    try {
      if (!backup.downloadUrl) {
        throw new Error('URL для скачивания недоступен')
      }

      // В реальном приложении здесь был бы запрос к API
      console.log(`Скачивание бэкапа: ${backup.name}`)

      // Симуляция скачивания
      const link = document.createElement('a')
      link.href = backup.downloadUrl
      link.download = `${backup.name.replace(/\s+/g, '_')}_${backup.id}.backup`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

    } catch (err) {
      error.value = 'Ошибка при скачивании бэкапа'
      console.error('Backup download error:', err)
    }
  }

  async function restoreBackup(backup: Backup) {
    try {
      isLoading.value = true
      error.value = null

      // В реальном приложении здесь был бы запрос к API
      console.log(`Восстановление из бэкапа: ${backup.name}`)

      // Симуляция процесса восстановления
      await new Promise(resolve => setTimeout(resolve, 3000))

      return true
    } catch (err) {
      error.value = 'Ошибка при восстановлении из бэкапа'
      console.error('Backup restore error:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    backups: sortedBackups,
    activeJobs,
    isLoading,
    error,

    // Computed
    totalBackups,
    totalSize,
    successfulBackups,
    failedBackups,
    latestBackup,

    // Actions
    formatFileSize,
    createBackup,
    deleteBackup,
    downloadBackup,
    restoreBackup,
    clearError
  }
})
