<template>
  <BaseModal
    :is-open="isOpen"
    title="Добавить пользователя"
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
          <label class="block text-gray-400 text-sm mb-2">Имя пользователя *</label>
          <BaseInput
            v-bind="field"
            type="text"
            placeholder="Введите имя пользователя"
            required
            :error="!!errorMessage"
            :disabled="loading"
          />
          <div v-if="errorMessage" class="text-red-500 text-xs mt-1">{{ errorMessage }}</div>
        </Field>

        <!-- Email -->
        <Field name="email" v-slot="{ field, errorMessage }">
          <label class="block text-gray-400 text-sm mb-2">Email</label>
          <BaseInput
            v-bind="field"
            type="email"
            placeholder="Введите email (необязательно)"
            :error="!!errorMessage"
            :disabled="loading"
          />
          <div v-if="errorMessage" class="text-red-500 text-xs mt-1">{{ errorMessage }}</div>
        </Field>

        <!-- Пароль -->
        <Field name="password" v-slot="{ field, errorMessage }">
          <label class="block text-gray-400 text-sm mb-2">Пароль *</label>
          <BaseInput
            v-bind="field"
            type="password"
            placeholder="Введите пароль"
            required
            :error="!!errorMessage"
            :disabled="loading"
          />
          <div v-if="errorMessage" class="text-red-500 text-xs mt-1">{{ errorMessage }}</div>
        </Field>

        <!-- Подтверждение пароля -->
        <Field name="confirmPassword" v-slot="{ field, errorMessage }">
          <label class="block text-gray-400 text-sm mb-2">Подтвердите пароль *</label>
          <BaseInput
            v-bind="field"
            type="password"
            placeholder="Подтвердите пароль"
            required
            :error="!!errorMessage"
            :disabled="loading"
          />
          <div v-if="errorMessage" class="text-red-500 text-xs mt-1">{{ errorMessage }}</div>
        </Field>

        <!-- Роль -->
        <Field name="role" v-slot="{ field, errorMessage }">
          <label class="block text-gray-400 text-sm mb-2">Роль *</label>
          <select
            v-bind="field"
            class="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
            :class="{ 'border-red-500': !!errorMessage }"
            :disabled="loading"
          >
            <option value="">Выберите роль</option>
            <option value="admin">Администратор</option>
            <option value="user">Пользователь</option>
          </select>
          <div v-if="errorMessage" class="text-red-500 text-xs mt-1">{{ errorMessage }}</div>
        </Field>

        <!-- Начальный баланс -->
        <Field name="balance" v-slot="{ field, errorMessage }">
          <label class="block text-gray-400 text-sm mb-2">Начальный баланс</label>
          <BaseInput
            v-bind="field"
            type="number"
            placeholder="0"
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
          Пользователь успешно создан!
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
          Отмена
        </BaseButton>
        <BaseButton
          type="submit"
          variant="primary"
          class="flex-1"
          :disabled="!meta.valid || loading"
        >
          {{ loading ? 'Создание...' : 'Создать' }}
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
    .required('Имя пользователя обязательно')
    .min(3, 'Минимум 3 символа')
    .max(50, 'Максимум 50 символов'),
  email: yup
    .string()
    .email('Неверный формат email')
    .nullable()
    .transform((value, originalValue) => originalValue === '' ? null : value),
  password: yup
    .string()
    .required('Пароль обязателен')
    .min(6, 'Минимум 6 символов'),
  confirmPassword: yup
    .string()
    .required('Подтверждение пароля обязательно')
    .oneOf([yup.ref('password')], 'Пароли не совпадают'),
  role: yup
    .string()
    .required('Роль обязательна')
    .oneOf(['admin', 'user'], 'Выберите корректную роль'),
  balance: yup
    .number()
    .min(0, 'Баланс не может быть отрицательным')
    .nullable()
    .transform((value, originalValue) => originalValue === '' ? null : value)
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

    // Закрываем модальное окно через 1 секунду
    setTimeout(() => {
      emit('close')
    }, 1000)

  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Произошла ошибка при создании пользователя'
  } finally {
    loading.value = false
  }
}
</script>
