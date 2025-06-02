<template>
  <BaseModal
    :is-open="isOpen"
    :title="$t('bonuses.createBonus')"
    :max-width="'max-w-2xl'"
    @close="$emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Основная информация -->
      <div class="space-y-4">
        <div>
          <label class="block text-gray-400 text-sm mb-2">{{ $t('bonuses.title') }} *</label>
          <BaseInput
            v-model="form.title"
            type="text"
            required
            :placeholder="$t('bonuses.titlePlaceholder')"
          />
        </div>

        <div>
          <label class="block text-gray-400 text-sm mb-2">{{ $t('common.description') }} *</label>
          <BaseTextarea
            v-model="form.description"
            required
            rows="3"
            :placeholder="$t('bonuses.descriptionPlaceholder')"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-400 text-sm mb-2">{{ $t('bonuses.bonusType') }} *</label>
            <select
              v-model="form.type"
              required
              class="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
            >
              <option value="">{{ $t('bonuses.selectBonusType') }}</option>
              <option value="welcome">{{ $t('bonuses.welcome') }}</option>
              <option value="reload">{{ $t('bonuses.reload') }}</option>
              <option value="cashback">{{ $t('bonuses.cashback') }}</option>
              <option value="loyalty">{{ $t('bonuses.loyalty') }}</option>
              <option value="promo">{{ $t('bonuses.promocode') }}</option>
              <option value="freespins">{{ $t('bonuses.freespins') }}</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-400 text-sm mb-2"
              >{{ $t('bonuses.wagerRequirement') }} *</label
            >
            <div class="relative">
              <BaseInput
                v-model.number="form.wager_multiplier"
                type="number"
                required
                min="1"
                max="100"
                placeholder="40"
              />
              <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >x</span
              >
            </div>
          </div>
        </div>

        <div>
          <label class="block text-gray-400 text-sm mb-2">{{ $t('bonuses.reward') }} *</label>
          <BaseInput
            v-model="form.reward"
            type="text"
            required
            placeholder="100% (макс. 50 000 ₽) или 50 фриспинов"
          />
        </div>
      </div>

      <!-- Промокод (если тип промокод) -->
      <div v-if="form.type === 'promo'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-gray-400 text-sm mb-2">{{ $t('bonuses.promocode') }} *</label>
          <div class="flex gap-2">
            <BaseInput
              v-model="form.promo_code"
              type="text"
              required
              placeholder="MEGA2024"
              class="flex-1 uppercase"
            />
            <BaseButton
              type="button"
              variant="outline"
              @click="generatePromocode"
              class="px-4 py-3"
            >
              {{ $t('bonuses.generate') }}
            </BaseButton>
          </div>
        </div>

        <div>
          <label class="block text-gray-400 text-sm mb-2">{{ $t('bonuses.maxUses') }}</label>
          <BaseInput
            v-model.number="form.max_activations"
            type="number"
            min="1"
            placeholder="1000"
          />
        </div>
      </div>

      <!-- Даты -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-gray-400 text-sm mb-2">{{ $t('bonuses.startDate') }} *</label>
          <BaseInput
            v-model="form.start_date"
            type="datetime-local"
            required
            :min="minDateTime"
            class="datetime-input"
          />
          <p v-if="form.start_date && new Date(form.start_date) < new Date(minDateTime)"
             class="text-red-400 text-xs mt-1">
            {{ $t('bonuses.startDatePastError') }}
          </p>
        </div>

        <div>
          <label class="block text-gray-400 text-sm mb-2">{{ $t('bonuses.endDate') }}</label>
          <BaseInput
            v-model="form.end_date"
            type="datetime-local"
            :min="minEndDate"
            class="datetime-input"
          />
          <p v-if="form.end_date && form.start_date && new Date(form.end_date) <= new Date(form.start_date)"
             class="text-red-400 text-xs mt-1">
            {{ $t('bonuses.endDateBeforeStartError') }}
          </p>
        </div>
      </div>

      <!-- Кнопки -->
      <div class="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
        <BaseButton type="button" variant="outline" @click="$emit('close')" :disabled="isLoading">
          {{ $t('common.cancel') }}
        </BaseButton>
        <BaseButton
          type="submit"
          variant="primary"
          :disabled="isLoading || !isFormValid"
          class="min-w-[120px]"
        >
          <span v-if="isLoading" class="flex items-center gap-2">
            <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {{ $t('bonuses.creating') }}
          </span>
          <span v-else>{{ $t('bonuses.createBonus') }}</span>
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseTextarea from '@/components/BaseTextarea.vue'
import { useBonusesStore, type BonusForm } from '@/stores/bonuses'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  bonusCreated: []
}>()

const bonusesStore = useBonusesStore()
const isLoading = ref(false)

// Функция для получения текущего времени в формате datetime-local
function getCurrentDateTime(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// Текущее время для валидации (обновляется при открытии модалки)
const minDateTime = ref(getCurrentDateTime())

// Форма
const form = reactive<BonusForm>({
  title: '',
  description: '',
  type: '' as BonusForm['type'],
  reward: '',
  wager_multiplier: 40,
  start_date: getCurrentDateTime(),
  end_date: undefined,
  promo_code: undefined,
  max_activations: undefined,
})

// Обновляем минимальное время и время по умолчанию при открытии модалки
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    const currentTime = getCurrentDateTime()
    minDateTime.value = currentTime
    form.start_date = currentTime
  }
})

// Минимальная дата окончания (должна быть не раньше даты начала)
const minEndDate = computed(() => {
  return form.start_date || minDateTime.value
})

// Validation
const isFormValid = computed(() => {
  const baseValid =
    form.title &&
    form.description &&
    form.type &&
    form.reward &&
    form.wager_multiplier > 0 &&
    form.start_date

  // Проверяем, что дата начала не в прошлом
  const startDateValid = new Date(form.start_date) >= new Date(minDateTime.value)

  // Проверяем, что дата окончания не раньше даты начала
  const endDateValid = !form.end_date || new Date(form.end_date) > new Date(form.start_date)

  if (form.type === 'promo') {
    return baseValid && startDateValid && endDateValid && form.promo_code
  }

  return baseValid && startDateValid && endDateValid
})

// Event handlers
function generatePromocode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  form.promo_code = result
}

async function handleSubmit() {
  if (!isFormValid.value) return

  try {
    isLoading.value = true
    await bonusesStore.createBonus(form)

    // Сброс формы
    Object.assign(form, {
      title: '',
      description: '',
      type: '' as BonusForm['type'],
      reward: '',
      wager_multiplier: 40,
      start_date: minDateTime.value,
      end_date: undefined,
      promo_code: undefined,
      max_activations: undefined,
    })

    emit('bonusCreated')
  } catch (error) {
    console.error('Error creating bonus:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped></style>
