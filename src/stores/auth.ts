import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/services/api'
import { authApi, userApi } from '@/services/api'
import Cookies from 'js-cookie'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(Cookies.get('access_token') || null)
  const refreshToken = ref<string | null>(Cookies.get('refresh_token') || null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!accessToken.value)

  async function login(username: string, password: string) {
    try {
      loading.value = true
      error.value = null
      const { data } = await authApi.login({ username, password })
      setTokens(data.access_token, data.refresh_token)
      await fetchUser()
      return { success: true }
    } catch (err: unknown) {
      console.error('Login error:', err)
      let errorMessage = 'Произошла неизвестная ошибка'

      // Проверяем различные типы ошибок
      if (err && typeof err === 'object') {
        const errorObj = err as any

        if ('response' in errorObj && errorObj.response) {
          // Ошибки от сервера (AxiosError)
          const status = errorObj.response.status
          const data = errorObj.response.data

          console.log('Server error details:', { status, data })

          switch (status) {
            case 400:
              errorMessage = data?.message || data?.detail || 'Неверные данные для входа'
              break
            case 401:
              errorMessage = 'Неверный логин или пароль'
              break
            case 403:
              errorMessage = 'Доступ запрещен'
              break
            case 422:
              errorMessage = data?.message || 'Ошибка валидации данных'
              break
            case 429:
              errorMessage = 'Слишком много попыток входа. Попробуйте позже'
              break
            case 500:
              errorMessage = 'Ошибка сервера. Попробуйте позже'
              break
            case 502:
              errorMessage = 'Сервер временно недоступен'
              break
            case 503:
              errorMessage = 'Сервис временно недоступен'
              break
            default:
              errorMessage = data?.message || data?.detail || `Ошибка сервера (${status})`
          }
        } else if ('request' in errorObj && errorObj.request) {
          // Ошибки сети (нет ответа от сервера)
          console.log('Network error details:', errorObj)

          if (errorObj.code === 'ECONNABORTED') {
            errorMessage = 'Время ожидания истекло. Проверьте соединение'
          } else if (errorObj.code === 'ERR_NETWORK') {
            errorMessage = 'Ошибка сети. Проверьте подключение к интернету'
          } else if (errorObj.code === 'ERR_INTERNET_DISCONNECTED') {
            errorMessage = 'Нет подключения к интернету'
          } else {
            errorMessage = 'Не удается подключиться к серверу'
          }
        } else if ('message' in errorObj) {
          // Другие ошибки с сообщением
          if (errorObj.message.includes('CORS')) {
            errorMessage = 'Ошибка CORS. Обратитесь к администратору'
          } else if (errorObj.message.includes('NetworkError')) {
            errorMessage = 'Ошибка сети при выполнении запроса'
          } else {
            errorMessage = errorObj.message
          }
        }
      } else if (err instanceof Error) {
        console.log('Error instance details:', err)
        errorMessage = err.message
      }

      // Добавляем дополнительную информацию для отладки
      console.error('Detailed login error:', {
        error: err,
        errorMessage,
        type: typeof err,
        isAxiosError: err && typeof err === 'object' && 'isAxiosError' in err
      })

      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  async function register(username: string, email: string, password: string) {
    try {
      loading.value = true
      const { data } = await authApi.register({ username, email, password })
      setTokens(data.access_token, data.refresh_token)
      await fetchUser()
      return true
    } catch (error) {
      console.error('Register error:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  async function loginWithGoogle() {
    try {
      loading.value = true
      const { data } = await authApi.googleAuth()
      setTokens(data.access_token, data.refresh_token)
      await fetchUser()
      return true
    } catch (error) {
      console.error('Google login error:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  async function loginWithTelegram() {
    try {
      loading.value = true
      const { data } = await authApi.telegramAuth()
      setTokens(data.access_token, data.refresh_token)
      await fetchUser()
      return true
    } catch (error) {
      console.error('Telegram login error:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  async function loginWithVK() {
    try {
      loading.value = true
      const { data } = await authApi.vkAuth()
      setTokens(data.access_token, data.refresh_token)
      await fetchUser()
      return true
    } catch (error) {
      console.error('VK login error:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  async function handleGoogleCallback(code: string) {
    try {
      loading.value = true
      const { data } = await authApi.googleCallback(code)
      setTokens(data.access_token, data.refresh_token)
      await fetchUser()
      return true
    } catch (error) {
      console.error('Google callback error:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      loading.value = true
      clearTokens()
      user.value = null
      // Перенаправление на страницу логина будет обработано в роутере
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchUser() {
    try {
      loading.value = true
      const { data } = await userApi.getProfile()
      user.value = data
      error.value = null
    } catch (err: unknown) {
      console.error('Fetch user error:', err)
      clearTokens()
      user.value = null
      error.value = err instanceof Error ? err.message : 'Ошибка при загрузке профиля'
    } finally {
      loading.value = false
    }
  }

  function setTokens(access: string, refresh: string) {
    accessToken.value = access
    refreshToken.value = refresh
    // Устанавливаем cookies с настройками безопасности
    Cookies.set('access_token', access, {
      secure: true, // Только для HTTPS
      sameSite: 'strict', // Защита от CSRF
      expires: 1 / 24, // 1 час для access token
    })
    Cookies.set('refresh_token', refresh, {
      secure: true,
      sameSite: 'strict',
      expires: 7, // 7 дней для refresh token
    })
  }

  function clearTokens() {
    accessToken.value = null
    refreshToken.value = null
    Cookies.remove('access_token')
    Cookies.remove('refresh_token')
  }

  function forceLogout() {
    clearTokens()
    user.value = null
    error.value = null
    // Перенаправление будет обработано в router guard
  }

  // Инициализация при загрузке приложения
  if (accessToken.value) {
    fetchUser()
  }

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    loginWithGoogle,
    loginWithTelegram,
    loginWithVK,
    handleGoogleCallback,
    logout,
    fetchUser,
    forceLogout,
  }
})
