<template>
  <div class="exercise-logger">
    <h6 class="text-center mb-3">{{ selectedExercise?.name }}</h6>

    <div class="input-group mb-2">
      <span class="input-group-text fs-6">Add</span>
      <b-input
        v-model="numOfRepetitions"
        type="number"
        placeholder="Count of repetitions"
      />
      <span class="input-group-text">{{ selectedExercise?.measurement }}</span>
    </div>

    <b-button
      color="primary"
      class="w-100"
      @click="logRepetitions(numOfRepetitions)"
    >
      Add progress
    </b-button>

    <div
      v-show="false"
      class="input-group mb-3"
    >
      <b-input
        v-model="numOfRepetitions"
        type="number"
        placeholder="Count of repetitions"
      />
      <b-button
        color="primary"
        class="col-7"
        @click="logRepetitions(numOfRepetitions)"
      >
        Add {{ selectedExercise?.measurement }}
      </b-button>
    </div>

    <b-alert
      v-if="showNotification"
      message="Progress added successfully."
      closable
      auto-close
      color="success"
      class="mt-2"
      @click="showNotification = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useExerciseStore } from '@/presentation/stores/exerciseStore'
import type { Exercise } from '@/domain/entities/Exercise'
import BInput from '@/presentation/components/shared/BInput.vue'
import BButton from '@/presentation/components/shared/BButton.vue'
import BAlert from '@/presentation/components/shared/BAlert.vue'

const props = defineProps<{ selectedExercise: Exercise | null }>()
const store = useExerciseStore()
const numOfRepetitions = ref<number>(10)
const showNotification = ref(false)

// Повторения
const logRepetitions = async (amount: number) => {
  if (props.selectedExercise) {
    try {
      await store.logExercise(props.selectedExercise.id, amount, 'repetitions')
      showNotification.value = true
    } catch (e) {
      console.error(e)
    }
  }
}

</script>

<style lang="scss" scoped>
</style>
