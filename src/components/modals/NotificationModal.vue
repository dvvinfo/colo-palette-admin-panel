<template>
  <BaseModal
    :is-open="true"
    :title="$t('notifications.title')"
    @close="$emit('close')"
  >
    <div v-if="notifications.length === 0" class="text-gray-400 text-center py-8">
      {{ $t('notifications.noNotifications') }}
    </div>
    <div v-for="note in notifications" :key="note.id" class="mb-8 last:mb-0">
      <div class="flex justify-between items-center mb-2">
        <div class="font-bold text-white">{{ note.title }}</div>
        <div class="text-gray-400 text-sm">{{ note.date }}</div>
      </div>
      <div class="text-white mb-2" v-html="note.text"></div>
      <div class="flex justify-end">
        <BaseButton
          variant="ghost"
          size="sm"
          @click="$emit('delete', note.id)"
          class="!p-2 text-gray-400 hover:text-red-500"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11 5a1 1 0 00-1 1H8a1 1 0 00-1 1v1h10V7a1 1 0 00-1-1h-2a1 1 0 00-1-1h-2zm4 6H9v6h6v-6zM9 9H7v8c0 1.1.9 2 2 2h6a2 2 0 002-2V9H9z"
              fill="currentColor"
            ></path>
          </svg>
        </BaseButton>
      </div>
    </div>
    <div class="flex justify-end items-center mt-8 text-sm">
      <BaseButton
        variant="ghost"
        @click="$emit('clearAll')"
        class="text-primary underline !p-0"
      >
        {{ $t('notifications.clearAll') }}
      </BaseButton>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from './BaseModal.vue'
import BaseButton from '@/components/BaseButton.vue'


defineProps<{
  notifications: {
    id: number | string
    title: string
    date: string
    text: string
  }[]
}>()
</script>
