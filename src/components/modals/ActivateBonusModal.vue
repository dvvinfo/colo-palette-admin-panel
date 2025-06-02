<template>
  <BaseModal
    :is-open="isOpen"
    :title="$t('bonuses.activatePromo')"
    :max-width="'max-w-md'"
    @close="$emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label class="block text-gray-400 text-sm mb-2">{{ $t('bonuses.promocode') }} *</label>
        <BaseInput
          v-model="promoCode"
          type="text"
          required
          placeholder="MEGA2024"
          class="uppercase"
          :disabled="isLoading"
        />
      </div>

      <div v-if="error" class="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
        <p class="text-red-300 text-sm">{{ error }}</p>
      </div>

      <div class="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
        <BaseButton type="button" variant="outline" @click="$emit('close')" :disabled="isLoading">
          {{ $t('common.cancel') }}
        </BaseButton>
        <BaseButton
          type="submit"
          variant="primary"
          :disabled="isLoading || !promoCode.trim()"
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
            {{ $t('bonuses.activating') }}
          </span>
          <span v-else>{{ $t('bonuses.activate') }}</span>
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import { useBonusesStore } from '@/stores/bonuses'
import { useNotifications } from '@/composables/useNotifications'
import { useI18n } from 'vue-i18n'

interface Props {
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  bonusActivated: []
}>()

const { t } = useI18n()
const bonusesStore = useBonusesStore()
const { showSuccess, showError } = useNotifications()
const isLoading = ref(false)
const error = ref<string | null>(null)
const promoCode = ref('')

async function handleSubmit() {
  if (!promoCode.value.trim()) return

  try {
    isLoading.value = true
    error.value = null

    await bonusesStore.activateBonus(promoCode.value.trim().toUpperCase())

    // Показываем уведомление об успехе
    showSuccess(
      t('bonuses.activationSuccess'),
      t('bonuses.activationSuccessMessage', { code: promoCode.value.trim().toUpperCase() }),
    )

    // Сброс формы
    promoCode.value = ''
    emit('bonusActivated')
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error && 'response' in err
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
        : bonusesStore.error || t('bonuses.activationError')

    error.value = errorMessage || t('bonuses.activationError')

    // Показываем уведомление об ошибке
    showError(t('bonuses.activationError'), error.value)
  } finally {
    isLoading.value = false
  }
}
</script>
