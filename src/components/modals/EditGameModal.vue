<template>
  <BaseModal
    v-if="game"
    :is-open="isOpen"
    :title="$t('modals.editGame.title')"
    @close="$emit('close')"
  >
    <!-- Подзаголовок с информацией об игре -->
    <p class="text-gray-400 text-sm mb-6">{{ game.name }} (ID: {{ game.id }})</p>

    <!-- Информация об игре -->
    <div class="bg-background rounded-lg p-4 mb-6">
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-gray-400">{{ $t('common.name') }}:</span>
          <span class="text-white ml-2">{{ game.name }}</span>
        </div>
        <div>
          <span class="text-gray-400">{{ $t('modals.editGame.currentChance') }}:</span>
          <span class="text-white ml-2">{{ game.chance }}%</span>
        </div>
        <div class="col-span-2">
          <span class="text-gray-400">{{ $t('modals.editGame.currentRtp') }}:</span>
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
          <label class="block text-gray-400 text-sm mb-2">{{ $t('modals.editGame.newRtp') }} *</label>
          <BaseInput
            v-bind="field"
            type="number"
            :placeholder="$t('modals.editGame.rtpPlaceholder')"
            min="1"
            max="100"
            step="0.01"
            :error="!!errorMessage"
            :disabled="loading"
          />
          <div v-if="errorMessage" class="text-red-500 text-xs mt-1">{{ errorMessage }}</div>
          <div class="text-gray-500 text-xs mt-1">
            {{ $t('modals.editGame.rtpDescription', { currentRtp: game.rtp }) }}
          </div>
        </Field>

        <!-- Сообщение об ошибке -->
        <div v-if="error" class="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">
          {{ error }}
        </div>

        <!-- Сообщение об успехе -->
        <div v-if="success" class="text-green-500 text-sm bg-green-500/10 p-3 rounded-lg">
          {{ $t('modals.editGame.updateSuccess') }}
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
          {{ loading ? $t('modals.editGame.saving') : $t('common.save') }}
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

const { t } = useI18n()
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
    .required(t('modals.editGame.rtpRequired'))
    .min(1, t('modals.editGame.rtpMinValue'))
    .max(100, t('modals.editGame.rtpMaxValue'))
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
    error.value = err instanceof Error ? err.message : t('modals.editGame.updateError')
  } finally {
    loading.value = false
  }
}
</script>
