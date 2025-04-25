import { defineStore } from 'pinia'
import { computed, reactive, ref, type ComputedRef } from 'vue'

type TimerMode = 'countdown' | 'stopwatch'

interface TimerState {
  timerState: ComputedRef
  timerValue: ComputedRef<number>
  formattedTime: ComputedRef<string>
  isTimerExpanded: ComputedRef
  isTimerRunning: ComputedRef
  isTimerVisible: ComputedRef
  toggleExpandTimer: () => void
  toggleRunTimer: () => void
  toggleTimerVisible: () => void
  closeTimer: () => void
  resetTimer: () => void
  setMode: (mode: TimerMode) => void
  setInitialSeconds: (seconds: number) => void
  timerMode: ComputedRef<TimerMode>
  initialSeconds: ComputedRef<number>
}

export const useTimerStore = defineStore('timer', (): TimerState => {
  const timerState = reactive({
    isVisible: true,
    isExpanded: false,
    isRunning: false,
    mode: 'stopwatch' as TimerMode,
    initialSeconds: 180
  })

  const time = ref(timerState.mode === 'stopwatch' ? 0 : timerState.initialSeconds)
  const intervalId = ref<number | null>(null)

  const formattedTime = computed(() => {
    // if (timerState.mode === 'stopwatch') {
    //   time.value = 0
    // }
    const minutes = Math.floor(time.value / 60)
      .toString()
      .padStart(2, '0')
    const seconds = (time.value % 60).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
  })

  const startTimer = () => {
    if (intervalId.value !== null) return
    intervalId.value = setInterval(() => {
      if (timerState.mode === 'countdown') {
        if (time.value > 0) {
          time.value--
        } else {
          stopTimer()
        }
      } else {
        time.value++
      }
    }, 1000)
  }

  const stopTimer = () => {
    if (intervalId.value !== null) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
  }

  const resetTimer = () => {
    stopTimer()
    time.value = timerState.mode === 'countdown' ? timerState.initialSeconds : 0
    timerState.isRunning = false
  }

  const toggleExpandTimer = () => {
    timerState.isExpanded = !timerState.isExpanded
  }

  const toggleRunTimer = () => {
    timerState.isRunning = !timerState.isRunning
    timerState.isRunning ? startTimer() : stopTimer()
  }

  const toggleTimerVisible = () => {
    timerState.isVisible = !timerState.isVisible
    if (!timerState.isVisible) {
      closeTimer()
    }
  }

  const closeTimer = () => {
    timerState.isVisible = false
    timerState.isExpanded = false
    timerState.isRunning = false
    resetTimer()
  }

  const setMode = (mode: TimerMode) => {
    timerState.mode = mode
    resetTimer()
    console.log(111)
  }

  const setInitialSeconds = (seconds: number) => {
    timerState.initialSeconds = seconds
    if (timerState.mode === 'countdown') {
      time.value = seconds
    }
  }

  return {
    timerState: computed(() => timerState),
    timerValue: computed(() => time.value),
    formattedTime,
    isTimerVisible: computed(() => timerState.isVisible),
    isTimerExpanded: computed(() => timerState.isExpanded),
    isTimerRunning: computed(() => timerState.isRunning),
    timerMode: computed(() => timerState.mode),
    initialSeconds: computed(() => timerState.initialSeconds),
    toggleExpandTimer,
    toggleRunTimer,
    toggleTimerVisible,
    closeTimer,
    resetTimer,
    setMode,
    setInitialSeconds
  }
})
