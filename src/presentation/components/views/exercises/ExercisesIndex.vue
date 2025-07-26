<template>
  <page-default>
    <div class="ion-padding-bottom">
      <div class="form-label text-center mb-2">Category</div>
      <horizontal-segment-group
        v-model="selectedCategory"
        :items="categories"
        class="mb-4"
      />

      <div class="form-label text-center mb-2">
        Exercises
      </div>

      <list-group
        :items="filteredExercises"
        item-id="id"
        item-val="name"
        item-link
        :primary-callback="openExercise"
      >
        <template v-slot:icon>
          <i class="bi bi-lightning-charge"/>
        </template>
        <template v-slot:actions="{ item }">
          <b-dropdown-item
            @click="openExercise(item)"
          >Open</b-dropdown-item>
          <b-dropdown-item
            v-if="!exStore.isDefault(item.id)"
            @click="onRemove(item)"
          >Remove</b-dropdown-item>
        </template>
      </list-group>
    </div>

    <template v-slot:footer>
      <b-button-block
        @click="router.push({ name: 'ExerciseCreate' })"
      >
        + New Exercise
      </b-button-block>
    </template>
  </page-default>
</template>

<script setup lang="ts">
import { useExerciseStore } from '@/presentation/stores/exerciseStore.ts'
import { type Exercise, ExerciseCategory } from '@/domain/entities/Exercise.ts'
import { computed, onMounted, ref } from 'vue'
import ListGroup from '@/presentation/components/shared/ListGroup.vue'
import BDropdownItem from '@/presentation/components/shared/BDropdownItem.vue'
import PageDefault from '@/presentation/components/layout/page/PageDefault.vue'
import HorizontalSegmentGroup from '@/presentation/components/shared/HorizontalSegmentGroup.vue'
import BButtonBlock from '@/presentation/components/shared/BButtonBlock.vue'
import useProjectRouter from '@/presentation/composition/useProjectRouter.ts'
import { useDeleteAlerts } from '@/presentation/composition/useAlerts.ts'

const router = useProjectRouter()
const exStore = useExerciseStore()
const categories = [ExerciseCategory.PHYSICS, ExerciseCategory.TECHNIQUE, ExerciseCategory.PRACTICE]
const selectedCategory = ref<string>(ExerciseCategory.PHYSICS)

const filteredExercises = computed<Exercise[]>(() =>
  exStore.exercises.filter((e) => e.category === selectedCategory.value)
)
const openExercise = (ex: Exercise) => {
  router.push({
    name: 'ExerciseEdit',
    params: { id: ex.id }
  })
}

const onRemove = (ex: Exercise) => {
  if (exStore.isDefault(ex.id)) return
  useDeleteAlerts(ex.id, exStore.removeExercise)
}

onMounted(async () => {
  await exStore.loadAll()
})
</script>
