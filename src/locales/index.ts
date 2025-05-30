import { createI18n } from 'vue-i18n'
import ru from './ru'
import en from './en'

// Получаем сохраненный язык или используем русский по умолчанию
const savedLocale = localStorage.getItem('locale') || 'ru'

export const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'ru',
  messages: {
    ru,
    en,
  },
})

export const availableLocales = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
] as const

export type LocaleCode = (typeof availableLocales)[number]['code']

export function setLocale(locale: LocaleCode) {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
  document.documentElement.lang = locale
}
