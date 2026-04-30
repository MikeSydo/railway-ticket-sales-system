export async function getTrains(search = '', signal) {
  const params = new URLSearchParams()

  if (search.trim()) {
    params.set('search', search.trim())
  }

  const query = params.toString()
  const response = await fetch(`/api/trains${query ? `?${query}` : ''}`, {
    signal,
  })

  if (!response.ok) {
    throw new Error('Не вдалося завантажити список рейсів.')
  }

  const data = await response.json()
  return data.items
}
