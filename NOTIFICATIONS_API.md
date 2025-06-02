# API уведомлений

Этот документ описывает интеграцию API уведомлений в админ-панель ColorPaletteDesigner.

## Структура данных

### UserNotification
```typescript
interface UserNotification {
  id: number
  user_id: number
  notification_id: number
  is_read: boolean
  read_at: string | null
  notification: NotificationData
}
```

### NotificationData
```typescript
interface NotificationData {
  id: number
  title: string
  message: string
  type: 'new_user' | 'info' | 'success' | 'warning' | 'error' | 'system'
  created_at: string
}
```

## API эндпоинты

### 1. Получение списка уведомлений
```typescript
GET /notification/
// Возвращает: UserNotification[]
```

### 2. Изменение статуса уведомления
```typescript
PATCH /notification/{id}
// Возвращает: { message: string }
```

### 3. Отметить все как прочитанные
```typescript
PATCH /notification/all
// Возвращает: { message: string }
```

### 4. Получение количества уведомлений
```typescript
GET /notification/count?status=read|unread
// Возвращает: number
```

### 5. Создание уведомления
```typescript
POST /notification/
Body: {
  title: string
  message: string
  type: 'new_user' | 'info' | 'success' | 'warning' | 'error' | 'system'
}
// Возвращает: { message: string }
```

### 6. Удаление уведомления
```typescript
DELETE /notification/{id}
// Возвращает: { message: string }
```

### 7. Удаление всех уведомлений
```typescript
DELETE /notification/all
// Возвращает: { message: string }
```

## Использование в компонентах

### Инициализация стора
```typescript
import { useNotificationsStore } from '@/stores/notifications'

const notificationsStore = useNotificationsStore()

// Загрузка уведомлений
await notificationsStore.fetchNotifications()
```

### Основные методы стора

```typescript
// Получение уведомлений
await notificationsStore.fetchNotifications()

// Создание уведомления
await notificationsStore.createNotification({
  title: 'Новое уведомление',
  message: 'Текст уведомления',
  type: 'info'
})

// Изменение статуса
await notificationsStore.toggleNotificationStatus(notificationId)

// Отметить все как прочитанные
await notificationsStore.markAllAsRead()

// Удаление уведомления
await notificationsStore.deleteNotification(notificationId)

// Удаление всех уведомлений
await notificationsStore.deleteAllNotifications()

// Получение количества
const count = await notificationsStore.getNotificationCount('unread')
```

### Реактивные данные

```typescript
// Список уведомлений (отсортированный)
const notifications = computed(() => notificationsStore.notifications)

// Количество непрочитанных
const unreadCount = computed(() => notificationsStore.unreadCount)

// Состояние загрузки
const loading = computed(() => notificationsStore.loading)

// Ошибки
const error = computed(() => notificationsStore.error)
```

## Интеграция в компоненты

### NotificationsDropdown
Компонент выпадающего списка уведомлений в шапке:
- Автоматически загружает уведомления при первом открытии
- Показывает индикатор непрочитанных уведомлений
- Позволяет отмечать как прочитанные и удалять уведомления

### SettingsView (вкладка notifications)
Полная страница управления уведомлениями:
- Статистика уведомлений
- Фильтрация по типу и статусу
- Массовые операции
- Создание новых уведомлений (для админов)

## Обработка ошибок

Все методы стора обрабатывают ошибки и сохраняют их в `error` состоянии:

```typescript
try {
  await notificationsStore.fetchNotifications()
} catch (error) {
  // Ошибка уже сохранена в notificationsStore.error
  console.error('Ошибка загрузки уведомлений:', error)
}
```

## Типы уведомлений

- `new_user` - Регистрация нового пользователя
- `info` - Информационное сообщение
- `success` - Успешная операция
- `warning` - Предупреждение
- `error` - Ошибка
- `system` - Системное уведомление

## Автоматическое обновление

Для получения новых уведомлений в реальном времени рекомендуется:

1. Использовать WebSocket соединение
2. Периодически вызывать `fetchNotifications()`
3. Интегрировать с Server-Sent Events (SSE)

Пример периодического обновления:
```typescript
import { onMounted, onUnmounted } from 'vue'

let interval: number

onMounted(() => {
  // Обновляем каждые 30 секунд
  interval = setInterval(() => {
    notificationsStore.fetchNotifications()
  }, 30000)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})
``` 