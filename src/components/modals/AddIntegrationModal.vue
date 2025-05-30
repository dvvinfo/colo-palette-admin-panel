<template>
  <BaseModal
    :is-open="isOpen"
    :title="$t('modals.addIntegration.title')"
    :max-width="'max-w-3xl'"
    @close="$emit('close')"
  >
    <div class="space-y-6">
      <p class="text-gray-400 text-sm">{{ $t('modals.addIntegration.selectType') }}</p>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Категория интеграции -->
        <div>
          <label class="block text-gray-400 text-sm font-medium mb-3">{{ $t('settings.category') }}</label>
          <div class="grid grid-cols-2 gap-3">
            <BaseButton
              v-for="category in integrationCategories"
              :key="category.id"
              @click="selectedCategory = category.id"
              :variant="selectedCategory === category.id ? 'primary' : 'ghost'"
              class="!p-4 !justify-start !h-auto border transition-all text-left"
              :class="selectedCategory === category.id
                ? 'border-primary bg-primary/10 text-white'
                : 'border-white/10 bg-background text-gray-300 hover:border-white/20'"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center"
                     :class="category.iconBg">
                  <span class="text-sm font-bold" :class="category.iconColor">{{ category.icon }}</span>
                </div>
                <div>
                  <div class="font-medium">{{ category.name }}</div>
                  <div class="text-xs text-gray-400">{{ category.description }}</div>
                </div>
              </div>
            </BaseButton>
          </div>
        </div>

        <!-- Тип интеграции -->
        <div v-if="selectedCategory">
          <label class="block text-gray-400 text-sm font-medium mb-3">{{ $t('settings.service') }}</label>
          <div class="grid grid-cols-1 gap-3">
            <BaseButton
              v-for="service in availableServices"
              :key="service.id"
              @click="selectedService = service.id"
              :variant="selectedService === service.id ? 'primary' : 'ghost'"
              class="!p-4 !justify-start !h-auto border transition-all text-left"
              :class="selectedService === service.id
                ? 'border-primary bg-primary/10 text-white'
                : 'border-white/10 bg-background text-gray-300 hover:border-white/20'"
            >
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                       :class="service.iconBg">
                    <span class="text-base font-bold" :class="service.iconColor">{{ service.icon }}</span>
                  </div>
                  <div>
                    <div class="font-medium">{{ service.name }}</div>
                    <div class="text-xs text-gray-400">{{ service.description }}</div>
                  </div>
                </div>
                <div class="text-xs px-2 py-1 rounded-full"
                     :class="service.difficulty === 'easy'
                       ? 'bg-green-500/20 text-green-400'
                       : service.difficulty === 'medium'
                       ? 'bg-yellow-500/20 text-yellow-400'
                       : 'bg-red-500/20 text-red-400'">
                  {{ getDifficultyLabel(service.difficulty) }}
                </div>
              </div>
            </BaseButton>
          </div>
        </div>

        <!-- Настройки интеграции -->
        <div v-if="selectedService">
          <label class="block text-gray-400 text-sm font-medium mb-3">{{ $t('modals.addIntegration.configureSettings') }}</label>
          <div class="space-y-4">
            <div>
              <label class="block text-gray-400 text-sm mb-2">{{ $t('settings.integrationName') }}</label>
              <BaseInput
                v-model="integrationName"
                type="text"
                :placeholder="$t('settings.integrationNamePlaceholder')"
              />
            </div>

            <div v-if="selectedServiceData?.requiresApiKey">
              <label class="block text-gray-400 text-sm mb-2">{{ $t('settings.apiKey') }}</label>
              <BaseInput
                v-model="apiKey"
                type="password"
                :placeholder="$t('settings.apiKeyPlaceholder')"
              />
            </div>

            <div v-if="selectedServiceData?.requiresWebhookUrl">
              <label class="block text-gray-400 text-sm mb-2">{{ $t('settings.webhookUrl') }}</label>
              <BaseInput
                v-model="webhookUrl"
                type="url"
                :placeholder="$t('settings.webhookUrlPlaceholder')"
              />
            </div>

            <div>
              <label class="block text-gray-400 text-sm mb-2">{{ $t('common.description') }}</label>
              <BaseTextarea
                v-model="description"
                rows="3"
                :placeholder="$t('settings.integrationDescriptionPlaceholder')"
              />
            </div>

            <div class="flex items-center gap-3">
              <input
                v-model="autoEnable"
                type="checkbox"
                id="auto-enable"
                class="w-4 h-4 text-primary bg-background border-white/10 rounded focus:ring-primary focus:ring-2"
              />
              <label for="auto-enable" class="text-white text-sm">{{ $t('settings.autoEnableIntegration') }}</label>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <BaseButton
            type="button"
            variant="ghost"
            @click="$emit('close')"
          >
            {{ $t('common.cancel') }}
          </BaseButton>
          <BaseButton
            type="submit"
            variant="primary"
            :disabled="!canSubmit"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            {{ $t('modals.addIntegration.add') }}
          </BaseButton>
        </div>
      </form>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseModal from './BaseModal.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseTextarea from '@/components/BaseTextarea.vue'

interface Props {
  isOpen: boolean
}

interface IntegrationCategory {
  id: string
  name: string
  description: string
  icon: string
  iconBg: string
  iconColor: string
}

interface IntegrationService {
  id: string
  name: string
  description: string
  icon: string
  iconBg: string
  iconColor: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  requiresApiKey?: boolean
  requiresWebhookUrl?: boolean
}

interface Integration {
  id: string
  name: string
  service: string
  category: string
  description: string
  apiKey: string
  webhookUrl: string
  enabled: boolean
  createdAt: Date
}

const { t } = useI18n()

defineProps<Props>()

const emit = defineEmits<{
  close: []
  integrationAdded: [integration: Integration]
}>()

// Reactive data
const selectedCategory = ref<string>('')
const selectedService = ref<string>('')
const integrationName = ref('')
const apiKey = ref('')
const webhookUrl = ref('')
const description = ref('')
const autoEnable = ref(true)

// Categories
const integrationCategories: IntegrationCategory[] = [
  {
    id: 'payments',
    name: t('settings.paymentSystems'),
    description: t('settings.paymentSystemsDescription'),
    icon: '💳',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400'
  },
  {
    id: 'analytics',
    name: t('settings.analyticsAndMonitoring'),
    description: t('settings.analyticsDescription'),
    icon: '📊',
    iconBg: 'bg-green-500/20',
    iconColor: 'text-green-400'
  },
  {
    id: 'notifications',
    name: t('settings.notificationsIntegration'),
    description: t('settings.notificationsDescription'),
    icon: '📱',
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-400'
  },
  {
    id: 'webhooks',
    name: t('settings.externalApiAccess'),
    description: t('settings.apiDescription'),
    icon: '🔗',
    iconBg: 'bg-orange-500/20',
    iconColor: 'text-orange-400'
  }
]

// Services
const allServices: IntegrationService[] = [
  // Платежи
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Онлайн платежи',
    icon: 'S',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    category: 'payments',
    difficulty: 'easy',
    requiresApiKey: true
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Международные платежи',
    icon: 'P',
    iconBg: 'bg-blue-600/20',
    iconColor: 'text-blue-300',
    category: 'payments',
    difficulty: 'medium',
    requiresApiKey: true
  },
  // Аналитика
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Веб-аналитика',
    icon: 'G',
    iconBg: 'bg-red-500/20',
    iconColor: 'text-red-400',
    category: 'analytics',
    difficulty: 'easy',
    requiresApiKey: true
  },
  {
    id: 'mixpanel',
    name: 'Mixpanel',
    description: 'Event tracking',
    icon: 'M',
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
    category: 'analytics',
    difficulty: 'medium',
    requiresApiKey: true
  },
  // Уведомления
  {
    id: 'telegram',
    name: 'Telegram Bot',
    description: 'Бот уведомления',
    icon: 'T',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    category: 'notifications',
    difficulty: 'easy',
    requiresApiKey: true
  },
  {
    id: 'email',
    name: 'Email Service',
    description: 'SMTP сервер',
    icon: '@',
    iconBg: 'bg-red-500/20',
    iconColor: 'text-red-400',
    category: 'notifications',
    difficulty: 'medium',
    requiresApiKey: true
  },
  // API/Webhooks
  {
    id: 'discord',
    name: 'Discord Webhooks',
    description: 'Уведомления в Discord',
    icon: 'D',
    iconBg: 'bg-gray-500/20',
    iconColor: 'text-gray-400',
    category: 'webhooks',
    difficulty: 'easy',
    requiresWebhookUrl: true
  },
  {
    id: 'slack',
    name: 'Slack Integration',
    description: 'Рабочие уведомления',
    icon: 'S',
    iconBg: 'bg-green-500/20',
    iconColor: 'text-green-400',
    category: 'webhooks',
    difficulty: 'medium',
    requiresWebhookUrl: true
  }
]

// Computed
const availableServices = computed(() => {
  return allServices.filter(service => service.category === selectedCategory.value)
})

const selectedServiceData = computed(() => {
  return allServices.find(service => service.id === selectedService.value)
})

const canSubmit = computed(() => {
  if (!selectedService.value || !integrationName.value) return false

  const service = selectedServiceData.value
  if (!service) return false

  if (service.requiresApiKey && !apiKey.value) return false
  if (service.requiresWebhookUrl && !webhookUrl.value) return false

  return true
})

// Methods
function getDifficultyLabel(difficulty: string): string {
  const labels = {
    easy: t('settings.difficultyEasy'),
    medium: t('settings.difficultyMedium'),
    hard: t('settings.difficultyHard')
  }
  return labels[difficulty as keyof typeof labels] || difficulty
}

function handleSubmit() {
  if (!canSubmit.value) return

  const integration = {
    id: `${selectedService.value}-${Date.now()}`,
    name: integrationName.value,
    service: selectedService.value,
    category: selectedCategory.value,
    description: description.value,
    apiKey: apiKey.value,
    webhookUrl: webhookUrl.value,
    enabled: autoEnable.value,
    createdAt: new Date()
  }

  emit('integrationAdded', integration)
  resetForm()
}

function resetForm() {
  selectedCategory.value = ''
  selectedService.value = ''
  integrationName.value = ''
  apiKey.value = ''
  webhookUrl.value = ''
  description.value = ''
  autoEnable.value = true
}
</script>
