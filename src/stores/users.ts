import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/services/api'
import { userApi, authApi } from '@/services/api'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAllUsers() {
    try {
      loading.value = true
      error.value = null
      const { data } = await userApi.getAllUsers()
      users.value = data
    } catch (err) {
      error.value = 'Не удалось загрузить список пользователей'
      console.error('Ошибка при загрузке пользователей:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchUserById(id: number) {
    try {
      loading.value = true
      error.value = null
      const { data } = await userApi.getUserById(id)
      return data
    } catch (err) {
      error.value = 'Не удалось загрузить пользователя'
      console.error('Ошибка при загрузке пользователя:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

          async function createUser(userData: {
    username: string
    email: string
    password: string
    role: string
    balance?: number
  }) {
    try {
      loading.value = true
      error.value = null

      // 1. Сначала регистрируем пользователя через обычную регистрацию
      const authResponse = await authApi.register({
        username: userData.username,
        email: userData.email,
        password: userData.password
      })

      const userId = authResponse.data.user_id

      // 2. Устанавливаем роль, если она указана и отличается от дефолтной
      if (userData.role && userData.role !== 'user') {
        // Правильное соответствие: user = 1, admin = 2
        const roleId = userData.role === 'admin' ? 2 : 1
        await userApi.setUserRole(userId, roleId)
      }

      // 3. Устанавливаем баланс, если он указан и больше 0
      if (userData.balance && userData.balance > 0) {
        await userApi.setUserBalance(userId, userData.balance)
      }

      // 4. Получаем обновленную информацию о пользователе
      const { data: newUser } = await userApi.getUserById(userId)

      // Добавляем нового пользователя в список
      users.value.push(newUser)

      return newUser
    } catch (err) {
      error.value = 'Не удалось создать пользователя'
      console.error('Ошибка при создании пользователя:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

    async function updateUserRole(userId: number, roleId: number) {
    try {
      loading.value = true
      error.value = null

      await userApi.setUserRole(userId, roleId)
    } catch (err) {
      error.value = 'Не удалось обновить роль пользователя'
      console.error('Ошибка при обновлении роли:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateUserBalance(userId: number, amount: number) {
    try {
      loading.value = true
      error.value = null

      await userApi.setUserBalance(userId, amount)
    } catch (err) {
      error.value = 'Не удалось обновить баланс пользователя'
      console.error('Ошибка при обновлении баланса:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    loading,
    error,
    fetchAllUsers,
    fetchUserById,
    createUser,
    updateUserRole,
    updateUserBalance,
  }
})
