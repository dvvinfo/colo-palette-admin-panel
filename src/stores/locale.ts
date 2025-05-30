import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { setLocale, availableLocales, type LocaleCode } from '@/locales'

export const useLocaleStore = defineStore('locale', () => {
  const currentLocale = ref<LocaleCode>((localStorage.getItem('locale') as LocaleCode) || 'ru')

  const currentLocaleData = computed(() => {
    return availableLocales.find(locale => locale.code === currentLocale.value) || availableLocales[0]
  })

  function changeLocale(locale: LocaleCode) {
    currentLocale.value = locale
    setLocale(locale)
  }

  return {
    currentLocale,
    currentLocaleData,
    changeLocale,
    availableLocales
  }
})
