<template>
  <div class="punch-counter">
    <h1>Punch Counter</h1>

    <!-- Ручной режим -->
    <template v-if="!recording && !timerActive">
      <div
        class="mode-controls"
      >
        <div>Свободный режим</div>
        <button
          class="btn btn-primary btn-lg"
          @click="startManualRecording"
        >
          Запись
        </button>
      </div>

      <hr>
    </template>


    <!-- Таймерный режим -->
    <template v-if="!recording && !timerActive">
      <div
        class="timer-controls"
      >
        <label for="intervalSelect">Запись с обратным отсчетом</label>
        <select
          id="intervalSelect"
          v-model.number="selectedInterval"
          class="form-select"
        >
          <option
            v-for="option in intervalOptions"
            :key="option"
            :value="option"
          >
            {{ option }} сек
          </option>
        </select>
        <button
          class="btn btn-primary btn-lg"
          @click="startTimerRecording"
        >
          Начать запись с таймером
        </button>
      </div>

      <hr>
    </template>


    <!-- Range input для порога и cooldown -->
    <div class="range-controls">
      <h5 class="">Микрофон:</h5>
      <div>
        <label>
          Чувствительность: {{ threshold }}
          <input
            v-model.number="threshold"
            type="range"
            min="100"
            max="1000"
            step="10"
            class="form-range"
            @input="saveSettings"
          >
        </label>
      </div>
      <div>
        <label>
          Интервал между ударами (мс): {{ cooldown }}
          <input
            v-model.number="cooldown"
            type="range"
            min="150"
            max="350"
            step="10"
            class="form-range"
            @input="saveSettings"
          >
        </label>
      </div>
    </div>

    <div class="status">
      <p>Счет ударов: {{ punchCount }}</p>
      <p v-if="timerActive">Осталось: {{ timeLeft }} сек</p>
    </div>

    <div class="controls">
      <button
        v-if="recording"
        class="btn btn-danger btn-lg w-100"
        @click="resetCounter"
      >Сброс</button>
    </div>

    <alert
      v-if="error"
      :message="error"
      class="error"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Alert from '@/presentation/components/shared/Alert.vue'

const recording = ref(false)
const timerActive = ref(false)
const punchCount = ref(0)
const error = ref('')
const timeLeft = ref(0)

// Настройки порога и cooldown; загружаем из localStorage или устанавливаем по умолчанию
const threshold = ref<number>(200)
const cooldown = ref<number>(300)

function loadSettings() {
  const savedThreshold = localStorage.getItem('threshold')
  const savedCooldown = localStorage.getItem('cooldown')
  if (savedThreshold) threshold.value = parseInt(savedThreshold)
  if (savedCooldown) cooldown.value = parseInt(savedCooldown)
}
function saveSettings() {
  localStorage.setItem('threshold', threshold.value.toString())
  localStorage.setItem('cooldown', cooldown.value.toString())
}

// Интервалы таймера (в секундах)
const intervalOptions = [5, 10, 15, 30, 60]
const selectedInterval = ref<number>(15)

// Web Audio API объекты
let audioCtx: AudioContext | null = null
let analyser: AnalyserNode | null = null
let mediaStream: MediaStream | null = null
let dataArray: Uint8Array
let animationFrameId: number | null = null
let timerInterval: number | null = null

let lastPunchTime = 0

function detectPunch() {
  if (!analyser) return
  analyser.getByteFrequencyData(dataArray)
  const peak = Math.max(...dataArray)
  const now = Date.now()
  if (peak > threshold.value && now - lastPunchTime > cooldown.value) {
    punchCount.value++
    lastPunchTime = now
  }
  if (recording.value) {
    animationFrameId = requestAnimationFrame(() => detectPunch())
  }
}

async function startManualRecording() {
  error.value = ''
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    audioCtx = new AudioContext()
    analyser = audioCtx.createAnalyser()
    const source = audioCtx.createMediaStreamSource(mediaStream)
    source.connect(analyser)
    analyser.fftSize = 2048
    dataArray = new Uint8Array(analyser.frequencyBinCount)
    recording.value = true
    punchCount.value = 0
    lastPunchTime = 0
    detectPunch()
  } catch (err: any) {
    error.value = err.message || 'Ошибка доступа к микрофону'
  }
}

async function startTimerRecording() {
  error.value = ''
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    audioCtx = new AudioContext()
    analyser = audioCtx.createAnalyser()
    const source = audioCtx.createMediaStreamSource(mediaStream)
    source.connect(analyser)
    analyser.fftSize = 2048
    dataArray = new Uint8Array(analyser.frequencyBinCount)
    recording.value = true
    timerActive.value = true
    punchCount.value = 0
    lastPunchTime = 0
    timeLeft.value = selectedInterval.value
    detectPunch()
    timerInterval = window.setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        stopRecording()
      }
    }, 1000)
  } catch (err: any) {
    error.value = err.message || 'Ошибка доступа к микрофону'
  }
}

function stopRecording() {
  recording.value = false
  timerActive.value = false
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  if (timerInterval !== null) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop())
    mediaStream = null
  }
  if (audioCtx) {
    audioCtx.close()
    audioCtx = null
  }
}

function resetCounter() {
  stopRecording()
  punchCount.value = 0
  timeLeft.value = 0
}

onMounted(() => {
  loadSettings()
})
onUnmounted(() => {
  stopRecording()
})
</script>

<style scoped>
.punch-counter {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
  padding: 1rem;
}
.mode-controls,
.timer-controls,
.range-controls {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.range-controls label {
  display: block;
  margin-bottom: 0.5rem;
}
</style>
