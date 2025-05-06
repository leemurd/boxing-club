import { defineStore } from 'pinia'
import { computed, reactive, ref, type ComputedRef } from 'vue'

type TimerMode = 'countdown' | 'stopwatch'
type TimerUnit = 'seconds' | 'minutes'

interface TimerState {
  timerState: ComputedRef
  timerValue: ComputedRef<number>
  formattedTime: ComputedRef<string>
  isTimerExpanded: ComputedRef
  isTimerRunning: ComputedRef
  isTimerVisible: ComputedRef
  timerMode: ComputedRef<TimerMode>
  timerUnit: ComputedRef<TimerUnit>
  initialInput: ComputedRef<number>
  toggleExpandTimer: () => void
  toggleRunTimer: () => void
  toggleTimerVisible: () => void
  closeTimer: () => void
  resetTimer: () => void
  setMode: (mode: TimerMode) => void
  setInitialInput: (value: number) => void
  setUnit: (unit: TimerUnit) => void
}

export const useTimerStore = defineStore('timer', (): TimerState => {
  const timerState = reactive({
    isVisible: true,
    isExpanded: false,
    isRunning: false,
    mode: 'stopwatch' as TimerMode,
    unit: 'seconds' as TimerUnit,
    initialInput: 180
  })

  const time = ref(timerState.mode === 'stopwatch' ? 0 : timerState.initialInput)
  const intervalId = ref<number | null>(null)

  const formattedTime = computed(() => {
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
    time.value = timerState.mode === 'countdown'
      ? timerState.unit === 'minutes' ? timerState.initialInput * 60 : timerState.initialInput
      : 0
    timerState.isRunning = false
  }

  const toggleExpandTimer = () => {
    timerState.isExpanded = !timerState.isExpanded
  }

  const toggleRunTimer = () => {
    timerState.isRunning = !timerState.isRunning
    if (timerState.isRunning) startTimer()
    else stopTimer()
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
  }

  const setUnit = (unit: TimerUnit) => {
    timerState.unit = unit
    resetTimer()
  }

  const setInitialInput = (value: number) => {
    timerState.initialInput = value
    if (timerState.mode === 'countdown') {
      time.value = timerState.unit === 'minutes' ? value * 60 : value
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
    timerUnit: computed(() => timerState.unit),
    initialInput: computed(() => timerState.initialInput),
    toggleExpandTimer,
    toggleRunTimer,
    toggleTimerVisible,
    closeTimer,
    resetTimer,
    setMode,
    setInitialInput,
    setUnit
  }
})
