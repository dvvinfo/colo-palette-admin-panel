import { watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

export function useDocumentTitle() {
  const { t, locale } = useI18n()
  const route = useRoute()

  const updateTitle = () => {
    // Получаем название страницы по роуту
    const routeName = route.name as string
    let titleKey = 'documentTitle.adminPanel'

    // Определяем ключ для перевода в зависимости от роута
    switch (routeName) {
      case 'login':
        titleKey = 'documentTitle.login'
        break
      case 'dashboard':
      case 'home':
        titleKey = 'documentTitle.dashboard'
        break
      case 'users':
        titleKey = 'documentTitle.users'
        break
      case 'games':
        titleKey = 'documentTitle.games'
        break
      case 'transactions':
        titleKey = 'documentTitle.transactions'
        break
      case 'bonuses':
        titleKey = 'documentTitle.bonuses'
        break
      case 'analytics':
        titleKey = 'documentTitle.analytics'
        break
      case 'settings':
        titleKey = 'documentTitle.settings'
        break
      case 'profile':
        titleKey = 'documentTitle.profile'
        break
      default:
        titleKey = 'documentTitle.adminPanel'
    }

    // Обновляем заголовок документа
    document.title = t(titleKey)

    // Обновляем lang атрибут в html
    document.documentElement.lang = locale.value
  }

  // Отслеживаем изменения языка и роута
  watch([locale, () => route.name], updateTitle, { immediate: true })

  // Обновляем заголовок при монтировании
  onMounted(updateTitle)

  return {
    updateTitle
  }
}
