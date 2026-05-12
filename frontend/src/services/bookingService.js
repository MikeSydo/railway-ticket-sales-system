export async function getTrainDetails(trainId, signal) {
  const response = await fetch(`/api/trains/${trainId}`, { signal })

  if (!response.ok) {
    throw new Error('Не вдалося завантажити дані рейсу.')
  }

  return response.json()
}

async function parseJsonResponse(response) {
  const raw = await response.text()
  const normalized = raw.replace(/^\uFEFF/, '')

  try {
    return normalized ? JSON.parse(normalized) : {}
  } catch (_error) {
    throw new Error('Сервер повернув некоректну відповідь.')
  }
}

export async function getWagonSeats(trainId, wagonId, signal) {
  const response = await fetch(`/api/trains/${trainId}/wagons/${wagonId}/seats`, {
    signal,
  })

  if (!response.ok) {
    throw new Error('Не вдалося завантажити схему місць.')
  }

  return response.json()
}

export async function createBooking(payload, token) {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await parseJsonResponse(response)

  if (!response.ok) {
    throw new Error(data.message || 'Не вдалося створити бронювання.')
  }

  return data
}

export async function getMyBookings(token, signal) {
  const response = await fetch('/api/bookings/my', {
    signal,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await parseJsonResponse(response)

  if (!response.ok) {
    throw new Error(data.message || 'Не вдалося отримати бронювання.')
  }

  return data.items
}

export async function cancelBooking(bookingId, token) {
  const response = await fetch(`/api/bookings/${bookingId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await parseJsonResponse(response)

  if (!response.ok) {
    throw new Error(data.message || 'Не вдалося скасувати бронювання.')
  }

  return data
}
