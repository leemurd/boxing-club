<template>
  <div
    ref="timerEl"
    class="bc-timer"
    :class="{ 'bc-timer--expanded': isTimerExpanded }"
    @click="toggleExpandTimer"
  >
    <div class="bc-timer-header">
      <div class="bc-timer-counter">{{ formattedTime }}</div>
      <div
        class="bc-timer-btns"
        @click.stop.prevent
      >
        <i
          v-if="isTimerRunning"
          class="bi bi-stop-fill display-5"
          @click="resetTimer"
        />
        <i
          :class="[`bi bi-${isTimerRunning ? 'pause' : 'play'}-fill display-5`]"
          @click="toggleRunTimer"
        />
        <i
          class="bi bi-x display-5"
          @click="closeTimer"
        />
      </div>
    </div>

    <div
      class="bc-timer-body"
      @click.stop
    >
      <div class="mt-3"/>
      <b-button-group
        v-model="modelTimerMode"
        :items="['stopwatch', 'countdown']"
        :disabled="isTimerRunning"
        class="w-100"
        color="light"
        outline
      >
        <template #default="{ item }">
          <span class="text-capitalize">{{ item }}</span>
        </template>
      </b-button-group>

      <div
        v-if="timerMode === 'countdown'"
        class="mt-2"
      >
        <label for="secondsInput">Seconds:</label>

        <div class="input-group mb-3">
          <div class="dropdown">
            <b-button
              ref="modeSwitcherRef"
              outline
              color="light"
              class="dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >Dropdown</b-button>
            <ul class="dropdown-menu">
              <li><a
                class="dropdown-item"
                href="#"
              >Minutes</a></li>
              <li><a
                class="dropdown-item"
                href="#"
              >Seconds</a></li>
            </ul>
          </div>

          <b-input
            id="secondsInput"
            v-model.number="secondsInput"
            type="number"
            min="1"
            :disabled="isTimerRunning"
            @change="setInitialSeconds(secondsInput)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTimerStore } from '@/presentation/stores/timerStore'
import { storeToRefs } from 'pinia'
import BButtonGroup from '@/presentation/components/shared/BButtonGroup.vue'
import BInput from '@/presentation/components/shared/BInput.vue'
import BButton from '@/presentation/components/shared/BButton.vue'
import { Dropdown } from 'bootstrap'

const timerEl = ref()
const timerStore = useTimerStore()
const {
  isTimerExpanded,
  isTimerRunning,
  formattedTime,
  timerMode,
  initialSeconds
} = storeToRefs(timerStore)

const modelTimerMode = computed({
  get: () => timerMode.value,
  set: (val: 'countdown' | 'stopwatch') => setMode(val)
})

const {
  toggleExpandTimer,
  toggleRunTimer,
  closeTimer,
  resetTimer,
  setMode,
  setInitialSeconds
} = timerStore

const secondsInput = ref(initialSeconds?.value)

// timer dropdown
// const dropdownToggle = document.querySelector('.dropdown-toggle')
// const dropdownToggle = useTemplateRef('modeSwitcherRef')
// let dropdown = null
// const initModeDropdown = () => {
//   // console.log(Dropdown)
//   setTimeout(() => {
//     dropdown = timerMode.value === 'countdown' ? new Dropdown(dropdownToggle) : null
//   }, 200)
//
// }

// watch(() => timerMode.value, () => {
//   initModeDropdown()
// }, {
//   immediate: true
// })
//
// onMounted(() => {
//   initModeDropdown()
// })
// end timer dropdown
</script>

<style scoped lang="scss">
@import "@/presentation/styles/mixins";

.bc-timer {
  position: absolute;
  top: 100%;
  width: 100%;
  left: 0;
  background: $blue-700;
  transition: $transition-base;
  padding: 10px 20px;
  color: $white;
  min-height: $timerCollapsedHeight;
  cursor: pointer;
  &--expanded {
    .bc-timer-body {
      min-height: $timerBodyHeight;
      max-height: $timerBodyHeight;
      //height: auto;
    }
  }
  &-header {
    display: flex;
    justify-content: space-between;
  }
  &-counter {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    letter-spacing: 1px;
  }
  &-btns {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  &-body {
    min-height: 0;
    max-height: 0;
    transition: $transition-base;
    overflow: hidden;
  }
}
</style>
