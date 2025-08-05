import { useApi } from '@/api/useApiTS'

export const uploadPhoto = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await useApi<{ id: string; url: string }>('/api/photos', {
    method: 'POST',
    body: formData,
  })
  return data.value!
}
