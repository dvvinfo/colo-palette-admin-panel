<template>
  <AdminLayout
    :page-title="$t('pages.analytics.title')"
    :page-description="$t('pages.analytics.description')"
  >
    <template #header-actions>
      <BaseButton variant="primary" class="flex items-center gap-2 text-sm md:text-base px-3 md:px-4 py-2">
        <svg class="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <span class="hidden md:inline">{{ $t('analytics.exportReport') }}</span>
      </BaseButton>
    </template>

    <!-- Ключевые метрики -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-xs md:text-sm">{{ $t('analytics.uniqueVisitors') }}</p>
            <p class="text-white text-xl md:text-2xl font-bold">12,543</p>
          </div>
        </div>
      </div>

      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-xs md:text-sm">{{ $t('analytics.profitability') }}</p>
            <p class="text-white text-xl md:text-2xl font-bold">+24.3%</p>
          </div>
        </div>
      </div>

      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-xs md:text-sm">{{ $t('analytics.avgBet') }}</p>
            <p class="text-white text-xl md:text-2xl font-bold">156 ₽</p>
          </div>
        </div>
      </div>

      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center gap-3 md:gap-4">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
          </div>
          <div>
            <p class="text-gray-400 text-xs md:text-sm">{{ $t('analytics.conversion') }}</p>
            <p class="text-white text-xl md:text-2xl font-bold">8.7%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Фильтры по времени -->
    <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg mb-4 md:mb-6">
      <div class="flex flex-col md:flex-row gap-3 md:gap-4">
        <div class="flex-1">
          <label class="block text-gray-400 text-sm mb-2">{{ $t('analytics.period') }}</label>
          <select class="w-full bg-background border border-white/10 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:border-primary focus:outline-none text-sm md:text-base">
            <option value="today">{{ $t('analytics.today') }}</option>
            <option value="yesterday">{{ $t('analytics.yesterday') }}</option>
            <option value="week">{{ $t('analytics.thisWeek') }}</option>
            <option value="month" selected>{{ $t('analytics.thisMonth') }}</option>
            <option value="quarter">{{ $t('analytics.quarter') }}</option>
            <option value="year">{{ $t('analytics.year') }}</option>
          </select>
        </div>

        <div class="w-full sm:w-auto md:w-48">
          <label class="block text-gray-400 text-sm mb-2">{{ $t('analytics.metric') }}</label>
          <select class="w-full bg-background border border-white/10 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:border-primary focus:outline-none text-sm md:text-base">
            <option value="revenue">{{ $t('analytics.revenue') }}</option>
            <option value="users">{{ $t('nav.users') }}</option>
            <option value="games">{{ $t('nav.games') }}</option>
            <option value="transactions">{{ $t('nav.transactions') }}</option>
          </select>
        </div>

        <div class="w-full sm:w-auto md:w-48">
          <label class="block text-gray-400 text-sm mb-2">{{ $t('analytics.grouping') }}</label>
          <select class="w-full bg-background border border-white/10 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-white focus:border-primary focus:outline-none text-sm md:text-base">
            <option value="day">{{ $t('analytics.byDays') }}</option>
            <option value="week">{{ $t('analytics.byWeeks') }}</option>
            <option value="month">{{ $t('analytics.byMonths') }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Графики и диаграммы -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
      <!-- График доходов -->
      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <h3 class="text-lg md:text-xl font-bold text-white mb-4">{{ $t('analytics.revenueDynamics') }}</h3>
        <div class="h-64 flex items-center justify-center border-2 border-dashed border-white/10 rounded-lg">
          <div class="text-center">
            <svg class="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <p class="text-gray-400 text-sm md:text-base">{{ $t('analytics.chartWillBeHere') }}</p>
          </div>
        </div>
      </div>

      <!-- Популярные игры -->
      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <h3 class="text-lg md:text-xl font-bold text-white mb-4">{{ $t('analytics.topGamesByRevenue') }}</h3>
        <div class="h-64 flex items-center justify-center border-2 border-dashed border-white/10 rounded-lg">
          <div class="text-center">
            <svg class="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
            </svg>
            <p class="text-gray-400 text-sm md:text-base">{{ $t('analytics.chartWillBeHere') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Табличные отчеты -->
    <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
      <div class="flex items-center justify-between mb-4 md:mb-6">
        <h2 class="text-xl md:text-2xl font-bold text-white">{{ $t('analytics.detailedAnalytics') }}</h2>
        <BaseButton variant="primary" class="text-sm md:text-base px-3 md:px-4 py-2">
          {{ $t('analytics.refreshData') }}
        </BaseButton>
      </div>

      <div class="text-center py-12">
        <div class="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 md:w-10 md:h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
        </div>
        <h3 class="text-lg md:text-xl font-bold text-white mb-2">{{ $t('analytics.moduleInDevelopment') }}</h3>
        <p class="text-gray-400 text-sm md:text-base mb-6">
          {{ $t('analytics.moduleDescription') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <BaseButton variant="primary">
            {{ $t('analytics.setupNotifications') }}
          </BaseButton>
          <BaseButton variant="outline">
            {{ $t('analytics.viewDemo') }}
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
