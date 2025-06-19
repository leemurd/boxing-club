<template>
  <page-default>
    <div class="exercises">
      <div class="form-label text-center">Category</div>
      <horizontal-segment-group
        v-model="selectedCategory"
        :items="categories"
        class="mb-4 w-100"
      />

      <div class="form-label text-center">
        Exercises
      </div>

      <list-group
        :items="filteredExercises"
        item-id="id"
        item-val="name"
        class="w-100"
        item-link
        :primary-callback="openExercise"
      >
        <template #icon>
          <i class="bi bi-lightning-charge"/>
        </template>
        <template #actions="{ item }">
          <b-dropdown-item
            @click="openExercise(item)"
          >Open</b-dropdown-item>
          <b-dropdown-item
            v-if="!exStore.isDefault(item.id)"
            @click="removeExercise(item)"
          >Remove</b-dropdown-item>
        </template>
      </list-group>

      <b-button
        color="dark"
        class="w-100 mt-3"
        size="default"
        @click="$router.push('/exercises/new')"
      >
        + New Exercise
      </b-button>
    </div>
  </page-default>
</template>

<script setup lang="ts">
import { useExerciseStore } from '@/presentation/stores/exerciseStore.ts'
import { type Exercise, ExerciseCategory } from '@/domain/entities/Exercise.ts'
import { computed, onMounted, ref } from 'vue'
import BButton from '@/presentation/components/shared/BButton.vue'
import ListGroup from '@/presentation/components/shared/ListGroup.vue'
import BDropdownItem from '@/presentation/components/shared/BDropdownItem.vue'
import { useRouter } from 'vue-router'
import PageDefault from '@/presentation/components/layout/page/PageDefault.vue'
import HorizontalSegmentGroup from '@/presentation/components/shared/HorizontalSegmentGroup.vue'

const router = useRouter()
const exStore = useExerciseStore()
const categories = [ExerciseCategory.PHYSICS, ExerciseCategory.TECHNIQUE, ExerciseCategory.PRACTICE]
const selectedCategory = ref<string>(ExerciseCategory.PHYSICS)

const filteredExercises = computed<Exercise[]>(() =>
  exStore.exercises.filter((e) => e.category === selectedCategory.value)
)
function openExercise(ex: Exercise) {
  router.push({
    name: 'ExerciseEdit',
    params: { id: ex.id }
  })
}

const removeExercise = async (ex: Exercise) => {
  if (!exStore.isDefault(ex.id)) {
    await exStore.removeExercise(ex.id)
  }
}

onMounted(async () => {
  await exStore.loadAll()
})
</script>

<style lang="scss" scoped>
.exercises {
  padding-bottom: 30px;
}
</style>
