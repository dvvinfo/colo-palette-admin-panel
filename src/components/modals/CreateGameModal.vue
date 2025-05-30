<template>
  <BaseModal
    :is-open="isOpen"
    :title="$t('games.addGame')"
    :max-width="'max-w-3xl'"
    @close="$emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Основная информация -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="md:col-span-2">
          <label class="block text-gray-400 text-sm mb-2">{{ $t('games.gameName') }} *</label>
          <BaseInput
            v-model="form.name"
            type="text"
            required
            :placeholder="$t('games.gameNamePlaceholder')"
          />
        </div>

        <div>
          <label class="block text-gray-400 text-sm mb-2">{{ $t('games.category') }} *</label>
          <select
            v-model="form.category"
            required
            class="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
          >
            <option value="">{{ $t('games.selectCategory') }}</option>
            <option value="slots">{{ $t('games.slots') }}</option>
            <option value="table">{{ $t('games.tableGames') }}</option>
            <option value="live">{{ $t('games.liveDealers') }}</option>
            <option value="poker">{{ $t('games.poker') }}</option>
          </select>
        </div>

        <div>
          <label class="block text-gray-400 text-sm mb-2">{{ $t('games.provider') }} *</label>
          <BaseInput
            v-model="form.provider"
            type="text"
            required
            :placeholder="$t('games.providerPlaceholder')"
          />
        </div>
      </div>

      <!-- Настройки игры -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-gray-400 text-sm mb-2">{{ $t('games.rtp') }} (%) *</label>
          <BaseInput
            v-model.number="form.rtp"
            type="number"
            required
            min="1"
            max="100"
            step="0.01"
            placeholder="96.50"
          />
        </div>

        <div>
          <label class="block text-gray-400 text-sm mb-2">{{ $t('games.chance') }} (%) *</label>
          <BaseInput
            v-model.number="form.chance"
            type="number"
            required
            min="1"
            max="100"
            step="0.01"
            placeholder="50.00"
          />
        </div>

        <div>
          <label class="block text-gray-400 text-sm mb-2">{{ $t('games.minBet') }} (₽) *</label>
          <BaseInput
            v-model.number="form.minBet"
            type="number"
            required
            min="1"
            placeholder="10"
          />
        </div>

        <div>
          <label class="block text-gray-400 text-sm mb-2">{{ $t('games.maxBet') }} (₽) *</label>
          <BaseInput
            v-model.number="form.maxBet"
            type="number"
            required
            min="1"
            placeholder="50000"
          />
        </div>
      </div>

      <!-- Описание и изображение -->
      <div class="space-y-4">
        <div>
          <label class="block text-gray-400 text-sm mb-2">{{ $t('common.description') }}</label>
          <BaseTextarea
            v-model="form.description"
            rows="3"
            :placeholder="$t('games.descriptionPlaceholder')"
          />
        </div>

        <div>
          <label class="block text-gray-400 text-sm mb-2">{{ $t('games.imageUrl') }}</label>
          <BaseInput
            v-model="form.imageUrl"
            type="url"
            :placeholder="$t('games.imageUrlPlaceholder')"
          />
        </div>
      </div>

      <!-- Дополнительные настройки -->
      <div class="space-y-4">
        <h4 class="text-white font-medium">{{ $t('games.additionalSettings') }}</h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center gap-3">
            <input
              v-model="form.isActive"
              type="checkbox"
              id="isActive"
              class="w-4 h-4 text-primary bg-background border-white/10 rounded focus:ring-primary focus:ring-2"
            />
            <label for="isActive" class="text-white text-sm">{{ $t('games.activateAfterCreation') }}</label>
          </div>

          <div class="flex items-center gap-3">
            <input
              v-model="form.isFeatured"
              type="checkbox"
              id="isFeatured"
              class="w-4 h-4 text-primary bg-background border-white/10 rounded focus:ring-primary focus:ring-2"
            />
            <label for="isFeatured" class="text-white text-sm">{{ $t('games.featuredGame') }}</label>
          </div>
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
            {{ $t('games.creating') }}
          </span>
          <span v-else>{{ $t('games.addGame') }}</span>
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseTextarea from '@/components/BaseTextarea.vue'
import { useGamesStore } from '@/stores/games'
import type { Game } from '@/services/api'

interface Props {
  isOpen: boolean
}

interface GameForm {
  name: string
  category: string
  provider: string
  rtp: number
  chance: number
  minBet: number
  maxBet: number
  description: string
  imageUrl: string
  isActive: boolean
  isFeatured: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  gameCreated: [game: Game]
}>()

const gamesStore = useGamesStore()
const isLoading = ref(false)

// Форма
const form = reactive<GameForm>({
  name: '',
  category: '',
  provider: '',
  rtp: 96.5,
  chance: 50,
  minBet: 10,
  maxBet: 50000,
  description: '',
  imageUrl: '',
  isActive: true,
  isFeatured: false
})

// Validation
const isFormValid = computed(() => {
  return form.name.trim() &&
         form.category &&
         form.provider.trim() &&
         form.rtp > 0 && form.rtp <= 100 &&
         form.chance > 0 && form.chance <= 100 &&
         form.minBet > 0 &&
         form.maxBet > 0 &&
         form.maxBet >= form.minBet
})

async function handleSubmit() {
  if (!isFormValid.value) return

  try {
    isLoading.value = true

    const newGame = {
      name: form.name.trim(),
      rtp: form.rtp,
      chance: form.chance
    }

    const createdGameId = await gamesStore.createGame(newGame)

    // Сброс формы
    Object.assign(form, {
      name: '',
      category: '',
      provider: '',
      rtp: 96.5,
      chance: 50,
      minBet: 10,
      maxBet: 50000,
      description: '',
      imageUrl: '',
      isActive: true,
      isFeatured: false
    })

    emit('gameCreated', { id: createdGameId, ...newGame } as Game)
    emit('close')
  } catch (error) {
    console.error('Error creating game:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
