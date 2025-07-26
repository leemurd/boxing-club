// src/utils/withLoading.ts
import { useLoadingStore } from '@/presentation/stores/loadingStore'

export function withLoading<Args extends unknown[], R>(
  fn: (...args: Args) => Promise<R>
): (...args: Args) => Promise<R> {
  return async (...args: Args): Promise<R> => {
    const loading = useLoadingStore()
    loading.start()
    try {
      return await fn(...args)
    } finally {
      loading.finish()
    }
  }
}
