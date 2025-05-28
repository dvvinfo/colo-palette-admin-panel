<template>
  <AdminLayout
    page-title="Транзакции"
    page-description="Просмотр и управление финансовыми операциями"
  >
    <template #header-actions>
      <BaseButton variant="primary" class="flex items-center gap-2 text-sm md:text-base px-3 md:px-4 py-2">
        <svg class="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
        <span class="hidden sm:inline">Экспорт отчета</span>
      </BaseButton>
    </template>

    <!-- Статистика транзакций -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-xs md:text-sm">Пополнения</p>
            <p class="text-white text-xl md:text-2xl font-bold">1,234</p>
          </div>
        </div>
      </div>

      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-xs md:text-sm">Выводы</p>
            <p class="text-white text-xl md:text-2xl font-bold">567</p>
          </div>
        </div>
      </div>

      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-xs md:text-sm">Общий оборот</p>
            <p class="text-white text-xl md:text-2xl font-bold">2.4M ₽</p>
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
            <p class="text-gray-400 text-xs md:text-sm">В ожидании</p>
            <p class="text-white text-xl md:text-2xl font-bold">89</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Фильтры -->
    <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg mb-4 md:mb-6">
      <div class="flex flex-col md:flex-row gap-3 md:gap-4">
        <div class="flex-1">
          <label class="block text-gray-400 text-sm mb-2">Поиск транзакций</label>
          <input
            type="text"
            placeholder="ID транзакции, пользователь..."
            class="w-full bg-background border border-white/10 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none text-sm md:text-base"
          />
        </div>

        <div class="w-full sm:w-auto md:w-48">
          <label class="block text-gray-400 text-sm mb-2">Тип</label>
          <select class="w-full bg-background border border-white/10 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:border-primary focus:outline-none text-sm md:text-base">
            <option value="">Все типы</option>
            <option value="deposit">Пополнение</option>
            <option value="withdrawal">Вывод</option>
            <option value="bonus">Бонус</option>
          </select>
        </div>

        <div class="w-full sm:w-auto md:w-48">
          <label class="block text-gray-400 text-sm mb-2">Статус</label>
          <select class="w-full bg-background border border-white/10 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:border-primary focus:outline-none text-sm md:text-base">
            <option value="">Все статусы</option>
            <option value="completed">Завершено</option>
            <option value="pending">В ожидании</option>
            <option value="failed">Отклонено</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Таблица транзакций -->
    <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
      <div class="flex items-center justify-between mb-4 md:mb-6">
        <h2 class="text-xl md:text-2xl font-bold text-white">История транзакций</h2>
        <BaseButton variant="primary" class="text-sm md:text-base px-3 md:px-4 py-2">
          Обновить
        </BaseButton>
      </div>

      <div class="text-center py-12">
        <div class="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-yellow-500/20 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 md:w-10 md:h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-lg md:text-xl font-bold text-white mb-2">В разработке</h3>
        <p class="text-gray-400 text-sm md:text-base mb-6">
          Раздел управления транзакциями находится в разработке.<br>
          Скоро здесь будет полная функциональность.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <BaseButton variant="primary">
            Уведомить о готовности
          </BaseButton>
          <BaseButton variant="outline">
            Вернуться к дашборду
          </BaseButton>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layouts/AdminLayout.vue'
import BaseButton from '@/components/BaseButton.vue'
</script>
