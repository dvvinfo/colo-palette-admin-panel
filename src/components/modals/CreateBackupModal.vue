<template>
  <BaseModal :is-open="isOpen" @close="emit('close')" title="Создать бэкап">
    <form @submit.prevent="createBackup" class="space-y-6">
      <!-- Название бэкапа -->
      <div>
        <label for="name" class="block text-sm font-medium text-white mb-2">
          Название бэкапа
        </label>
        <BaseInput
          id="name"
          v-model="form.name"
          placeholder="Введите название бэкапа"
          required
          :error="!!errors.name"
        />
        <div v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</div>
      </div>

      <!-- Описание -->
      <div>
        <label for="description" class="block text-sm font-medium text-white mb-2">
          Описание
        </label>
        <textarea
          id="description"
          v-model="form.description"
          placeholder="Описание бэкапа"
          rows="3"
          class="w-full px-3 py-2 bg-gray-700 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        ></textarea>
      </div>

      <!-- Тип бэкапа -->
      <div>
        <label class="block text-sm font-medium text-white mb-3">
          Тип бэкапа
        </label>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            v-for="type in backupTypes"
            :key="type.value"
            class="relative"
          >
            <input
              :id="type.value"
              v-model="form.type"
              :value="type.value"
              type="radio"
              name="backup-type"
              class="sr-only"
            />
            <label
              :for="type.value"
              class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all"
              :class="[
                form.type === type.value
                  ? 'border-primary bg-primary/10'
                  : 'border-white/10 hover:border-white/20'
              ]"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-lg flex items-center justify-center"
                  :class="type.iconClass"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="type.iconPath"/>
                  </svg>
                </div>
                <div>
                  <p class="text-white font-medium">{{ type.label }}</p>
                  <p class="text-gray-400 text-sm">{{ type.description }}</p>
                </div>
              </div>
            </label>
          </div>
        </div>
        <div v-if="errors.type" class="text-red-500 text-xs mt-1">{{ errors.type }}</div>
      </div>

      <!-- Компоненты для включения -->
      <div>
        <label class="block text-sm font-medium text-white mb-3">
          Компоненты для включения
        </label>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            v-for="component in availableComponents"
            :key="component.value"
            class="flex items-center p-3 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
          >
            <input
              :id="component.value"
              v-model="form.components"
              :value="component.value"
              type="checkbox"
              class="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
              :disabled="!isComponentAvailable(component.value)"
            />
            <label
              :for="component.value"
              class="ml-3 flex-1 cursor-pointer"
              :class="{ 'opacity-50': !isComponentAvailable(component.value) }"
            >
              <div class="flex items-center gap-2">
                <div
                  class="w-6 h-6 rounded flex items-center justify-center"
                  :class="component.iconClass"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="component.iconPath"/>
                  </svg>
                </div>
                <div>
                  <p class="text-white text-sm font-medium">{{ component.label }}</p>
                  <p class="text-gray-400 text-xs">{{ component.description }}</p>
                </div>
              </div>
            </label>
          </div>
        </div>
        <div v-if="errors.components" class="text-red-500 text-xs mt-1">{{ errors.components }}</div>
      </div>

      <!-- Предупреждение -->
      <div class="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <div>
            <p class="text-yellow-400 font-medium text-sm">Внимание</p>
            <p class="text-yellow-300 text-xs mt-1">
              Создание бэкапа может занять некоторое время в зависимости от размера данных.
              Во время выполнения операции производительность системы может снизиться.
            </p>
          </div>
        </div>
      </div>

      <!-- Кнопки -->
      <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
        <BaseButton
          type="button"
          variant="outline"
          @click="emit('close')"
        >
          Отмена
        </BaseButton>
        <BaseButton
          type="submit"
          variant="primary"
          :disabled="isLoading || !isFormValid"
          class="flex items-center gap-2"
        >
          <svg
            v-if="isLoading"
            class="w-4 h-4 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          {{ isLoading ? 'Создание...' : 'Создать бэкап' }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import { useBackupsStore } from '@/stores/backups'

interface Props {
  isOpen: boolean
}

defineProps<Props>()
const emit = defineEmits<{
  close: []
  backupCreated: []
}>()

const backupsStore = useBackupsStore()

const form = ref({
  name: '',
  description: '',
  type: 'database' as 'full' | 'partial' | 'database' | 'files',
  components: [] as string[]
})

const errors = ref({
  name: '',
  type: '',
  components: ''
})

const isLoading = ref(false)

const backupTypes = [
  {
    value: 'full',
    label: 'Полный бэкап',
    description: 'Все данные системы',
    iconClass: 'bg-purple-500/20 text-purple-400',
    iconPath: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4'
  },
  {
    value: 'database',
    label: 'База данных',
    description: 'Только данные БД',
    iconClass: 'bg-blue-500/20 text-blue-400',
    iconPath: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4'
  },
  {
    value: 'files',
    label: 'Файлы',
    description: 'Пользовательские файлы',
    iconClass: 'bg-green-500/20 text-green-400',
    iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  },
  {
    value: 'partial',
    label: 'Частичный',
    description: 'Выборочные компоненты',
    iconClass: 'bg-yellow-500/20 text-yellow-400',
    iconPath: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
  }
]

const availableComponents = [
  {
    value: 'users',
    label: 'Пользователи',
    description: 'Учетные записи и профили',
    iconClass: 'bg-purple-500/20 text-purple-400',
    iconPath: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
    availableFor: ['full', 'database', 'partial']
  },
  {
    value: 'games',
    label: 'Игры',
    description: 'Данные игр и конфигурации',
    iconClass: 'bg-blue-500/20 text-blue-400',
    iconPath: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    availableFor: ['full', 'database', 'partial']
  },
  {
    value: 'transactions',
    label: 'Транзакции',
    description: 'Финансовые операции',
    iconClass: 'bg-green-500/20 text-green-400',
    iconPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    availableFor: ['full', 'database', 'partial']
  },
  {
    value: 'bonuses',
    label: 'Бонусы',
    description: 'Бонусные программы',
    iconClass: 'bg-yellow-500/20 text-yellow-400',
    iconPath: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
    availableFor: ['full', 'database', 'partial']
  },
  {
    value: 'uploads',
    label: 'Загрузки',
    description: 'Загруженные файлы',
    iconClass: 'bg-indigo-500/20 text-indigo-400',
    iconPath: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
    availableFor: ['full', 'files', 'partial']
  },
  {
    value: 'configs',
    label: 'Конфигурации',
    description: 'Настройки системы',
    iconClass: 'bg-gray-500/20 text-gray-400',
    iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    availableFor: ['full', 'partial']
  }
]

const isFormValid = computed(() => {
  return form.value.name.trim() &&
         form.value.type &&
         form.value.components.length > 0
})

function isComponentAvailable(component: string): boolean {
  const comp = availableComponents.find(c => c.value === component)
  return comp ? comp.availableFor.includes(form.value.type) : false
}

function validateForm(): boolean {
  errors.value = {
    name: '',
    type: '',
    components: ''
  }

  if (!form.value.name.trim()) {
    errors.value.name = 'Название обязательно'
  }

  if (!form.value.type) {
    errors.value.type = 'Выберите тип бэкапа'
  }

  if (form.value.components.length === 0) {
    errors.value.components = 'Выберите хотя бы один компонент'
  }

  return !Object.values(errors.value).some(error => error !== '')
}

async function createBackup() {
  if (!validateForm()) return

  try {
    isLoading.value = true

    await backupsStore.createBackup({
      name: form.value.name.trim(),
      description: form.value.description.trim(),
      type: form.value.type,
      components: form.value.components
    })

    // Сбрасываем форму
    form.value = {
      name: '',
      description: '',
      type: 'database',
      components: []
    }

    emit('backupCreated')
  } catch (error) {
    console.error('Error creating backup:', error)
  } finally {
    isLoading.value = false
  }
}

// Обновляем доступные компоненты при смене типа
watch(() => form.value.type, (newType) => {
  // Убираем компоненты, которые недоступны для нового типа
  form.value.components = form.value.components.filter(component => {
    const comp = availableComponents.find(c => c.value === component)
    return comp ? comp.availableFor.includes(newType) : false
  })
})

// Автоматически выбираем подходящие компоненты для типа
watch(() => form.value.type, (newType) => {
  if (newType === 'full') {
    form.value.components = availableComponents
      .filter(c => c.availableFor.includes('full'))
      .map(c => c.value)
  } else if (newType === 'database') {
    form.value.components = ['users', 'games', 'transactions', 'bonuses']
  } else if (newType === 'files') {
    form.value.components = ['uploads']
  }
}, { immediate: true })
</script>
