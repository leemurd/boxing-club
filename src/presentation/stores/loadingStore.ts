// src/presentation/stores/loadingStore.ts
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useLoadingStore = defineStore('loadingStore', () => {
  const count = ref(0)
  const visible = ref(false)

  let showTimer: number | null = null
  let hideTimer: number | null = null

  watch(count, (c) => {
    if (c > 0) {
      if (hideTimer !== null) {
        clearTimeout(hideTimer)
        hideTimer = null
      }
      if (showTimer === null && !visible.value) {
        showTimer = window.setTimeout(() => {
          visible.value = true
          showTimer = null
        }, 350)
      }
    } else {
      if (showTimer !== null) {
        clearTimeout(showTimer)
        showTimer = null
      }
      if (hideTimer === null && visible.value) {
        hideTimer = window.setTimeout(() => {
          visible.value = false
          hideTimer = null
        }, 200)
      }
    }
  })

  const isLoading = computed(() => visible.value)

  function start() {
    count.value++
  }

  function finish() {
    if (count.value > 0) count.value--
  }

  return {
    count,
    isLoading,
    start,
    finish
  }
})
