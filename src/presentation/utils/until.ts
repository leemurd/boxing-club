// src/presentation/utils/until.ts
import { watch } from 'vue'

/**
 * Ждёт, пока predicate() не вернёт true.
 */
export function until(predicate: () => boolean): Promise<void> {
  return new Promise((resolve) => {
    if (predicate()) {
      return resolve()
    }
    const stop = watch(predicate, (val) => {
      if (val) {
        stop()
        resolve()
      }
    })
  })
}
