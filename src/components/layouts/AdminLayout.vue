<template>
  <div class="min-h-screen bg-background">
    <!-- Overlay для мобильной версии -->
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="closeMobileMenu"
    ></div>

    <!-- Сайдбар -->
    <AdminSidebar
      :is-mobile-open="isMobileMenuOpen"
      @close-mobile="closeMobileMenu"
    />

    <!-- Основной контент -->
    <main class="lg:ml-64">
      <!-- Шапка страницы -->
      <header class="bg-card-bg border-b border-white/10 p-3 md:p-6 rounded-lg">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <!-- Кнопка меню для мобильных -->
            <button
              @click="toggleMobileMenu"
              class="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>

            <div>
              <h1 v-if="pageTitle" class="text-xl md:text-2xl font-bold text-white">{{ pageTitle }}</h1>
              <p v-if="pageDescription" class="text-gray-400 mt-1 text-sm md:text-base hidden sm:block">{{ pageDescription }}</p>
            </div>
          </div>

          <!-- Дополнительные действия -->
          <div class="flex items-center gap-2 md:gap-3">
            <slot name="header-actions"></slot>

            <!-- Уведомления -->
            <NotificationsDropdown />

            <!-- Переключатель темы -->
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <!-- Контент страницы -->
      <div class="py-4 md:py-6">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminSidebar from '@/components/AdminSidebar.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import NotificationsDropdown from '@/components/NotificationsDropdown.vue'

interface Props {
  pageTitle?: string
  pageDescription?: string
}

withDefaults(defineProps<Props>(), {
  pageTitle: '',
  pageDescription: '',
})

// Управление мобильным меню
const isMobileMenuOpen = ref(false)

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}
</script>
