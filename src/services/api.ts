import axios from 'axios'
import type { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'
import type { Transaction, UserNotification, NotificationCreateRequest, TransactionFilters, TransactionsResponse } from '@/types'

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Определяем базовый URL в зависимости от режима
const getBaseURL = () => {
  // Логируем для отладки
  console.log('🔍 Environment check:', {
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
    MODE: import.meta.env.MODE,
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL
  })

  // В режиме разработки используем Vite прокси
  if (import.meta.env.DEV) {
    console.log('🚀 Using DEV mode - Vite proxy: /api')
    return '/api'
  }

  // В продакшене на Vercel используем API route для проксирования
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    console.log('🌐 Using Vercel production - API proxy: /api/proxy')
    return '/api/proxy'
  }

  // Для других случаев (например, самостоятельный хостинг)
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://77.246.247.145'
  console.log('🏠 Using direct connection:', baseUrl)
  return baseUrl
}

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Важно для работы с cookies
})

// Интерфейсы для ответов
export interface AuthResponse {
  role: string
  user_id: number
  access_token: string
  refresh_token: string
}

export interface RefreshResponse {
  access_token: string
}

export interface Role {
  id: number
  name: string
  permissions: null
}

export interface User {
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

export interface Game {
  id: number
  name: string
  rtp: number
  chance: number
}

export interface GamePlayResponse {
  result: 'win' | 'lose'
  win_amount: number
  new_balance: number
}

export interface ValidationError {
  field: string
  error: string
}

export interface ErrorResponse {
  error: string
}

export interface StatusResponse {
  message: string
}

// Интерфейсы для бонусов
export interface BonusResponse {
  id: number
  title: string
  description: string
  type: 'welcome' | 'promo' | 'cashback' | 'loyalty' | 'reload' | 'freespins'
  reward: string
  wager_multiplier: number
  is_active: boolean
  status: 'active' | 'scheduled' | 'ended' | 'paused'
  participants_count: number
  total_reward: number
  promo_code?: string | null
  max_activations?: number | null
  activated_count: number
  start_date: string
  end_date?: string | null
}

export interface CreateBonusRequest {
  title: string
  description: string
  type: 'welcome' | 'promo' | 'cashback' | 'loyalty' | 'reload' | 'freespins'
  reward: string
  wager_multiplier: number
  promo_code?: string
  max_activations?: number
  start_date: string
  end_date?: string
}

export interface ActivateBonusRequest {
  promo_code: string
}

// API методы
export const authApi = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post<AuthResponse>('/api/registration', data),

  login: (data: { username: string; password: string }) =>
    api.post<AuthResponse>('/api/auth/login', data),

  refresh: () => api.post<RefreshResponse>('/api/refresh'),

  googleAuth: () => api.post<AuthResponse>('/api/google'),

  telegramAuth: () => api.post<AuthResponse>('/api/telegram'),

  vkAuth: () => api.post<AuthResponse>('/api/vk'),

  googleCallback: (code: string) => api.get<AuthResponse>(`/api/google/callback?code=${code}`),
}

export const userApi = {
  getProfile: () => api.get<User>('/api/user/me'),

  getAllUsers: () => api.get<User[]>('/api/user/'),

  getUserById: (id: number) => api.get<User>(`/api/user/${id}`),

  updateProfile: (data: Partial<User>) => api.put<User>('/api/user/me', data),

  updateUser: (id: number, data: Partial<User>) => api.put<User>(`/api/user/${id}`, data),

    setUserRole: (userId: number, roleId: number) =>
    api.put<StatusResponse>(`/api/user/${userId}/role`, { role_id: roleId }),

  setUserBalance: (userId: number, amount: number) =>
    api.put<StatusResponse>(`/api/user/${userId}/balance`, { amount }),
}

export const balanceApi = {
  getBalance: () => api.get<{ balance: number }>('/api/balance/'),

  deposit: (data: { amount: number; method: string }) =>
    api.post<StatusResponse>('/api/balance/deposit', data),

  withdraw: (data: { amount: number; method: string }) =>
    api.post<StatusResponse>('/api/balance/withdraw', data),
}

export const transactionsApi = {
  getAll: (filters?: TransactionFilters) => {
    const params = new URLSearchParams()

    // Всегда добавляем page (по умолчанию 1)
    params.append('page', (filters?.page || 1).toString())

    if (filters?.query) {
      params.append('query', filters.query)
    }

    if (filters?.status) {
      params.append('status', filters.status)
    }

    if (filters?.type) {
      params.append('type', filters.type)
    }

    const queryString = params.toString()
    const url = `/api/transaction/?${queryString}`

    console.log('🔧 DEBUG TRANSACTION API:', {
      'api.defaults.baseURL': api.defaults.baseURL,
      'endpoint': url,
      'computed URL': `${api.defaults.baseURL}${url}`,
      'getBaseURL()': getBaseURL()
    })

    return api.get<TransactionsResponse>(url)
  },

  getById: (id: number) => api.get<Transaction>(`/transaction/${id}`),

  getUserTransactions: (userId: number) => api.get<Transaction[]>(`/api/user/${userId}/transaction`),

  updateStatus: (id: number, status: Transaction['status']) =>
    api.put<StatusResponse>(`/api/transaction/${id}/status`, { status }),
}

export const gamesApi = {
  getAll: () => api.get<Game[]>('/api/game/list'),

  getById: (id: number) => api.get<Game>(`/api/game/${id}`),

  create: (data: { name: string; chance: number; rtp: number }) => api.post<number>('/api/game/', data),

  update: (id: number, data: Partial<Game>) => api.put<StatusResponse>(`/api/game/${id}`, data),

  play: (id: number, data: { bet: number }) => api.post<GamePlayResponse>(`/api/game/${id}/play`, data),
}

export const notificationsApi = {
  // GET /api/notification/ - получение списка уведомлений
  getAll: () => api.get<UserNotification[]>('/api/notification/'),

  // PATCH /api/notification/{id} - изменение статуса уведомления
  toggleStatus: (id: number) => api.patch<StatusResponse>(`/api/notification/${id}`),

  // PATCH /api/notification/all - прочитать все уведомления
  markAllAsRead: () => api.patch<StatusResponse>('/api/notification/all'),

  // GET /api/notification/count?status=read - получение количества уведомлений
  getCount: (status?: 'read' | 'unread') => {
    const params = status ? `?status=${status}` : ''
    return api.get<number>(`/api/notification/count${params}`)
  },

  // POST /api/notification/ - создание уведомления
  create: (data: NotificationCreateRequest) => api.post<StatusResponse>('/api/notification/', data),

  // DELETE /api/notification/{id} - удаление уведомления
  delete: (id: number) => api.delete<StatusResponse>(`/api/notification/${id}`),

  // DELETE /api/notification/all - удаление всех уведомлений
  deleteAll: () => api.delete<StatusResponse>('/api/notification/all'),
}

export const bonusesApi = {
  // GET /bonus/ - получение списка бонусов
  getAll: () => api.get<BonusResponse[]>('/api/bonus/'),

  // POST /bonus/ - создание бонуса
  create: (data: CreateBonusRequest) => api.post<StatusResponse>('/api/bonus/', data),

  // DELETE /bonus/{id} - удаление бонуса
  delete: (id: number) => api.delete<StatusResponse>(`/api/bonus/${id}`),

  // POST /bonus/activate - активация бонуса по промокоду
  activate: (data: ActivateBonusRequest) => api.post<StatusResponse>('/api/bonus/activate', data),
}

// Добавляем перехватчик для установки токена
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get('access_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Добавляем перехватчик для обработки ошибок
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        const { data } = await authApi.refresh()
        Cookies.set('access_token', data.access_token, {
          secure: true,
          sameSite: 'strict',
          expires: 1 / 24,
        })
        // Повторяем запрос с новым токеном
        const config = error.config
        if (config && config.headers) {
          config.headers.Authorization = `Bearer ${data.access_token}`
          return api(config)
        }
            } catch {
        // Если не удалось обновить токен, выходим из системы
        Cookies.remove('access_token')
        Cookies.remove('refresh_token')

        // Перенаправляем на страницу логина
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  },
)

export default api
