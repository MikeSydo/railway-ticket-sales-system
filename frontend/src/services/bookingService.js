export async function getTrainDetails(trainId, signal) {
  const response = await fetch(`/api/trains/${trainId}`, { signal })

  if (!response.ok) {
    throw new Error('Не вдалося завантажити дані рейсу.')
  }

  return response.json()
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

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Не вдалося створити бронювання.')
  }

  return data
}
