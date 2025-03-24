<template>
  <div class="exercise-logger">
    <h6 class="text-center mb-3">{{ selectedExercise?.name }}</h6>
    <div class="small text-center text-muted">Add {{ selectedExercise?.measurement }}</div>

    <div class="d-flex gap-2 mb-2">
      <div class="col">
        <b-button
          color="secondary"
          outline
          class="px-3 w-100"
          @click="numOfRepetitions--"
        >-</b-button>
      </div>
      <div class="col">
        <b-input
          v-model="numOfRepetitions"
          type="number"
          placeholder="Count"
          class="text-center"
        />
      </div>
      <div class="col">
        <b-button
          color="secondary"
          outline
          class="px-3 w-100"
          @click="numOfRepetitions++"
        >+</b-button>
      </div>
    </div>

    <b-button
      color="primary"
      class="w-100"
      @click="logRepetitions(numOfRepetitions)"
    >
      Add progress
    </b-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useExerciseStore } from '@/presentation/stores/exerciseStore'
import type { Exercise } from '@/domain/entities/Exercise'
import BInput from '@/presentation/components/shared/BInput.vue'
import BButton from '@/presentation/components/shared/BButton.vue'
import { useToast } from "vue-toastification"

const props = defineProps<{ selectedExercise: Exercise | null }>()
const store = useExerciseStore()
const toast = useToast()
const numOfRepetitions = ref<number>(10)

// Повторения
const logRepetitions = async (amount: number) => {
  if (props.selectedExercise) {
    try {
      await store.logExercise(props.selectedExercise.id, amount, 'repetitions')
      toast.success(
        `${numOfRepetitions.value} ${props.selectedExercise?.measurement} of ${props.selectedExercise?.name} added successfully`
      )
    } catch (e) {
      toast.error(e)
    }
  }
}

</script>

<style lang="scss" scoped>
.max-w50pr {
  max-width: 50%;
}
</style>
