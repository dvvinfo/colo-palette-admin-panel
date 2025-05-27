<template>
  <AdminLayout
    page-title="Настройки системы"
    page-description="Конфигурация и управление параметрами платформы"
  >
    <template #header-actions>
      <BaseButton variant="primary" class="flex items-center gap-2 text-sm md:text-base px-3 md:px-4 py-2">
        <svg class="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
        </svg>
        <span class="hidden sm:inline">Сохранить изменения</span>
      </BaseButton>
    </template>

    <!-- Навигация по категориям настроек -->
    <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg mb-4 md:mb-6">
      <div class="flex flex-wrap gap-2 md:gap-3">
        <BaseButton
          variant="primary"
          size="sm"
          class="text-xs md:text-sm px-3 md:px-4 py-2"
        >
          Основные
        </BaseButton>
        <BaseButton
          variant="ghost"
          size="sm"
          class="text-xs md:text-sm px-3 md:px-4 py-2"
        >
          Безопасность
        </BaseButton>
        <BaseButton
          variant="ghost"
          size="sm"
          class="text-xs md:text-sm px-3 md:px-4 py-2"
        >
          Платежи
        </BaseButton>
        <BaseButton
          variant="ghost"
          size="sm"
          class="text-xs md:text-sm px-3 md:px-4 py-2"
        >
          Уведомления
        </BaseButton>
        <BaseButton
          variant="ghost"
          size="sm"
          class="text-xs md:text-sm px-3 md:px-4 py-2"
        >
          Интеграции
        </BaseButton>
      </div>
    </div>

    <!-- Основные настройки -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
      <!-- Общие настройки -->
      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <h3 class="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">Основные параметры</h3>

        <div class="space-y-4 md:space-y-6">
          <div>
            <label class="block text-gray-400 text-sm mb-2">Название платформы</label>
            <input
              type="text"
              value="Casino Admin Panel"
              class="w-full bg-background border border-white/10 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:border-primary focus:outline-none text-sm md:text-base"
            />
          </div>

          <div>
            <label class="block text-gray-400 text-sm mb-2">Часовой пояс</label>
            <select class="w-full bg-background border border-white/10 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:border-primary focus:outline-none text-sm md:text-base">
              <option value="Europe/Moscow" selected>Moscow (UTC+3)</option>
              <option value="Europe/London">London (UTC+0)</option>
              <option value="America/New_York">New York (UTC-5)</option>
              <option value="Asia/Tokyo">Tokyo (UTC+9)</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-400 text-sm mb-2">Валюта по умолчанию</label>
            <select class="w-full bg-background border border-white/10 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:border-primary focus:outline-none text-sm md:text-base">
              <option value="RUB" selected>Российский рубль (₽)</option>
              <option value="USD">Доллар США ($)</option>
              <option value="EUR">Евро (€)</option>
              <option value="BTC">Bitcoin (₿)</option>
            </select>
          </div>

          <div class="flex items-center gap-3">
            <input
              type="checkbox"
              id="maintenance"
              class="w-4 h-4 text-primary bg-background border-white/10 rounded focus:ring-primary focus:ring-2"
            />
            <label for="maintenance" class="text-white text-sm md:text-base">Режим технического обслуживания</label>
          </div>
        </div>
      </div>

      <!-- Настройки игр -->
      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <h3 class="text-lg md:text-xl font-bold text-white mb-4 md:mb-6">Настройки игр</h3>

        <div class="space-y-4 md:space-y-6">
          <div>
            <label class="block text-gray-400 text-sm mb-2">Минимальная ставка (₽)</label>
            <input
              type="number"
              value="10"
              min="1"
              class="w-full bg-background border border-white/10 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:border-primary focus:outline-none text-sm md:text-base"
            />
          </div>

          <div>
            <label class="block text-gray-400 text-sm mb-2">Максимальная ставка (₽)</label>
            <input
              type="number"
              value="50000"
              min="1"
              class="w-full bg-background border border-white/10 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:border-primary focus:outline-none text-sm md:text-base"
            />
          </div>

          <div>
            <label class="block text-gray-400 text-sm mb-2">Максимальный выигрыш (₽)</label>
            <input
              type="number"
              value="1000000"
              min="1"
              class="w-full bg-background border border-white/10 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:border-primary focus:outline-none text-sm md:text-base"
            />
          </div>

          <div class="flex items-center gap-3">
            <input
              type="checkbox"
              id="autoplay"
              checked
              class="w-4 h-4 text-primary bg-background border-white/10 rounded focus:ring-primary focus:ring-2"
            />
            <label for="autoplay" class="text-white text-sm md:text-base">Разрешить автоигру</label>
          </div>
        </div>
      </div>
    </div>

    <!-- Статистика и логи -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-xs md:text-sm">Состояние системы</p>
            <p class="text-green-400 text-base md:text-lg font-bold">Работает</p>
          </div>
        </div>
      </div>

      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-xs md:text-sm">База данных</p>
            <p class="text-blue-400 text-base md:text-lg font-bold">97.2 GB</p>
          </div>
        </div>
      </div>

      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-xs md:text-sm">Время работы</p>
            <p class="text-yellow-400 text-base md:text-lg font-bold">47 дней</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Расширенные настройки -->
    <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
      <div class="flex items-center justify-between mb-4 md:mb-6">
        <h2 class="text-xl md:text-2xl font-bold text-white">Дополнительные параметры</h2>
        <BaseButton variant="outline" size="sm" class="text-sm md:text-base px-3 md:px-4 py-2">
          Сбросить к умолчанию
        </BaseButton>
      </div>

      <div class="text-center py-12">
        <div class="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 md:w-10 md:h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <h3 class="text-lg md:text-xl font-bold text-white mb-2">Расширенные настройки в разработке</h3>
        <p class="text-gray-400 text-sm md:text-base mb-6">
          Дополнительные параметры конфигурации системы.<br>
          API настройки, интеграции с внешними сервисами и многое другое.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <BaseButton variant="primary">
            Запросить функционал
          </BaseButton>
          <BaseButton variant="outline">
            Документация
          </BaseButton>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/AdminLayout.vue'
import BaseButton from '@/components/BaseButton.vue'
</script>
