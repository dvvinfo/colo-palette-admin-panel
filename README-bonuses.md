# Система бонусов и промоакций

## Обзор

В проекте реализована комплексная система управления бонусами и промоакциями с полной интеграцией с backend API. Система поддерживает различные типы бонусов, промокоды, временные ограничения и детальную аналитику.

## Возможности

- ✅ **Множественные типы бонусов** - Welcome, Reload, Cashback, Loyalty, Promo, Freespins
- ✅ **Промокоды** - Создание и активация промокодов с ограничениями
- ✅ **Временные рамки** - Настройка периодов действия бонусов
- ✅ **Валидация дат** - Предотвращение создания бонусов в прошлом
- ✅ **Местное время** - Корректное отображение времени пользователя
- ✅ **Push-уведомления** - Уведомления об активации и ошибках
- ✅ **CRUD операции** - Полное управление через REST API
- ✅ **Статистика** - Детальная аналитика по бонусам
- ✅ **Многоязычность** - Поддержка русского и английского языков
- ✅ **Адаптивный интерфейс** - Современный UI/UX

## Быстрый старт

### 1. Backend API

Система работает с REST API со следующими эндпоинтами:

```
POST /bonus/                 # Создание бонуса
GET /bonus/                  # Получение списка бонусов  
DELETE /bonus/{id}           # Удаление бонуса
POST /bonus/activate         # Активация промокода
```

### 2. Структура данных

#### Создание бонуса (CreateBonusRequest)
```json
{
  "title": "Приветственный бонус 100%",
  "description": "Бонус для новых игроков",
  "type": "welcome",
  "reward": "100% (макс. 50 000 ₽)",
  "wager_multiplier": 40,
  "promo_code": "WELCOME100",
  "max_activations": 1000,
  "start_date": "2025-01-20T18:24:00+03:00",
  "end_date": "2025-12-31T23:59:59+03:00"
}
```

#### Ответ API (BonusResponse)
```json
{
  "id": 1,
  "title": "Приветственный бонус 100%",
  "description": "Бонус для новых игроков",
  "type": "welcome",
  "status": "active",
  "reward": "100% (макс. 50 000 ₽)",
  "wager_multiplier": 40,
  "is_active": true,
  "participants_count": 25,
  "total_reward": 125000,
  "promo_code": "WELCOME100",
  "max_activations": 1000,
  "activated_count": 25,
  "start_date": "2025-01-20T18:24:00+03:00",
  "end_date": "2025-12-31T23:59:59+03:00"
}
```

### 3. Типы бонусов

| Тип | Описание | Промокод |
|-----|----------|----------|
| `welcome` | Приветственный бонус для новых игроков | Опционально |
| `reload` | Бонус на пополнение счета | Опционально |
| `cashback` | Возврат части проигранных средств | Нет |
| `loyalty` | Бонус за активность | Нет |
| `promo` | Промокод-акция | Обязательно |
| `freespins` | Бесплатные вращения | Опционально |

### 4. Статусы бонусов

- **active** - Активный бонус
- **scheduled** - Запланированный (еще не начался)
- **ended** - Завершенный
- **paused** - Приостановленный

## Архитектура

### Компоненты

```
src/
├── views/
│   └── BonusesView.vue                    # Основная страница управления
├── components/
│   ├── modals/
│   │   ├── CreateBonusModal.vue           # Создание бонуса
│   │   └── ActivateBonusModal.vue         # Активация промокода
│   ├── NotificationToast.vue              # Компонент уведомлений
│   └── BaseInput.vue                      # Базовые UI компоненты
├── stores/
│   └── bonuses.ts                         # Pinia store для бонусов
├── services/
│   └── api.ts                             # API интеграция
├── composables/
│   └── useNotifications.ts                # Система уведомлений
└── locales/
    ├── ru.ts                              # Русские переводы
    └── en.ts                              # Английские переводы
```

### Store (Pinia)

```typescript
export const useBonusesStore = defineStore('bonuses', () => {
  // State
  const bonuses = ref<Bonus[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  const fetchBonuses = async () => { /* ... */ }
  const createBonus = async (bonusData: BonusForm) => { /* ... */ }
  const deleteBonus = async (id: number) => { /* ... */ }
  const activateBonus = async (promoCode: string) => { /* ... */ }

  // Computed
  const activeBonuses = computed(() => /* ... */)
  const totalParticipants = computed(() => /* ... */)

  return { /* ... */ }
})
```

### API сервис

```typescript
export const bonusesApi = {
  async getAll(): Promise<{ data: BonusResponse[] }> {
    const response = await apiClient.get('/bonus/')
    return response.data
  },

  async create(bonus: CreateBonusRequest): Promise<BonusResponse> {
    const response = await apiClient.post('/bonus/', bonus)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/bonus/${id}`)
  },

  async activate(request: ActivateBonusRequest): Promise<void> {
    await apiClient.post('/bonus/activate', request)
  }
}
```

## Возможности UI

### 1. Управление бонусами

#### Основная страница
- **Статистика** - Активные бонусы, участники, конверсия
- **Фильтрация** - По типу, статусу, поиск по названию/промокоду
- **Таблица бонусов** - Полная информация с действиями

#### Создание бонуса
- **Основная информация** - Название, описание, тип
- **Настройки награды** - Размер и условия отыгрыша
- **Промокоды** - Генерация и настройка ограничений
- **Временные рамки** - Даты начала и окончания с валидацией

#### Активация промокода
- **Простая форма** - Ввод промокода
- **Мгновенные уведомления** - Успех или ошибка
- **Автообновление** - Обновление статистики после активации

### 2. Валидация и UX

#### Валидация времени
```typescript
// Проверка, что дата начала не в прошлом
const startDateValid = new Date(form.start_date) >= new Date(minDateTime.value)

// Проверка, что дата окончания позже даты начала  
const endDateValid = !form.end_date || new Date(form.end_date) > new Date(form.start_date)
```

#### Обработка местного времени
```typescript
// Конвертация для API (с часовым поясом)
function formatDateForAPI(dateString: string): string {
  const localDate = new Date(dateString)
  const timezoneOffset = localDate.getTimezoneOffset()
  // Добавляем местный timezone
  return dateString + ':00' + formattedOffset
}

// Конвертация для UI (местное время)
function formatDateFromAPI(isoDateString: string): string {
  const date = new Date(isoDateString)
  return `${year}-${month}-${day}T${hours}:${minutes}`
}
```

### 3. Система уведомлений

#### Toast уведомления
```typescript
const { showSuccess, showError } = useNotifications()

// Успешная активация
showSuccess(
  'Промокод активирован!',
  `Промокод ${code} успешно активирован`
)

// Ошибка активации  
showError(
  'Ошибка активации промокода',
  errorMessage
)
```

#### Автоматическое исчезновение
- **Успех**: 4 секунды
- **Ошибка**: 6 секунд
- **Ручное закрытие**: Кнопка X

## API Integration

### Обработка ошибок

```typescript
try {
  await bonusesStore.createBonus(formData)
  showSuccess('Бонус создан успешно!')
} catch (err) {
  const errorMessage = err.response?.data?.error || 'Ошибка создания бонуса'
  showError('Ошибка', errorMessage)
}
```

### Форматирование дат

Система автоматически обрабатывает временные зоны:

```typescript
// Клиент отправляет (местное время + timezone)
"2025-01-20T18:24:00+03:00"

// Сервер возвращает (ISO формат)  
"2025-01-20T15:24:00Z"

// UI отображает (местное время)
"2025-01-20T18:24"
```

### Rate Limiting

API поддерживает ограничения скорости:
- **Создание бонусов**: 10 в минуту
- **Активация промокодов**: 5 в минуту
- **Получение списка**: 60 в минуту

## Безопасность

### Валидация на клиенте

```typescript
// Проверка обязательных полей
const isFormValid = computed(() => {
  const baseValid = form.title && form.description && form.type && form.reward
  const startDateValid = new Date(form.start_date) >= new Date(minDateTime.value)
  const endDateValid = !form.end_date || new Date(form.end_date) > new Date(form.start_date)
  
  if (form.type === 'promo') {
    return baseValid && startDateValid && endDateValid && form.promo_code
  }
  
  return baseValid && startDateValid && endDateValid
})
```

### Санитизация промокодов

```typescript
// Автоматическое преобразование в верхний регистр
promoCode.value.trim().toUpperCase()

// Валидация на сервере
if (!isValidPromoCode(code)) {
  throw new Error('Неверный формат промокода')
}
```

## Статистика и аналитика

### Ключевые метрики

```typescript
const conversionRate = computed(() => {
  const totalShown = bonuses.value.reduce((sum, bonus) => 
    sum + (bonus.max_activations || bonus.participants_count), 0)
  const totalUsed = bonuses.value.reduce((sum, bonus) => 
    sum + bonus.activated_count, 0)
  return totalShown > 0 ? (totalUsed / totalShown * 100) : 0
})
```

### Отображаемые данные

- **Активные бонусы** - Количество работающих акций
- **Участники** - Общее число пользователей
- **Выдано бонусов** - Сумма в рублях
- **Конверсия** - Процент активации от показов

## Локализация

### Переводы

Поддерживаются русский и английский языки:

```typescript
// Русский (ru.ts)
bonuses: {
  activatePromo: 'Активировать промокод',
  activationSuccess: 'Промокод активирован!',
  activationSuccessMessage: 'Промокод {code} успешно активирован'
}

// Английский (en.ts)  
bonuses: {
  activatePromo: 'Activate Promo Code',
  activationSuccess: 'Promo Code Activated!',
  activationSuccessMessage: 'Promo code {code} has been successfully activated'
}
```

### Интерполяция

```vue
<template>
  {{ $t('bonuses.activationSuccessMessage', { code: promoCode }) }}
</template>
```

## Тестирование

### Примеры тестовых данных

```json
{
  "title": "Тестовый бонус",
  "description": "Для тестирования функционала", 
  "type": "promo",
  "reward": "500 ₽",
  "wager_multiplier": 1,
  "promo_code": "TEST123",
  "max_activations": 100,
  "start_date": "2025-01-20T18:24:00+03:00",
  "end_date": "2025-01-21T18:24:00+03:00"
}
```

### Тестирование UI

1. **Создание бонуса** - Заполните все поля и проверьте валидацию
2. **Активация промокода** - Используйте "TEST123" для тестирования
3. **Временные зоны** - Проверьте корректность отображения времени
4. **Уведомления** - Убедитесь, что они появляются и исчезают

## Развертывание

### Переменные окружения

```env
# Backend API
VITE_API_BASE_URL=https://your-api.com

# Часовой пояс (опционально)
VITE_TIMEZONE=Europe/Moscow
```

### Сборка

```bash
# Разработка
npm run dev

# Продакшн сборка
npm run build

# Проверка типов
npm run type-check
```

## Мониторинг

### Логирование

Система логирует важные события:

```typescript
console.log('Original dates:', {
  start_date: bonusData.start_date,
  end_date: bonusData.end_date
})
console.log('Formatted dates:', {
  start_date: createRequest.start_date,
  end_date: createRequest.end_date
})
```

### Метрики для мониторинга

- Количество созданных бонусов
- Процент успешных активаций
- Время ответа API
- Ошибки валидации

## Troubleshooting

### Частые проблемы

#### 1. Время отображается неправильно
```
Проблема: Даты показывают время UTC вместо местного
Решение: Проверьте функцию formatDateFromAPI в stores/bonuses.ts
```

#### 2. Промокод не активируется
```
Проблема: Ошибка "Invalid promo code"
Решение: Убедитесь, что промокод существует и не истек
```

#### 3. Валидация дат не работает
```
Проблема: Можно создать бонус в прошлом
Решение: Проверьте minDateTime в CreateBonusModal.vue
```

### Отладка

```typescript
// Включить детальное логирование
localStorage.setItem('debug_bonuses', 'true')

// Просмотр состояния store
console.log(bonusesStore.bonuses)
console.log(bonusesStore.error)
```

## Дорожная карта

### Планируемые функции

- [ ] **Пакетная обработка** - Массовые операции с бонусами
- [ ] **Шаблоны бонусов** - Повторное использование настроек
- [ ] **A/B тестирование** - Тестирование эффективности
- [ ] **Геотаргетинг** - Бонусы по регионам
- [ ] **Интеграция с CRM** - Синхронизация с клиентской базой
- [ ] **Push-уведомления** - Уведомления в браузере
- [ ] **Экспорт отчетов** - CSV/Excel экспорт
- [ ] **API webhooks** - Уведомления о событиях

---

**Версия документации**: 1.0  
**Дата обновления**: Январь 2025  
**Автор**: Команда разработки 