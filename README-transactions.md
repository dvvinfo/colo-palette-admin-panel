# 💳 Система транзакций с криптовалютами

Документация API для работы с транзакциями, включая поддержку криптовалют, обменных курсов и многовалютных операций.

## 📋 Содержание

- [API эндпоинты](#api-эндпоинты)
- [Структура данных](#структура-данных)
- [Валюты и курсы](#валюты-и-курсы)
- [Статусы транзакций](#статусы-транзакций)
- [Фильтрация и пагинация](#фильтрация-и-пагинация)
- [Примеры использования](#примеры-использования)
- [Frontend компоненты](#frontend-компоненты)

## 🚀 API эндпоинты

### GET `/api/transaction/`
Получение списка транзакций с поддержкой пагинации и фильтрации.

**Параметры запроса:**
- `page` (number) - номер страницы (по умолчанию: 1)
- `query` (string, optional) - поиск по имени пользователя, email или ID
- `status` (string, optional) - фильтр по статусу
- `type` (string, optional) - фильтр по типу транзакции

**Пример запроса:**
```
GET /api/transaction/?page=1&status=success&query=admin
```

**Ответ:**
```json
{
  "data": [
    {
      "id": 1,
      "user_id": 42,
      "currency": "btc",
      "amount_raw": 0.001,
      "rate": 5500000,
      "amount_rub": 5500,
      "status": "success",
      "created_at": "2024-01-15T10:30:00Z",
      "user": {
        "id": 42,
        "username": "admin",
        "email": "admin@example.com",
        "role_id": 1,
        "provider": "",
        "provider_id": "",
        "balance": 1000000,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-15T10:30:00Z",
        "role": {
          "id": 1,
          "name": "admin",
          "permissions": null
        }
      }
    }
  ],
  "page": 1,
  "pages": 10,
  "total": 200
}
```

### PUT `/api/transaction/{id}/status`
Обновление статуса транзакции.

**Тело запроса:**
```json
{
  "status": "success"
}
```

### GET `/api/user/{userId}/transaction`
Получение транзакций конкретного пользователя.

## 📊 Структура данных

### Transaction
```typescript
interface Transaction {
  id: number                    // ID транзакции
  user_id: number              // ID пользователя
  currency: 'btc' | 'eth' | 'usdt' | 'rub'  // Валюта
  amount_raw: number           // Сумма в исходной валюте
  rate: number                 // Курс к рублю (1 для RUB)
  amount_rub: number           // Сумма в рублях
  status: TransactionStatus    // Статус транзакции
  created_at: string          // Дата создания (ISO string)
  user: User                  // Данные пользователя
}
```

### User
```typescript
interface User {
  id: number
  username: string
  email: string | null
  role_id: number
  provider: string
  provider_id: string
  balance: number
  created_at: string
  updated_at: string
  role: Role
}
```

### Role
```typescript
interface Role {
  id: number
  name: string
  permissions: null
}
```

## 💰 Валюты и курсы

### Поддерживаемые валюты

| Валюта | Код    | Описание        | Курс к рублю |
|--------|--------|-----------------|--------------|
| Bitcoin| `btc`  | Биткоин         | ~5,500,000   |
| Ethereum| `eth` | Эфириум         | ~350,000     |
| Tether | `usdt` | USDT            | ~100         |
| Рубль  | `rub`  | Российский рубль| 1            |

### Расчет сумм

- **amount_raw** - сумма в исходной валюте (например, 0.001 BTC)
- **rate** - курс валюты к рублю (например, 5,500,000 для BTC)
- **amount_rub** - сумма в рублях (amount_raw × rate)

**Пример:**
```javascript
// Транзакция на 0.001 BTC
const transaction = {
  currency: 'btc',
  amount_raw: 0.001,           // 0.001 BTC
  rate: 5500000,               // 1 BTC = 5,500,000 RUB
  amount_rub: 5500             // 0.001 × 5,500,000 = 5,500 RUB
}
```

## 📊 Статусы транзакций

| Статус      | Описание                    | Цвет    |
|-------------|----------------------------|---------|
| `pending`   | Ожидает обработки          | 🟡 Yellow|
| `progress`  | В процессе                 | 🔵 Blue  |
| `success`   | Успешно завершена          | 🟢 Green |
| `completed` | Завершена                  | 🟢 Green |
| `failed`    | Ошибка                     | 🔴 Red   |
| `cancelled` | Отменена                   | ⚫ Gray  |
| `rejected`  | Отклонена                  | 🔴 Red   |

## 🔍 Фильтрация и пагинация

### Параметры фильтрации

```typescript
interface TransactionFilters {
  page?: number          // Номер страницы
  query?: string         // Поиск по тексту
  status?: string        // Фильтр по статусу
  type?: string          // Фильтр по типу
}
```

### Ответ с пагинацией

```typescript
interface TransactionsResponse {
  data: Transaction[]    // Массив транзакций
  page: number          // Текущая страница
  pages: number         // Общее количество страниц
  total?: number        // Общее количество записей
}
```

## 💻 Примеры использования

### 1. Загрузка транзакций с фильтрами

```typescript
import { transactionsApi } from '@/services/api'

// Загрузка первой страницы
const response = await transactionsApi.getAll({ page: 1 })

// Поиск по имени пользователя
const searched = await transactionsApi.getAll({ 
  query: 'admin',
  page: 1 
})

// Фильтр по статусу
const successful = await transactionsApi.getAll({ 
  status: 'success',
  page: 1 
})
```

### 2. Обновление статуса транзакции

```typescript
// Одобрить транзакцию
await transactionsApi.updateStatus(123, 'success')

// Отклонить транзакцию
await transactionsApi.updateStatus(123, 'rejected')
```

### 3. Получение транзакций пользователя

```typescript
const userTransactions = await transactionsApi.getUserTransactions(42)
console.log(userTransactions.data)
```

## 🎨 Frontend компоненты

### TransactionsTable.vue
Основная таблица с транзакциями, включает:
- ✅ Пагинацию
- ✅ Фильтрацию по статусу
- ✅ Поиск по тексту
- ✅ Отображение валют с иконками
- ✅ Форматирование сумм
- ✅ Модальные окна для деталей

### TransactionModal.vue
Модальное окно с деталями транзакции:
- ✅ Полная информация о транзакции
- ✅ Данные пользователя
- ✅ Обменный курс и суммы
- ✅ Возможность изменения статуса

### Используемые store

```typescript
// Загрузка транзакций
const transactionsStore = useTransactionsStore()
await transactionsStore.fetchTransactions({ page: 1, status: 'pending' })

// Статистика
console.log(transactionsStore.statistics.deposits)
console.log(transactionsStore.statistics.pending)
console.log(transactionsStore.statistics.totalTurnover)
```

## 🔧 Конфигурация

### Proxy настройки (vite.config.ts)

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://77.246.247.145',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          const newPath = path.replace(/^\/api/, '')
          console.log('🔄 Rewriting:', path, '→', newPath);
          return newPath
        }
      }
    }
  }
})
```

### API базовый URL

```typescript
const getBaseURL = () => {
  if (import.meta.env.DEV) {
    return '/api'  // Vite proxy в разработке
  }
  
  if (window.location.hostname.includes('vercel.app')) {
    return '/api/proxy'  // Vercel production
  }
  
  return import.meta.env.VITE_API_BASE_URL || 'http://77.246.247.145'
}
```

## 🚨 Обработка ошибок

При недоступности API система автоматически переключается на **мок-данные**:

```typescript
try {
  const response = await transactionsApi.getAll(filters)
  // Используем реальные данные
} catch (error) {
  console.warn('API недоступен, используются мок-данные')
  // Генерируем и используем мок-данные
  const mockData = generateMockTransactions()
  // Применяем фильтрацию к мок-данным
}
```

## 📈 Статистика

Система автоматически вычисляет статистику:

```typescript
const statistics = computed(() => ({
  deposits: { count: 0, amount: 0 },     // Успешные депозиты
  withdrawals: { count: 0, amount: 0 },  // Выводы (требует доработки)
  pending: { count: 0, amount: 0 },      // Ожидающие транзакции
  totalTurnover: 0                       // Общий оборот
}))
```

**Примечание:** В текущей версии статистика `withdrawals` не реализована и требует добавления поля `type` в Transaction или другой логики определения типа транзакции.

## 🔮 Планы развития

- [ ] Добавить поле `type` для различения депозитов и выводов
- [ ] Реализовать статистику по выводам
- [ ] Добавить фильтр по типу транзакции
- [ ] Добавить экспорт транзакций
- [ ] Реализовать уведомления о статусах
- [ ] Добавить графики и аналитику 