<template>
  <div class="trainings-page py-4">
    <div class="mb-3">
      <label class="form-label text-center w-100">Select Exercise Type:</label>

      <b-button-group
        v-model="selectedType"
        color="dark"
        outline
        class="w-100"
        :items="[ExerciseCategory.PHYSICS, ExerciseCategory.TECHNIQUE, ExerciseCategory.PRACTICE]"
      />
    </div>

    <div class="mb-4">
      <label class="form-label text-center w-100">Choose Exercise:</label>

      <b-button-group
        v-if="selectedExerciseId"
        v-model="selectedExerciseId"
        color="dark"
        outline
        vertical
        option-value="id"
        class="w-100"
        :items="filteredExercises"
      >
        <template #default="{ item }">
          {{ item.name }}
          <span
            v-if="item.measurement === 'minutes'"
            class="badge text-bg-secondary"
          >Min</span>
        </template>
      </b-button-group>
    </div>

    <exercise-logger
      v-if="selectedExercise"
      :selected-exercise="selectedExercise"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useExerciseStore } from '@/presentation/stores/exerciseStore'
import { type Exercise, ExerciseCategory } from '@/domain/entities/Exercise'
import ExerciseLogger from '@/presentation/components/trainings/ExerciseLogger.vue'
import BButtonGroup from '@/presentation/components/shared/BButtonGroup.vue'

const store = useExerciseStore()

// Выбранный тип упражнения: technique, strength, practice
const selectedType = ref<ExerciseCategory>(ExerciseCategory.PHYSICS)

// ID выбранного упражнения
const selectedExerciseId = ref<string | null>(null)

// Фильтруем список упражнений по выбранному типу
const filteredExercises = computed<Exercise[]>(() => {
  return store.exercises.filter((ex: Exercise) => ex.category === selectedType.value)
})

// Получаем объект выбранного упражнения
const selectedExercise = computed<Exercise | null>(() => {
  return store.exercises.find((ex: Exercise) => ex.id === selectedExerciseId.value) || null
})

onMounted(async () => {
  await store.loadExercises()
  selectedExerciseId.value = filteredExercises.value[0].id
  // Устанавливаем дефолтное упражнение для выбранного типа
  const filtered = store.exercises.filter((ex: Exercise) => ex.category === selectedType.value)
  if (filtered.length > 0) {
    selectedExerciseId.value = filtered[0].id
  }
})

// При смене выбранного типа сбрасываем выбранное упражнение
watch(selectedType, (newType) => {
  const filtered = store.exercises.filter((ex: Exercise) => ex.category === newType)
  selectedExerciseId.value = filtered.length > 0 ? filtered[0].id : null
}, {
  immediate: true
})
</script>

<style scoped>
.trainings-page {
  .badge {
    font-size: 10px;
    vertical-align: middle;
  }
}
</style>
