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
  type: 'deposit' | 'withdrawal' | 'bonus' | 'game_win' | 'game_loss'
  amount: number
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  method?: string
  description: string
  created_at: string
  updated_at: string
  user?: {
    id: number
    username: string
    email: string | null
  }
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
