import { ref, type Ref } from 'vue'
import { useAlertStore } from '@/stores/alert'

export type ApiOptions = {
  method?: string
  body?: BodyInit
  headers?: Record<string, string>
}

export interface UseApiResult<T> {
  data: Ref<T | null>
  error: Ref<Error | null>
}

export const useApi = async <T>(
  url: string,
  options: ApiOptions = {},
  showSuccess = false,
  successText = 'Запрос успешно выполнен'
): Promise<UseApiResult<T>> => {
  const data: Ref<T | null> = ref(null) as Ref<T | null>
  const error: Ref<Error | null> = ref(null) as Ref<Error | null>
  const alert = useAlertStore()
  const base = import.meta.env.DEV ? '' : import.meta.env.VITE_API_URL || ''
  const fullUrl = `${base}${url}`

  try {
    const isForm = options.body instanceof FormData
    console.debug(`[useApi] ${options.method ?? 'GET'} ${fullUrl}`, {
      headers: options.headers,
      body: options.body,
    })

    const resp = await fetch(fullUrl, {
      method: options.method ?? 'GET',
      headers: {
        ...(isForm ? {} : { 'Content-Type': 'application/json' }),
        ...(options.headers ?? {}),
      },
      body: options.body,
    })

    if (!resp.ok) {
      let errBody = '<could not read response body>'
      try {
        errBody = await resp.text()
      } catch {}
      console.error(
        `[useApi] Error response from ${resp.url}:`,
        resp.status,
        resp.statusText,
        errBody
      )
      throw new Error(`HTTP ${resp.status} — ${resp.statusText}`)
    }

    // Если это ответ без тела (204 No Content или пустая строка) —
    // пропускаем JSON-парсинг
    const contentLength = resp.headers.get('content-length')
    if (resp.status === 204 || contentLength === '0') {
      data.value = null
    } else {
      // читаем JSON и приводим к T
      data.value = (await resp.json()) as T
    }

    if (showSuccess) {
      alert.addAlert(successText, 'success')
    }
  } catch (err: any) {
    const msg = err instanceof Error ? err.message : String(err)
    error.value = err instanceof Error ? err : new Error(msg)
    alert.addAlert(msg, 'error')
    throw err
  }

  return { data, error }
}
