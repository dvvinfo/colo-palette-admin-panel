declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      render: (
        element: HTMLElement | string,
        options: {
          sitekey: string
          theme?: 'light' | 'dark'
          size?: 'compact' | 'normal' | 'invisible'
          callback?: (token: string) => void
          'expired-callback'?: () => void
          'error-callback'?: () => void
        }
      ) => number
      execute: {
        (sitekey: string, options?: { action: string }): Promise<string>
        (widgetId: number): void
      }
      reset: (widgetId?: number) => void
      getResponse: (widgetId?: number) => string
    }
    onRecaptchaSuccess?: (token: string) => void
    onRecaptchaExpired?: () => void
    onRecaptchaError?: () => void
  }
}

export interface RecaptchaConfig {
  siteKey: string
  version: 'v2' | 'v3'
  theme?: 'light' | 'dark' | 'invisible'
  size?: 'compact' | 'normal'
  action?: string
}

export interface RecaptchaInstance {
  reset: () => void
  getToken: () => Promise<string | null>
  executeInvisibleRecaptcha: () => void
}
