export async function getTrainDetails(trainId, signal) {
  const response = await fetch(`/api/trains/${trainId}`, { signal })

  if (!response.ok) {
    throw new Error('Не вдалося завантажити дані рейсу.')
  }

  return response.json()
}
