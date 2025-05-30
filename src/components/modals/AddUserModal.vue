<template>
  <BaseModal
    :is-open="isOpen"
    :title="$t('users.addNew')"
    @close="$emit('close')"
  >
    <!-- Форма добавления пользователя -->
    <Form
      :validation-schema="schema"
      @submit="onSubmit"
      validate-on-blur
      validate-on-change
      v-slot="{ meta }"
    >
      <div class="space-y-4">
        <!-- Имя пользователя -->
        <Field name="username" v-slot="{ field, errorMessage }">
          <label class="block text-gray-400 text-sm mb-2">{{ $t('users.username') }} *</label>
          <BaseInput
            v-bind="field"
            type="text"
            :placeholder="$t('users.usernamePlaceholder')"
            required
            :error="!!errorMessage"
            :disabled="loading"
          />
          <div v-if="errorMessage" class="text-red-500 text-xs mt-1">{{ errorMessage }}</div>
        </Field>

        <!-- Email -->
        <Field name="email" v-slot="{ field, errorMessage }">
          <label class="block text-gray-400 text-sm mb-2">{{ $t('users.email') }} *</label>
          <BaseInput
            v-bind="field"
            type="email"
            :placeholder="$t('users.emailPlaceholder')"
            :error="!!errorMessage"
            :disabled="loading"
          />
          <div v-if="errorMessage" class="text-red-500 text-xs mt-1">{{ errorMessage }}</div>
        </Field>

        <!-- Пароль -->
        <Field name="password" v-slot="{ field, errorMessage }">
          <label class="block text-gray-400 text-sm mb-2">{{ $t('auth.password') }} *</label>
          <BaseInput
            v-bind="field"
            type="password"
            :placeholder="$t('users.passwordPlaceholder')"
            required
            :error="!!errorMessage"
            :disabled="loading"
          />
          <div v-if="errorMessage" class="text-red-500 text-xs mt-1">{{ errorMessage }}</div>
        </Field>

        <!-- Подтверждение пароля -->
        <Field name="confirmPassword" v-slot="{ field, errorMessage }">
          <label class="block text-gray-400 text-sm mb-2">{{ $t('users.confirmPassword') }} *</label>
          <BaseInput
            v-bind="field"
            type="password"
            :placeholder="$t('users.confirmPasswordPlaceholder')"
            required
            :error="!!errorMessage"
            :disabled="loading"
          />
          <div v-if="errorMessage" class="text-red-500 text-xs mt-1">{{ errorMessage }}</div>
        </Field>

        <!-- Роль -->
        <Field name="role" v-slot="{ field, errorMessage }">
          <label class="block text-gray-400 text-sm mb-2">{{ $t('users.role') }} *</label>
          <select
            v-bind="field"
            class="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
            :class="{ 'border-red-500': !!errorMessage }"
            :disabled="loading"
          >
            <option value="">{{ $t('users.selectRole') }}</option>
            <option value="user">{{ $t('users.user') }}</option>
            <option value="admin">{{ $t('users.administrator') }}</option>
          </select>
          <div v-if="errorMessage" class="text-red-500 text-xs mt-1">{{ errorMessage }}</div>
        </Field>

        <!-- Начальный баланс -->
        <Field name="balance" v-slot="{ field, errorMessage }">
          <label class="block text-gray-400 text-sm mb-2">{{ $t('users.initialBalance') }}</label>
          <BaseInput
            v-bind="field"
            type="number"
            :placeholder="$t('users.balancePlaceholder')"
            min="0"
            step="0.01"
            :error="!!errorMessage"
            :disabled="loading"
          />
          <div v-if="errorMessage" class="text-red-500 text-xs mt-1">{{ errorMessage }}</div>
        </Field>

        <!-- Сообщение об ошибке -->
        <div v-if="error" class="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">
          {{ error }}
        </div>

        <!-- Сообщение об успехе -->
        <div v-if="success" class="text-green-500 text-sm bg-green-500/10 p-3 rounded-lg">
          {{ $t('users.userCreatedSuccess') }}
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
          :disabled="!meta.valid || loading"
        >
          {{ loading ? $t('users.creating') : $t('common.create') }}
        </BaseButton>
      </div>
    </Form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import BaseModal from './BaseModal.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import { useUsersStore } from '@/stores/users'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Props {
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  userAdded: []
}>()

const usersStore = useUsersStore()
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

// Схема валидации
const schema = yup.object({
  username: yup
    .string()
    .required(t('users.usernameRequired'))
    .min(3, t('users.usernameMinLength'))
    .max(20, t('users.usernameMaxLength')),
  email: yup
    .string()
    .required(t('users.emailRequired'))
    .email(t('users.emailInvalid')),
  password: yup
    .string()
    .required(t('users.passwordRequired'))
    .min(6, t('users.passwordMinLength')),
  confirmPassword: yup
    .string()
    .required(t('users.confirmPasswordRequired'))
    .oneOf([yup.ref('password')], t('users.passwordsDoNotMatch')),
  role: yup
    .string()
    .required(t('users.roleRequired'))
    .oneOf(['user', 'admin'], t('users.roleInvalid')),
  balance: yup
    .number()
    .min(0, t('users.balanceMinValue'))
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
})

async function onSubmit(values: Record<string, unknown>) {
  try {
    loading.value = true
    error.value = null
    success.value = false

    // Формируем данные для создания пользователя
    const userData = {
      username: values.username as string,
      email: values.email as string || '',
      password: values.password as string,
      role: values.role as string,
      balance: values.balance ? Number(values.balance) : 0
    }

    // Создаем пользователя через store
    await usersStore.createUser(userData)

    success.value = true

    // Уведомляем родительский компонент
    emit('userAdded')

    // Закрываем модальное окно через 2 секунды после успешного создания
    setTimeout(() => {
      emit('close')
    }, 2000)

  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Произошла ошибка при создании пользователя'
  } finally {
    loading.value = false
  }
}
</script>
