<!-- src/presentation/components/pages/ExercisesPage.vue -->
<template>
  <div>
    <b-button
      color="green"
      outline
      class="w-100 mb-5"
      size="small"
      @click="$router.push('/exercises/new')"
    >
      + New Exercise
    </b-button>
    <exercise-logger />
  </div>
</template>

<script lang="ts" setup>
import ExerciseLogger from '@/presentation/components/pages/trainings/ExerciseLogger.vue'
import BButton from '@/presentation/components/shared/BButton.vue'
</script>
