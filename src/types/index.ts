export interface Game {
  id: number
  title: string
  category: string
  image: string
  provider: string
  isNew?: boolean
  isHot?: boolean
  link: string
}

export interface Promotion {
  id: number
  title: string
  description: string
  image?: string
  buttonText: string
  buttonLink: string
}

export interface Category {
  id: string
  name: string
  icon: string
}

export interface Banner {
  id: number
  title: string
  description: string
  image: string
  buttonText: string
  buttonLink: string
}

export type ThemeOption = 'default' | 'red' | 'blue' | 'green' | 'purple'

export interface Transaction {
  id: number
  user_id: number
  currency: string
  amount_raw: number
  rate: number
  amount_rub: number
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'success' | 'progress' | 'rejected'
  created_at: string
  user?: {
    id: number
    username: string
    email: string
    role_id: number
    provider: string
    provider_id: string
    balance: number
    created_at: string
    updated_at: string
    role: {
      id: number
      name: string
      permissions: null
    }
  }
}

export interface TransactionFilters {
  page?: number
  query?: string
  status?: 'pending' | 'completed' | 'failed' | 'cancelled' | 'success' | 'progress' | 'rejected'
  type?: 'conclusion' | 'accrual'
}

export interface TransactionsResponse {
  pages: number
  page: number
  data: Transaction[]
}

export interface PaymentMethod {
  id: string
  name: string
  type: 'card' | 'wallet' | 'crypto' | 'bank' | 'mobile'
  enabled: boolean
  icon: string
  minAmount: number
  maxAmount: number
  commission: number
  commissionType: 'fixed' | 'percent'
  processingTime: string
  currencies: string[]
  settings: Record<string, string | number | boolean>
}

export interface PaymentSettings {
  minDepositAmount: number
  maxDepositAmount: number
  minWithdrawalAmount: number
  maxWithdrawalAmount: number
  dailyWithdrawalLimit: number
  monthlyWithdrawalLimit: number
  autoApprovalLimit: number
  defaultCurrency: string
  enabledCurrencies: string[]
  maintenanceMode: boolean
  maintenanceMessage: string
}

export interface NotificationData {
  id: number
  title: string
  message: string
  type: 'new_user' | 'info' | 'success' | 'warning' | 'error' | 'system'
  created_at: string
}

export interface UserNotification {
  id: number
  user_id: number
  notification_id: number
  is_read: boolean
  read_at: string | null
  notification: NotificationData
}

export interface NotificationCreateRequest {
  title: string
  message: string
  type: 'new_user' | 'info' | 'success' | 'warning' | 'error' | 'system'
}

export interface NotificationCountResponse {
  count: number
}
