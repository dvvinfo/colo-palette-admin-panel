<template>
  <div
    v-if="isOpen && game"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    @mousedown.self="$emit('close')"
  >
    <div class="bg-card-bg rounded-2xl shadow-xl w-full max-w-md p-8 relative">
      <!-- Заголовок и кнопка закрытия -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-white">Редактировать игру</h2>
          <p class="text-gray-400 text-sm mt-1">{{ game.name }} (ID: {{ game.id }})</p>
        </div>
        <BaseButton
          @click="$emit('close')"
          variant="ghost"
          size="sm"
          class="!p-2 text-gray-400 hover:text-white"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </BaseButton>
      </div>

      <!-- Информация об игре -->
      <div class="bg-background rounded-lg p-4 mb-6">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-400">Название:</span>
            <span class="text-white ml-2">{{ game.name }}</span>
          </div>
          <div>
            <span class="text-gray-400">Текущий шанс:</span>
            <span class="text-white ml-2">{{ game.chance }}%</span>
          </div>
          <div class="col-span-2">
            <span class="text-gray-400">Текущий RTP:</span>
            <span class="text-white ml-2 font-mono text-lg">{{ game.rtp }}%</span>
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
          <!-- RTP -->
          <Field name="rtp" v-slot="{ field, errorMessage }">
            <label class="block text-gray-400 text-sm mb-2">Новый RTP (Return to Player) *</label>
            <BaseInput
              v-bind="field"
              type="number"
              placeholder="Введите RTP от 1 до 100"
              min="1"
              max="100"
              step="0.01"
              :error="!!errorMessage"
              :disabled="loading"
            />
            <div v-if="errorMessage" class="text-red-500 text-xs mt-1">{{ errorMessage }}</div>
            <div class="text-gray-500 text-xs mt-1">
              RTP (Return to Player) - процент возврата игроку. Текущее значение: {{ game.rtp }}%
            </div>
          </Field>

          <!-- Сообщение об ошибке -->
          <div v-if="error" class="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">
            {{ error }}
          </div>

          <!-- Сообщение об успехе -->
          <div v-if="success" class="text-green-500 text-sm bg-green-500/10 p-3 rounded-lg">
            RTP игры успешно обновлен!
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
            :disabled="loading"
          >
            {{ loading ? 'Сохранение...' : 'Сохранить' }}
          </BaseButton>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import type { Game } from '@/services/api'
import { useGamesStore } from '@/stores/games'

interface Props {
  isOpen: boolean
  game: Game | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  gameUpdated: [game: Game]
}>()

const gamesStore = useGamesStore()
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

// Начальные значения формы
const initialValues = computed(() => ({
  rtp: props.game?.rtp || 95
}))

// Схема валидации
const schema = yup.object({
  rtp: yup
    .number()
    .required('RTP обязателен')
    .min(1, 'RTP должен быть больше 0')
    .max(100, 'RTP не может быть больше 100')
})

async function onSubmit(values: Record<string, unknown>) {
  if (!props.game) return

  try {
    loading.value = true
    error.value = null
    success.value = false

    // Обновляем RTP игры
    await gamesStore.updateGameRTP(props.game.id, Number(values.rtp))

    success.value = true

    // Создаем обновленный объект игры для уведомления
    const updatedGame = {
      ...props.game,
      rtp: Number(values.rtp)
    }

    // Уведомляем родительский компонент
    emit('gameUpdated', updatedGame)

    // Закрываем модальное окно через 1 секунду
    setTimeout(() => {
      emit('close')
    }, 1000)

  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Произошла ошибка при обновлении игры'
  } finally {
    loading.value = false
  }
}
</script>
