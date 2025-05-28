/**
 * API endpoint для валидации reCAPTCHA токенов
 * Vercel Serverless Function
 */

export default async function handler(req, res) {
  // Устанавливаем CORS заголовки
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { token, action, remoteip } = req.body

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'reCAPTCHA token is required'
      })
    }

    // Получаем секретный ключ из переменных окружения
    const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'

    // Валидируем токен с Google reCAPTCHA API
    const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify'
    const verificationData = new URLSearchParams({
      secret: secretKey,
      response: token,
      ...(remoteip && { remoteip })
    })

    const response = await fetch(verificationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: verificationData
    })

    const result = await response.json()

    console.log('reCAPTCHA verification result:', {
      success: result.success,
      action: action,
      score: result.score,
      hostname: result.hostname
    })

    // Для reCAPTCHA v3 проверяем score
    if (action && result.action !== action) {
      return res.status(400).json({
        success: false,
        error: 'Action mismatch',
        details: {
          expected: action,
          received: result.action
        }
      })
    }

    // Для v3 проверяем минимальный score (0.5 - стандартный порог)
    if (result.score !== undefined && result.score < 0.5) {
      console.warn('Low reCAPTCHA score:', result.score)
      return res.status(400).json({
        success: false,
        error: 'Low confidence score',
        score: result.score
      })
    }

    if (!result.success) {
      console.error('reCAPTCHA verification failed:', result['error-codes'])
      return res.status(400).json({
        success: false,
        error: 'reCAPTCHA verification failed',
        errorCodes: result['error-codes']
      })
    }

    // Успешная валидация
    return res.status(200).json({
      success: true,
      action: result.action,
      score: result.score,
      challenge_ts: result.challenge_ts,
      hostname: result.hostname
    })

  } catch (error) {
    console.error('reCAPTCHA validation error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error during reCAPTCHA validation'
    })
  }
}
