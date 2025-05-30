<template>
  <BaseModal
    v-if="user"
    :is-open="isOpen"
    :title="$t('users.editUser')"
    @close="$emit('close')"
  >
    <!-- Подзаголовок с информацией о пользователе -->
    <p class="text-gray-400 text-sm mb-6">{{ user.username }} (ID: {{ user.id }})</p>

    <!-- Информация о пользователе -->
    <div class="bg-background rounded-lg p-4 mb-6">
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-gray-400">{{ $t('users.email') }}:</span>
          <span class="text-white ml-2">{{ user.email || '—' }}</span>
        </div>
        <div>
          <span class="text-gray-400">{{ $t('users.registerDate') }}:</span>
          <span class="text-white ml-2">{{ formatDate(user.created_at) }}</span>
        </div>
        <div>
          <span class="text-gray-400">{{ $t('users.currentRole') }}:</span>
          <span
            class="ml-2 px-2 py-1 rounded-full text-xs font-medium"
            :class="getRoleClass(user.role?.name)"
          >
            {{ user.role?.name || '—' }}
          </span>
        </div>
        <div>
          <span class="text-gray-400">{{ $t('users.currentBalance') }}:</span>
          <span class="text-white ml-2">{{ formatBalance(user.balance) }} ₽</span>
        </div>
      </div>
    </div>

    <!-- Форма редактирования -->
    <Form
      :validation-schema="schema"
      @submit="onSubmit"
      validate-on-blur
      validate-on-change
      :initial-values="initialValues"
    >
      <div class="space-y-4">
        <!-- Роль -->
        <Field name="role" v-slot="{ field, errorMessage }">
          <label class="block text-gray-400 text-sm mb-2">{{ $t('users.newRole') }}</label>
          <select
            v-bind="field"
            class="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
            :class="{ 'border-red-500': !!errorMessage }"
            :disabled="loading"
          >
            <option value="">{{ $t('users.dontChangeRole') }}</option>
            <option value="admin">{{ $t('users.administrator') }}</option>
            <option value="user">{{ $t('users.user') }}</option>
          </select>
          <div v-if="errorMessage" class="text-red-500 text-xs mt-1">{{ errorMessage }}</div>
        </Field>

        <!-- Новый баланс -->
        <Field name="balance" v-slot="{ field, errorMessage }">
          <label class="block text-gray-400 text-sm mb-2">{{ $t('users.setBalance') }}</label>
          <BaseInput
            v-bind="field"
            type="number"
            :placeholder="$t('users.leaveEmptyToKeep')"
            min="0"
            step="0.01"
            :error="!!errorMessage"
            :disabled="loading"
          />
          <div v-if="errorMessage" class="text-red-500 text-xs mt-1">{{ errorMessage }}</div>
          <div class="text-gray-500 text-xs mt-1">
            {{ $t('users.currentBalance') }}: {{ formatBalance(user.balance) }} ₽
          </div>
        </Field>

        <!-- Сообщение об ошибке -->
        <div v-if="error" class="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">
          {{ error }}
        </div>

        <!-- Сообщение об успехе -->
        <div v-if="success" class="text-green-500 text-sm bg-green-500/10 p-3 rounded-lg">
          {{ $t('users.userUpdatedSuccess') }}
        </div>
      </div>

      <!-- Кнопки действий -->
      <div class="flex gap-3 mt-6">
        <BaseButton
          type="button"
          variant="outline"
          class="flex-1"
          @click="$emit('close')"
          :disabled="loading"
        >
          {{ $t('common.cancel') }}
        </BaseButton>
        <BaseButton
          type="submit"
          variant="primary"
          class="flex-1"
          :disabled="loading"
        >
          {{ loading ? $t('users.saving') : $t('common.save') }}
        </BaseButton>
      </div>
    </Form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useI18n } from 'vue-i18n'
import BaseModal from './BaseModal.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import type { User } from '@/services/api'
import { useUsersStore } from '@/stores/users'

interface Props {
  isOpen: boolean
  user: User | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  userUpdated: [user: User]
}>()

const { t } = useI18n()
const usersStore = useUsersStore()
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

// Начальные значения формы
const initialValues = computed(() => ({
  role: '', // Пустая строка означает "не изменять"
  balance: '' // Пустая строка означает "не изменять"
}))

// Схема валидации
const schema = yup.object({
  role: yup
    .string()
    .oneOf(['', 'admin', 'user'], t('users.selectValidRole')),
  balance: yup
    .number()
    .min(0, t('users.balanceMinValue'))
    .nullable()
    .transform((value, originalValue) => originalValue === '' ? null : value)
})

function getRoleClass(roleName?: string): string {
  if (!roleName) return 'bg-gray-500/20 text-gray-400'
  const roleClasses: Record<string, string> = {
    admin: 'bg-red-500/20 text-red-400',
    user: 'bg-green-500/20 text-green-400',
  }
  return roleClasses[roleName.toLowerCase()] || 'bg-gray-500/20 text-gray-400'
}

function formatBalance(balance: number): string {
  if (balance === null || balance === undefined) return '—'
  return new Intl.NumberFormat('ru-RU').format(balance)
}

function formatDate(dateString: string): string {
  if (!dateString) return '—'
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(dateString))
  } catch {
    return '—'
  }
}

async function onSubmit(values: Record<string, unknown>) {
  if (!props.user) return

  try {
    loading.value = true
    error.value = null
    success.value = false

    const promises: Promise<unknown>[] = []

    // Обновляем роль, если она выбрана
    if (values.role && values.role !== '') {
      const roleId = values.role === 'admin' ? 2 : 1
      promises.push(usersStore.updateUserRole(props.user.id, roleId))
    }

    // Обновляем баланс, если он указан
    if (values.balance !== null && values.balance !== undefined && values.balance !== '') {
      promises.push(usersStore.updateUserBalance(props.user.id, Number(values.balance)))
    }

    // Выполняем все запросы
    if (promises.length > 0) {
      await Promise.all(promises)
    }

    // Получаем обновленную информацию о пользователе
    const updatedUser = await usersStore.fetchUserById(props.user.id)

    success.value = true

    // Уведомляем родительский компонент
    emit('userUpdated', updatedUser)

    // Закрываем модальное окно через 1 секунду
    setTimeout(() => {
      emit('close')
    }, 1000)

  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Произошла ошибка при обновлении пользователя'
  } finally {
    loading.value = false
  }
}
</script>
