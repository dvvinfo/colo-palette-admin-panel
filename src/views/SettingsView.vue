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
          :variant="activeTab === 'general' ? 'primary' : 'ghost'"
          size="sm"
          class="text-xs md:text-sm px-3 md:px-4 py-2"
          @click="activeTab = 'general'"
        >
          Основные
        </BaseButton>
        <BaseButton
          :variant="activeTab === 'security' ? 'primary' : 'ghost'"
          size="sm"
          class="text-xs md:text-sm px-3 md:px-4 py-2"
          @click="activeTab = 'security'"
        >
          Безопасность
        </BaseButton>
        <BaseButton
          :variant="activeTab === 'backups' ? 'primary' : 'ghost'"
          size="sm"
          class="text-xs md:text-sm px-3 md:px-4 py-2"
          @click="activeTab = 'backups'"
        >
          Бэкапы
        </BaseButton>
        <BaseButton
          variant="ghost"
          size="sm"
          class="text-xs md:text-sm px-3 md:px-4 py-2"
          disabled
        >
          Платежи
        </BaseButton>
        <BaseButton
          :variant="activeTab === 'notifications' ? 'primary' : 'ghost'"
          size="sm"
          class="text-xs md:text-sm px-3 md:px-4 py-2 relative"
          @click="activeTab = 'notifications'"
        >
          Уведомления
          <span
            v-if="notificationsStore.unreadCount > 0"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1"
          >
            {{ notificationsStore.unreadCount > 99 ? '99+' : notificationsStore.unreadCount }}
          </span>
        </BaseButton>
        <BaseButton
          variant="ghost"
          size="sm"
          class="text-xs md:text-sm px-3 md:px-4 py-2"
          disabled
        >
          Интеграции
        </BaseButton>
      </div>
    </div>

    <!-- Вкладка "Основные настройки" -->
    <div v-if="activeTab === 'general'" class="space-y-6">
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
    </div>

    <!-- Вкладка "Безопасность" -->
    <div v-if="activeTab === 'security'" class="space-y-6">
      <!-- Быстрый переключатель reCAPTCHA -->
      <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg md:text-xl font-bold text-white">Быстрое управление</h3>
            <p class="text-gray-400 text-sm mt-1">Мгновенное включение/отключение защиты</p>
          </div>
          <div class="flex items-center gap-3 bg-background px-4 py-2 rounded-lg border border-white/10">
            <span class="text-white text-sm">reCAPTCHA:</span>
            <button
              @click="recaptchaStore.setEnabled(!recaptchaStore.isEnabled)"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              :class="recaptchaStore.isEnabled ? 'bg-primary' : 'bg-gray-600'"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="recaptchaStore.isEnabled ? 'translate-x-6' : 'translate-x-1'"
              />
            </button>
            <span class="text-sm" :class="recaptchaStore.isEnabled ? 'text-green-400' : 'text-gray-400'">
              {{ recaptchaStore.isEnabled ? 'ВКЛ' : 'ВЫКЛ' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Статистика reCAPTCHA -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-primary">{{ recaptchaStats.totalVerifications }}</div>
              <div class="text-gray-400 text-sm">Всего проверок</div>
            </div>
            <div class="p-3 bg-green-500/20 rounded-full">
              <svg class="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-primary">{{ recaptchaStats.activeTokens.length }}</div>
              <div class="text-gray-400 text-sm">Активных токенов</div>
            </div>
            <div class="p-3 bg-blue-500/20 rounded-full">
              <svg class="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-primary">
                {{ recaptchaStats.lastVerification ? formatDate(recaptchaStats.lastVerification) : 'Нет' }}
              </div>
              <div class="text-gray-400 text-sm">Последняя проверка</div>
            </div>
            <div class="p-3 bg-purple-500/20 rounded-full">
              <svg class="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Настройки reCAPTCHA -->
      <RecaptchaSettings />
    </div>

    <!-- Вкладка "Уведомления" -->
    <div v-if="activeTab === 'notifications'" class="space-y-6">
      <!-- Заголовок и быстрые действия -->
      <div class="bg-background rounded-2xl p-4 md:p-6 shadow-lg border border-white/10">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg md:text-xl font-bold text-white">Управление уведомлениями</h3>
            <p class="text-gray-400 text-sm mt-1">Центр управления всеми уведомлениями системы</p>
          </div>
          <div class="flex items-center gap-3">
            <BaseButton
              @click="notificationsStore.simulateNewNotification"
              variant="outline"
              size="sm"
              class="text-xs md:text-sm px-3 md:px-4 py-2"
            >
              + Тест
            </BaseButton>
            <BaseButton
              v-if="notificationsStore.unreadCount > 0"
              @click="notificationsStore.markAllAsRead"
              variant="primary"
              size="sm"
              class="text-xs md:text-sm px-3 md:px-4 py-2"
            >
              Отметить все как прочитанные
            </BaseButton>
          </div>
        </div>

        <!-- Статистика уведомлений -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-card-bg rounded-lg p-4 border border-white/10">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xl font-bold text-white">{{ notificationsStore.notifications.length }}</div>
                <div class="text-gray-400 text-sm">Всего</div>
              </div>
              <div class="p-2 bg-blue-500/20 rounded-lg">
                <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-card-bg rounded-lg p-4 border border-white/10">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xl font-bold text-red-400">{{ notificationsStore.unreadCount }}</div>
                <div class="text-gray-400 text-sm">Непрочитанные</div>
              </div>
              <div class="p-2 bg-red-500/20 rounded-lg">
                <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-card-bg rounded-lg p-4 border border-white/10">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xl font-bold text-green-400">{{ readCount }}</div>
                <div class="text-gray-400 text-sm">Прочитанные</div>
              </div>
              <div class="p-2 bg-green-500/20 rounded-lg">
                <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-card-bg rounded-lg p-4 border border-white/10">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xl font-bold text-purple-400">{{ todayCount }}</div>
                <div class="text-gray-400 text-sm">Сегодня</div>
              </div>
              <div class="p-2 bg-purple-500/20 rounded-lg">
                <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Список уведомлений -->
      <div class="bg-background rounded-2xl p-4 md:p-6 shadow-lg border border-white/10">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg md:text-xl font-bold text-white">Все уведомления</h3>
          <div class="flex items-center gap-3">
            <!-- Фильтр по типу -->
            <select
              v-model="selectedFilter"
              class="bg-card-bg border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary focus:outline-none"
            >
              <option value="">Все типы</option>
              <option value="info">Информация</option>
              <option value="success">Успех</option>
              <option value="warning">Предупреждение</option>
              <option value="error">Ошибка</option>
              <option value="user">Пользователь</option>
              <option value="system">Система</option>
            </select>

            <!-- Фильтр по статусу -->
            <select
              v-model="selectedStatus"
              class="bg-card-bg border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary focus:outline-none"
            >
              <option value="">Все</option>
              <option value="unread">Непрочитанные</option>
              <option value="read">Прочитанные</option>
            </select>

            <BaseButton
              v-if="notificationsStore.notifications.length > 0"
              @click="notificationsStore.clearAllNotifications"
              variant="outline"
              size="sm"
              class="text-xs md:text-sm px-3 md:px-4 py-2 text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
            >
              Очистить все
            </BaseButton>
          </div>
        </div>

        <!-- Список уведомлений -->
        <div class="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
          <div v-if="filteredNotifications.length === 0" class="text-center py-12">
            <div class="w-16 h-16 mx-auto mb-4 bg-gray-600/20 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
            </div>
            <p class="text-gray-400">Нет уведомлений для отображения</p>
          </div>

          <div
            v-for="notification in filteredNotifications"
            :key="notification.id"
            class="p-4 bg-card-bg rounded-lg  transition-all hover:border-primary/30 group cursor-pointer"
            :class="{
              'border-white/10': notification.read,
              'border-primary/20 bg-primary/5': !notification.read
            }"
            @click="handleNotificationClick(notification)"
          >
            <div class="flex items-start gap-4">
              <!-- Иконка типа уведомления -->
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                :class="getNotificationIconClass(notification.type)"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="getNotificationIconPath(notification.type)"
                  />
                </svg>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1">
                    <h4 class="text-white font-medium mb-1">{{ notification.title }}</h4>
                    <p class="text-gray-400 text-sm mb-2">{{ notification.message }}</p>
                    <p class="text-gray-500 text-xs">{{ formatTime(notification.createdAt) }}</p>
                  </div>

                  <!-- Кнопки действий -->
                  <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <!-- Индикатор непрочитанного -->
                    <div
                      v-if="!notification.read"
                      class="w-3 h-3 bg-primary rounded-full flex-shrink-0"
                      title="Непрочитанное"
                    ></div>

                    <!-- Кнопка отметить как прочитанное/непрочитанное -->
                    <button
                      @click.stop="toggleReadStatus(notification)"
                      class="p-1 text-gray-500 hover:text-primary transition-colors"
                      :title="notification.read ? 'Отметить как непрочитанное' : 'Отметить как прочитанное'"
                    >
                      <svg v-if="notification.read" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </button>

                    <!-- Кнопка удаления -->
                    <button
                      @click.stop="notificationsStore.removeNotification(notification.id)"
                      class="p-1 text-gray-500 hover:text-red-400 transition-colors"
                      title="Удалить уведомление"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Вкладка "Бэкапы" -->
    <div v-if="activeTab === 'backups'" class="space-y-6">
      <!-- Заголовок и быстрые действия -->
      <div class="bg-background rounded-2xl p-4 md:p-6 shadow-lg border border-white/10">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg md:text-xl font-bold text-white">Управление бэкапами</h3>
            <p class="text-gray-400 text-sm mt-1">Создание, просмотр и управление резервными копиями системы</p>
          </div>
          <div class="flex items-center gap-3">
            <BaseButton
              @click="openCreateBackupModal"
              variant="primary"
              class="flex items-center gap-2 text-sm md:text-base px-3 md:px-4 py-2"
            >
              <svg class="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <span class="hidden sm:inline">Создать бэкап</span>
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Статистика бэкапов -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
          <div class="flex items-center gap-3 md:gap-4">
            <div class="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 md:w-6 md:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/>
              </svg>
            </div>
            <div>
              <p class="text-gray-400 text-xs md:text-sm">Всего бэкапов</p>
              <p class="text-white text-xl md:text-2xl font-bold">{{ backupsStore.totalBackups }}</p>
            </div>
          </div>
        </div>

        <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
          <div class="flex items-center gap-3 md:gap-4">
            <div class="w-10 h-10 md:w-12 md:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 md:w-6 md:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div>
              <p class="text-gray-400 text-xs md:text-sm">Успешных</p>
              <p class="text-white text-xl md:text-2xl font-bold">{{ backupsStore.successfulBackups }}</p>
            </div>
          </div>
        </div>

        <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
          <div class="flex items-center gap-3 md:gap-4">
            <div class="w-10 h-10 md:w-12 md:h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 md:w-6 md:h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
            <div>
              <p class="text-gray-400 text-xs md:text-sm">Ошибок</p>
              <p class="text-white text-xl md:text-2xl font-bold">{{ backupsStore.failedBackups }}</p>
            </div>
          </div>
        </div>

        <div class="bg-card-bg rounded-2xl p-4 md:p-6 shadow-lg">
          <div class="flex items-center gap-3 md:gap-4">
            <div class="w-10 h-10 md:w-12 md:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 md:w-6 md:h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
            </div>
            <div>
              <p class="text-gray-400 text-xs md:text-sm">Общий размер</p>
              <p class="text-white text-xl md:text-2xl font-bold">{{ backupsStore.formatFileSize(backupsStore.totalSize) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Список бэкапов -->
      <div class="bg-background rounded-2xl p-4 md:p-6 shadow-lg border border-white/10">
        <div class="flex items-center justify-between mb-4 md:mb-6">
          <h2 class="text-xl md:text-2xl font-bold text-white">История бэкапов</h2>
          <div class="flex items-center gap-3">
            <select
              v-model="selectedBackupType"
              class="bg-card-bg text-white rounded-lg px-3 py-2 text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Все типы</option>
              <option value="full">Полный</option>
              <option value="database">База данных</option>
              <option value="files">Файлы</option>
              <option value="partial">Частичный</option>
            </select>
            <BaseButton variant="outline" size="sm" @click="refreshBackups">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </BaseButton>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-white/10">
                <th class="text-left py-3 px-4 text-gray-400 font-medium">Название</th>
                <th class="text-left py-3 px-4 text-gray-400 font-medium">Тип</th>
                <th class="text-left py-3 px-4 text-gray-400 font-medium">Размер</th>
                <th class="text-left py-3 px-4 text-gray-400 font-medium">Статус</th>
                <th class="text-left py-3 px-4 text-gray-400 font-medium">Дата</th>
                <th class="text-right py-3 px-4 text-gray-400 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="backup in filteredBackups"
                :key="backup.id"
                class="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td class="py-4 px-4">
                  <div>
                    <p class="text-white font-medium">{{ backup.name }}</p>
                    <p class="text-gray-400 text-sm">{{ backup.description }}</p>
                  </div>
                </td>
                <td class="py-4 px-4">
                  <span
                    class="px-2 py-1 rounded-full text-xs font-medium"
                    :class="getBackupTypeClass(backup.type)"
                  >
                    {{ getBackupTypeLabel(backup.type) }}
                  </span>
                </td>
                <td class="py-4 px-4 text-gray-300">
                  {{ backup.size > 0 ? backupsStore.formatFileSize(backup.size) : '-' }}
                </td>
                <td class="py-4 px-4">
                  <span
                    class="px-2 py-1 rounded-full text-xs font-medium"
                    :class="getBackupStatusClass(backup.status)"
                  >
                    {{ getBackupStatusLabel(backup.status) }}
                  </span>
                </td>
                <td class="py-4 px-4 text-gray-300">
                  {{ formatBackupDate(backup.createdAt) }}
                </td>
                <td class="py-4 px-4">
                  <div class="flex items-center justify-end gap-2">
                    <BaseButton
                      v-if="backup.status === 'completed' && backup.downloadUrl"
                      @click="downloadBackup(backup)"
                      variant="ghost"
                      size="sm"
                      title="Скачать"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                      </svg>
                    </BaseButton>
                    <BaseButton
                      v-if="backup.status === 'completed'"
                      @click="restoreBackup(backup)"
                      variant="ghost"
                      size="sm"
                      title="Восстановить"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                      </svg>
                    </BaseButton>
                    <BaseButton
                      @click="deleteBackup(backup.id)"
                      variant="ghost"
                      size="sm"
                      class="text-red-400 hover:text-red-300"
                      title="Удалить"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </BaseButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AdminLayout>

  <!-- Модальные окна -->
  <CreateBackupModal
    :is-open="isCreateBackupModalOpen"
    @close="closeCreateBackupModal"
    @backup-created="onBackupCreated"
  />
  <RestoreBackupModal
    :is-open="isRestoreModalOpen"
    :backup="selectedBackup"
    @close="closeRestoreModal"
    @restore-confirmed="onRestoreConfirmed"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AdminLayout from '@/components/layouts/AdminLayout.vue'
import BaseButton from '@/components/BaseButton.vue'
import RecaptchaSettings from '@/components/RecaptchaSettings.vue'
import CreateBackupModal from '@/components/modals/CreateBackupModal.vue'
import RestoreBackupModal from '@/components/modals/RestoreBackupModal.vue'
import { useRecaptchaStore } from '@/stores/recaptcha'
import { useNotificationsStore, type Notification } from '@/stores/notifications'
import { useBackupsStore, type Backup } from '@/stores/backups'

const recaptchaStore = useRecaptchaStore()
const notificationsStore = useNotificationsStore()
const backupsStore = useBackupsStore()
const router = useRouter()
const route = useRoute()

// Активная вкладка
const activeTab = ref('general')

// Фильтры для уведомлений
const selectedFilter = ref('')
const selectedStatus = ref('')

// Бэкапы
const selectedBackupType = ref('')
const isCreateBackupModalOpen = ref(false)
const isRestoreModalOpen = ref(false)
const selectedBackup = ref<Backup | null>(null)

// Статистика reCAPTCHA (реальная, из store)
const recaptchaStats = computed(() => recaptchaStore.getUsageStats())

// Статистика уведомлений
const readCount = computed(() =>
  notificationsStore.notifications.filter(n => n.read).length
)

const todayCount = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return notificationsStore.notifications.filter(n =>
    n.createdAt >= today
  ).length
})

// Отфильтрованные уведомления
const filteredNotifications = computed(() => {
  let filtered = notificationsStore.notifications

  if (selectedFilter.value) {
    filtered = filtered.filter(n => n.type === selectedFilter.value)
  }

  if (selectedStatus.value === 'read') {
    filtered = filtered.filter(n => n.read)
  } else if (selectedStatus.value === 'unread') {
    filtered = filtered.filter(n => !n.read)
  }

  return filtered
})

// Отфильтрованные бэкапы
const filteredBackups = computed(() => {
  if (!selectedBackupType.value) return backupsStore.backups
  return backupsStore.backups.filter(backup => backup.type === selectedBackupType.value)
})

// Обработка клика по уведомлению
function handleNotificationClick(notification: Notification) {
  // Отмечаем как прочитанное
  if (!notification.read) {
    notificationsStore.markAsRead(notification.id)
  }

  // Если есть URL для действия, переходим к нему
  if (notification.actionUrl) {
    router.push(notification.actionUrl)
  }
}

// Переключение статуса прочитанности
function toggleReadStatus(notification: Notification) {
  if (notification.read) {
    // Делаем непрочитанным (простая реализация)
    notification.read = false
  } else {
    notificationsStore.markAsRead(notification.id)
  }
}

// Функции для бэкапов
function openCreateBackupModal() {
  isCreateBackupModalOpen.value = true
}

function closeCreateBackupModal() {
  isCreateBackupModalOpen.value = false
}

function onBackupCreated() {
  closeCreateBackupModal()
}

function openRestoreModal(backup: Backup) {
  selectedBackup.value = backup
  isRestoreModalOpen.value = true
}

function closeRestoreModal() {
  isRestoreModalOpen.value = false
  selectedBackup.value = null
}

async function onRestoreConfirmed() {
  if (selectedBackup.value) {
    await backupsStore.restoreBackup(selectedBackup.value)
    closeRestoreModal()
  }
}

async function downloadBackup(backup: Backup) {
  await backupsStore.downloadBackup(backup)
}

async function restoreBackup(backup: Backup) {
  openRestoreModal(backup)
}

async function deleteBackup(id: number) {
  if (confirm('Вы уверены, что хотите удалить этот бэкап?')) {
    await backupsStore.deleteBackup(id)
  }
}

function refreshBackups() {
  // В реальном приложении здесь был бы запрос к API
  console.log('Обновление списка бэкапов')
}

function getBackupTypeClass(type: Backup['type']): string {
  const classes = {
    full: 'bg-purple-500/20 text-purple-300',
    database: 'bg-blue-500/20 text-blue-300',
    files: 'bg-green-500/20 text-green-300',
    partial: 'bg-yellow-500/20 text-yellow-300'
  }
  return classes[type] || classes.partial
}

function getBackupTypeLabel(type: Backup['type']): string {
  const labels = {
    full: 'Полный',
    database: 'БД',
    files: 'Файлы',
    partial: 'Частичный'
  }
  return labels[type] || type
}

function getBackupStatusClass(status: Backup['status']): string {
  const classes = {
    completed: 'bg-green-500/20 text-green-300',
    in_progress: 'bg-yellow-500/20 text-yellow-300',
    failed: 'bg-red-500/20 text-red-300',
    corrupted: 'bg-orange-500/20 text-orange-300'
  }
  return classes[status] || classes.failed
}

function getBackupStatusLabel(status: Backup['status']): string {
  const labels = {
    completed: 'Завершен',
    in_progress: 'В процессе',
    failed: 'Ошибка',
    corrupted: 'Поврежден'
  }
  return labels[status] || status
}

// Функции для иконок уведомлений (копируем из NotificationsDropdown)
function getNotificationIconClass(type: Notification['type']): string {
  const classes = {
    info: 'bg-blue-500/20 text-blue-400',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    error: 'bg-red-500/20 text-red-400',
    user: 'bg-purple-500/20 text-purple-400',
    system: 'bg-gray-500/20 text-gray-400'
  }
  return classes[type] || classes.info
}

function getNotificationIconPath(type: Notification['type']): string {
  const paths = {
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z',
    error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    system: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
  }
  return paths[type] || paths.info
}

// Форматирование времени (копируем из NotificationsDropdown)
function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return 'Только что'
  if (minutes < 60) return `${minutes} мин назад`
  if (hours < 24) return `${hours} ч назад`
  if (days < 7) return `${days} д назад`

  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  })
}

// Форматирование даты (для reCAPTCHA)
function formatDate(date: Date) {
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Форматирование даты для бэкапов
function formatBackupDate(date: Date): string {
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Жизненный цикл компонента
onMounted(() => {
  // Чтение параметра 'tab' из маршрута
  const tab = route.query.tab as string
  if (tab && ['general', 'security', 'notifications', 'backups'].includes(tab)) {
    activeTab.value = tab
  }
})

watch(activeTab, (newValue) => {
  // Обновление параметра 'tab' в маршруте без создания новой записи в истории
  router.replace({ query: { tab: newValue } })
})
</script>

<style scoped>
/* Кастомный скролл для блока уведомлений */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 48, 64, 0.3) rgba(255, 255, 255, 0.05);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 48, 64, 0.3);
  border-radius: 3px;
  transition: background-color 0.2s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 48, 64, 0.5);
}

.custom-scrollbar::-webkit-scrollbar-thumb:active {
  background: rgba(255, 48, 64, 0.7);
}
</style>
