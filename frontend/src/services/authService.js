async function parseJsonResponse(response) {
  const raw = await response.text()
  const normalized = raw.replace(/^\uFEFF/, '')

  try {
    return normalized ? JSON.parse(normalized) : {}
  } catch (_error) {
    throw new Error('Сервер повернув некоректну відповідь.')
  }
}

export async function loginByPhone(payload) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await parseJsonResponse(response)

  if (!response.ok) {
    throw new Error(data.message || 'Не вдалося виконати вхід.')
  }

  return data
}

export async function registerByPhone(payload) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await parseJsonResponse(response)

  if (!response.ok) {
    throw new Error(data.message || 'Не вдалося виконати реєстрацію.')
  }

  return data
}

export async function getCurrentUser(token, signal) {
  const response = await fetch('/api/auth/me', {
    signal,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await parseJsonResponse(response)

  if (!response.ok) {
    throw new Error(data.message || 'Не вдалося отримати користувача.')
  }

  return data.user
}
