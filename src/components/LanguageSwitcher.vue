<template>
  <div class="relative">
    <!-- Кнопка переключателя -->
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
      :class="{ 'bg-white/10 text-white': isOpen }"
    >
      <span class="text-sm font-medium">{{ localeStore.currentLocaleData.code.toUpperCase() }}</span>
      <svg
        class="w-4 h-4 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Выпадающий список -->
    <div
      v-show="isOpen"
      class="absolute right-0 top-full mt-2 w-48 bg-card-bg border border-white/10 rounded-lg shadow-xl z-50"
      @click.stop
    >
      <div class="py-2">
        <button
          v-for="locale in localeStore.availableLocales"
          :key="locale.code"
          @click="selectLocale(locale.code)"
          class="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          :class="{ 'text-primary bg-primary/10': locale.code === localeStore.currentLocale }"
        >
          <span class="text-lg">{{ locale.flag }}</span>
          <span class="font-medium">{{ locale.name }}</span>
          <svg
            v-if="locale.code === localeStore.currentLocale"
            class="w-4 h-4 ml-auto text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Overlay для закрытия при клике вне -->
    <div
      v-if="isOpen"
      @click="closeDropdown"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useLocaleStore } from '@/stores/locale'

const localeStore = useLocaleStore()
const isOpen = ref(false)

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function closeDropdown() {
  isOpen.value = false
}

function selectLocale(locale: 'ru' | 'en') {
  localeStore.changeLocale(locale)
  closeDropdown()
}

// Закрытие по Escape
function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>
