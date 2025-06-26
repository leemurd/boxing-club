<template>
  <!--  <page-default>-->
  <div class="punch-counter">
    <!-- Ручной режим -->
    <template v-if="!recording && !timerActive">
      <div
        class="mode-controls"
      >
        <div>Free mode:</div>
        <b-button
          color="dark"
          size="large"
          @click="startManualRecording"
        >
          TrainingRecord
        </b-button>
      </div>

      <hr>
    </template>


    <!-- Таймерный режим -->
    <template v-if="!recording && !timerActive">
      <div
        class="timer-controls"
      >
        <label for="intervalSelect">TrainingRecord with timer:</label>
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
            {{ option }} sec
          </option>
        </select>
        <b-button
          color="primary"
          size="large"
          @click="startTimerRecording"
        >
          Start recording with timer
        </b-button>
      </div>

      <hr>
    </template>

    <div
      v-if="recording"
      class="punch-counter-total mt-5 mb-5"
    >
      <h1 class="punch-counter-total__title">
        Счет ударов: {{ punchCount }}
        <div
          class="spinner-grow punch-counter-total__spinner"
          style="width: 5rem; height: 5rem;"
          role="status"
        />
      </h1>
      <p v-if="timerActive">Осталось: {{ timeLeft }} сек</p>
    </div>

    <div class="controls">
      <b-button
        v-if="recording"
        color="danger"
        size="large"
        class="w-100"
        @click="resetCounter"
      >
        Reset
      </b-button>
    </div>

    <!-- Range input для порога и cooldown -->
    <b-button
      color="medium"
      class="mt-3 font-sans"
      type="button"
      size="small"
      :outline="!isSettingsOpened"
      aria-controls="navbarSupportedContent2"
      aria-expanded="false"
      aria-label="Toggle navigation"
      @click="toggleNavbar"
    >
      microphone settings:
      <i :class="`bi-chevron-${isSettingsOpened ? 'contract' : 'expand'}`"/>
    </b-button>

    <div
      id="navbarSupportedContent2"
      class="collapse mt-3"
    >
      <div class="card card-body border-0">
        <label>
          Level: {{ threshold }}
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
        <label>
          Min gap between punches (мс): {{ cooldown }}
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
  </div>
<!--  </page-default>-->

</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
// import { Collapse } from 'bootstrap'
import BButton from '@/presentation/components/shared/BButton.vue'
import { useToast } from 'vue-toastification'
import PageDefault from '@/presentation/components/layout/page/PageDefault.vue'

const toast = useToast()

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
    error.value = err.message || 'Microphone connection failed'
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

// toggle microphone
const isSettingsOpened = ref(false)

function toggleNavbar() {
  // const navbar = document.getElementById('navbarSupportedContent2')
  // if (navbar) {
  //   let bsCollapse = Collapse.getInstance(navbar)
  //   if (!bsCollapse) {
  //     bsCollapse = new Collapse(navbar, { toggle: false })
  //   }
  //   bsCollapse.toggle()
  //   isSettingsOpened.value = !isSettingsOpened.value
  // }
}

watch(() => error.value, (val) => {
  if (val) toast.error(val)
})

onMounted(() => {
  loadSettings()
})
onUnmounted(() => {
  stopRecording()
})
</script>

<style scoped>
.punch-counter {
  padding: 0 10px;
  text-align: center;
  &-total {
    background: red;
    &__title {
      position: relative;
    }
    &__spinner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
.mode-controls,
.timer-controls {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
