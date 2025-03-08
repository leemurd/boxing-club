<template>
  <div class="punch-counter">
    <h1>Punch Counter</h1>
    <p>Time left: {{ timeLeft }} s</p>
    <p>Punch count: {{ punchCount }}</p>
    <div class="buttons">
      <button
        v-if="!recording"
        @click="startRecording"
      >Start</button>
      <button
        v-if="recording"
        @click="stopRecording"
      >Stop</button>
      <button @click="resetCounter">Reset</button>
    </div>
    <p
      v-if="error"
      class="error"
    >{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

const recording = ref(false)
const punchCount = ref(0)
const timeLeft = ref(15)
const error = ref('')

let audioContext: AudioContext | null = null
let analyser: AnalyserNode | null = null
let mediaStream: MediaStream | null = null
let animationFrameId: number | null = null
let timerInterval: number | null = null

const threshold = 150 // порог для обнаружения удара
let lastPunchTime = 0
const cooldown = 300 // миллисекунд для предотвращения повторного счёта одного удара

async function startRecording() {
  error.value = ''
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    audioContext = new AudioContext()
    analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaStreamSource(mediaStream)
    source.connect(analyser)
    analyser.fftSize = 2048
    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    recording.value = true
    timeLeft.value = 15
    punchCount.value = 0
    lastPunchTime = 0
    startTimer()
    detectPunch(dataArray)
  } catch (err: any) {
    error.value = err.message || 'Ошибка доступа к микрофону'
  }
}

function detectPunch(dataArray: Uint8Array) {
  if (!analyser) return
  analyser.getByteFrequencyData(dataArray)
  const peak = Math.max(...dataArray)
  const now = Date.now()
  if (peak > threshold && now - lastPunchTime > cooldown) {
    punchCount.value++
    lastPunchTime = now
  }
  if (recording.value) {
    animationFrameId = requestAnimationFrame(() => detectPunch(dataArray))
  }
}

function startTimer() {
  timerInterval = window.setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      stopRecording()
    }
  }, 1000)
}

function stopRecording() {
  recording.value = false
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
  if (audioContext) {
    audioContext.close()
    audioContext = null
  }
}

function resetCounter() {
  stopRecording()
  punchCount.value = 0
  timeLeft.value = 15
}

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
.buttons button {
  margin: 0.5rem;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>
