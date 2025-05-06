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
          class="bi bi-stop-fill bc-timer-btns__item"
          @click="resetTimer"
        />
        <i
          :class="[`bi bi-${isTimerRunning ? 'pause' : 'play'}-fill bc-timer-btns__item`]"
          @click="toggleRunTimer"
        />
        <i
          class="bi bi-x bc-timer-btns__item"
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
        class="mt-3"
      >
        <div class="input-group mb-3">
          <select
            v-model="selectedUnit"
            class="form-select"
            :disabled="isTimerRunning"
          >
            <option value="seconds">Seconds</option>
            <option value="minutes">Minutes</option>
          </select>

          <b-input
            id="secondsInput"
            v-model.number="inputValue"
            type="number"
            min="1"
            :disabled="isTimerRunning"
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

const timerEl = ref()
const timerStore = useTimerStore()

const {
  isTimerExpanded,
  isTimerRunning,
  formattedTime,
  timerMode,
  timerUnit,
  initialInput
} = storeToRefs(timerStore)

const {
  toggleExpandTimer,
  toggleRunTimer,
  closeTimer,
  resetTimer,
  setMode,
  setInitialInput,
  setUnit
} = timerStore

const modelTimerMode = computed({
  get: () => timerMode.value,
  set: (val: 'countdown' | 'stopwatch') => setMode(val)
})

const selectedUnit = computed({
  get: () => timerUnit.value,
  set: (val: 'seconds' | 'minutes') => setUnit(val)
})

const inputValue = computed({
  get: () => initialInput.value,
  set: (val: number) => setInitialInput(val)
})
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
    &__item {
      font-size: 25px;
    }
  }
  &-body {
    min-height: 0;
    max-height: 0;
    transition: $transition-base;
    overflow: hidden;
  }
}
</style>
