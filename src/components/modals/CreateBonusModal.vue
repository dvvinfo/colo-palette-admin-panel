<template>
  <BaseModal
    :is-open="isOpen"
    :title="'Создать новый бонус'"
    max-width="max-w-4xl"
    @close="$emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Основная информация -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="md:col-span-2">
          <label class="block text-gray-400 text-sm mb-2">Название бонуса *</label>
          <input
            v-model="form.title"
            type="text"
            required
            placeholder="Например: Приветственный бонус 100%"
            class="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-gray-400 text-sm mb-2">Описание *</label>
          <textarea
            v-model="form.description"
            required
            rows="3"
            placeholder="Подробное описание условий получения бонуса"
            class="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none resize-none"
          />
        </div>

        <div>
          <label class="block text-gray-400 text-sm mb-2">Тип бонуса *</label>
          <select
            v-model="form.type"
            required
            class="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
            @change="onBonusTypeChange"
          >
            <option value="">Выберите тип</option>
            <option value="welcome">Приветственный</option>
            <option value="reload">Пополнение</option>
            <option value="cashback">Кэшбэк</option>
            <option value="loyalty">Лояльность</option>
            <option value="promocode">Промокод</option>
            <option value="freespins">Фриспины</option>
          </select>
        </div>

        <div>
          <label class="block text-gray-400 text-sm mb-2">Тип награды *</label>
          <select
            v-model="form.bonusType"
            required
            class="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
            @change="onBonusRewardTypeChange"
          >
            <option value="">Выберите тип награды</option>
            <option value="percentage">Процент (%)</option>
            <option value="fixed">Фиксированная сумма (₽)</option>
            <option value="freespins">Фриспины</option>
          </select>
        </div>
      </div>

      <!-- Значения бонуса -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-if="form.bonusType === 'percentage'">
          <label class="block text-gray-400 text-sm mb-2">Процент бонуса *</label>
          <div class="relative">
            <input
              v-model.number="form.bonusValue"
              type="number"
              required
              min="1"
              max="500"
              placeholder="100"
              class="w-full bg-background border border-white/10 rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-400 focus:border-primary focus:outline-none"
            />
            <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
          </div>
        </div>

        <div v-if="form.bonusType === 'fixed'">
          <label class="block text-gray-400 text-sm mb-2">Сумма бонуса *</label>
          <div class="relative">
            <input
              v-model.number="form.bonusValue"
              type="number"
              required
              min="1"
              placeholder="5000"
              class="w-full bg-background border border-white/10 rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-400 focus:border-primary focus:outline-none"
            />
            <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">₽</span>
          </div>
        </div>

        <div v-if="form.bonusType === 'freespins'">
          <label class="block text-gray-400 text-sm mb-2">Количество фриспинов *</label>
          <input
            v-model.number="form.freeSpinsCount"
            type="number"
            required
            min="1"
            placeholder="50"
            class="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-gray-400 text-sm mb-2">Требование по отыгрышу *</label>
          <div class="relative">
            <input
              v-model.number="form.wagerRequirement"
              type="number"
              required
              min="1"
              max="100"
              placeholder="40"
              class="w-full bg-background border border-white/10 rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-400 focus:border-primary focus:outline-none"
            />
            <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">x</span>
          </div>
        </div>
      </div>

      <!-- Условия получения -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-if="form.bonusType !== 'freespins'">
          <label class="block text-gray-400 text-sm mb-2">Минимальный депозит</label>
          <div class="relative">
            <input
              v-model.number="form.minDeposit"
              type="number"
              min="1"
              placeholder="1000"
              class="w-full bg-background border border-white/10 rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-400 focus:border-primary focus:outline-none"
            />
            <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">₽</span>
          </div>
        </div>

        <div v-if="form.bonusType === 'percentage'">
          <label class="block text-gray-400 text-sm mb-2">Максимальный бонус</label>
          <div class="relative">
            <input
              v-model.number="form.maxBonus"
              type="number"
              min="1"
              placeholder="50000"
              class="w-full bg-background border border-white/10 rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-400 focus:border-primary focus:outline-none"
            />
            <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">₽</span>
          </div>
        </div>
      </div>

      <!-- Даты -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-gray-400 text-sm mb-2">Дата начала *</label>
          <input
            v-model="form.startDate"
            type="datetime-local"
            required
            class="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-gray-400 text-sm mb-2">Дата окончания</label>
          <input
            v-model="form.endDate"
            type="datetime-local"
            class="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <!-- Промокод (если тип промокод) -->
      <div v-if="form.type === 'promocode'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-gray-400 text-sm mb-2">Промокод *</label>
          <div class="flex gap-2">
            <input
              v-model="form.promocode"
              type="text"
              required
              placeholder="MEGA2024"
              class="flex-1 bg-background border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none uppercase"
            />
            <BaseButton
              type="button"
              variant="outline"
              @click="generatePromocode"
              class="px-4 py-3"
            >
              Генерировать
            </BaseButton>
          </div>
        </div>

        <div>
          <label class="block text-gray-400 text-sm mb-2">Максимальное количество использований</label>
          <input
            v-model.number="form.maxUses"
            type="number"
            min="1"
            placeholder="1000"
            class="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <!-- Ограничения -->
      <div class="space-y-4">
        <h4 class="text-white font-medium">Ограничения доступа</h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-gray-400 text-sm mb-2">Минимальный уровень игрока</label>
            <select
              v-model="form.minLevel"
              class="w-full bg-background border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
            >
              <option :value="undefined">Без ограничений</option>
              <option :value="1">Уровень 1+</option>
              <option :value="2">Уровень 2+</option>
              <option :value="3">Уровень 3+</option>
              <option :value="5">Уровень 5+</option>
              <option :value="10">Уровень 10+</option>
            </select>
          </div>

          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <input
                v-model="form.vipOnly"
                type="checkbox"
                id="vipOnly"
                class="w-4 h-4 text-primary bg-background border-white/10 rounded focus:ring-primary focus:ring-2"
              />
              <label for="vipOnly" class="text-white text-sm">Только для VIP игроков</label>
            </div>

            <div class="flex items-center gap-3">
              <input
                v-model="form.newPlayersOnly"
                type="checkbox"
                id="newPlayersOnly"
                class="w-4 h-4 text-primary bg-background border-white/10 rounded focus:ring-primary focus:ring-2"
              />
              <label for="newPlayersOnly" class="text-white text-sm">Только для новых игроков</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Игры для фриспинов -->
      <div v-if="form.bonusType === 'freespins'" class="space-y-4">
        <h4 class="text-white font-medium">Доступные игры</h4>
        <div>
          <label class="block text-gray-400 text-sm mb-2">Выберите игры для фриспинов</label>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-32 overflow-y-auto border border-white/10 rounded-lg p-3">
            <div v-for="game in availableGames" :key="game" class="flex items-center gap-2">
              <input
                :id="`game-${game}`"
                v-model="form.allowedGames"
                type="checkbox"
                :value="game"
                class="w-4 h-4 text-primary bg-background border-white/10 rounded focus:ring-primary focus:ring-2"
              />
              <label :for="`game-${game}`" class="text-white text-sm">{{ game }}</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Кнопки -->
      <div class="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
        <BaseButton
          type="button"
          variant="outline"
          @click="$emit('close')"
          :disabled="isLoading"
        >
          Отмена
        </BaseButton>
        <BaseButton
          type="submit"
          variant="primary"
          :disabled="isLoading || !isFormValid"
          class="min-w-[120px]"
        >
          <span v-if="isLoading" class="flex items-center gap-2">
            <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Создание...
          </span>
          <span v-else>Создать бонус</span>
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useBonusesStore, type BonusForm } from '@/stores/bonuses'

interface Props {
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  bonusCreated: []
}>()

const bonusesStore = useBonusesStore()
const isLoading = ref(false)

// Доступные игры для фриспинов
const availableGames = [
  'Book of Ra',
  'Sizzling Hot',
  'Lucky Lady\'s Charm',
  'Dolphin\'s Pearl',
  'Columbus',
  'Mega Joker',
  'Starburst',
  'Gonzo\'s Quest',
  'Dead or Alive',
  'Reactoonz'
]

// Форма
const form = reactive<BonusForm>({
  title: '',
  description: '',
  type: '' as BonusForm['type'],
  bonusType: '' as BonusForm['bonusType'],
  bonusValue: 0,
  freeSpinsCount: undefined,
  minDeposit: undefined,
  maxBonus: undefined,
  wagerRequirement: 40,
  startDate: new Date().toISOString().slice(0, 16),
  endDate: undefined,
  promocode: '',
  maxUses: undefined,
  minLevel: undefined,
  vipOnly: false,
  newPlayersOnly: false,
  allowedGames: []
})

// Validation
const isFormValid = computed(() => {
  const baseValid = form.title &&
                   form.description &&
                   form.type &&
                   form.bonusType &&
                   form.wagerRequirement > 0 &&
                   form.startDate

  if (form.bonusType === 'percentage' || form.bonusType === 'fixed') {
    return baseValid && form.bonusValue > 0
  }

  if (form.bonusType === 'freespins') {
    return baseValid && form.freeSpinsCount && form.freeSpinsCount > 0 && form.allowedGames && form.allowedGames.length > 0
  }

  if (form.type === 'promocode') {
    return baseValid && form.promocode
  }

  return baseValid
})

// Event handlers
function onBonusTypeChange() {
  // Сброс некоторых полей при смене типа
  if (form.type === 'promocode') {
    form.bonusType = 'fixed'
  } else if (form.type === 'freespins') {
    form.bonusType = 'freespins'
  }
}

function onBonusRewardTypeChange() {
  // Сброс значений при смене типа награды
  form.bonusValue = 0
  form.freeSpinsCount = undefined
  form.allowedGames = []
}

function generatePromocode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  form.promocode = result
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
      bonusType: '' as BonusForm['bonusType'],
      bonusValue: 0,
      freeSpinsCount: undefined,
      minDeposit: undefined,
      maxBonus: undefined,
      wagerRequirement: 40,
      startDate: new Date().toISOString().slice(0, 16),
      endDate: undefined,
      promocode: '',
      maxUses: undefined,
      minLevel: undefined,
      vipOnly: false,
      newPlayersOnly: false,
      allowedGames: []
    })

    emit('bonusCreated')
    emit('close')
  } catch (error) {
    console.error('Error creating bonus:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
