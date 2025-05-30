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

<!--&lt;!&ndash; src/presentation/components/pages/ExercisesPage.vue &ndash;&gt;-->
<!--<template>-->
<!--  <div>-->
<!--    <div class="d-flex justify-content-between align-items-center mb-3">-->
<!--      <h1>Exercises</h1>-->
<!--      <button-->
<!--        class="btn btn-success"-->
<!--        @click="openEditor()"-->
<!--      >-->
<!--        + New Exercise-->
<!--      </button>-->
<!--    </div>-->

<!--    <div class="form-check mb-4">-->
<!--      <input-->
<!--        id="showFav"-->
<!--        v-model="showFavorites"-->
<!--        class="form-check-input"-->
<!--        type="checkbox"-->
<!--      >-->
<!--      <label-->
<!--        class="form-check-label"-->
<!--        for="showFav"-->
<!--      >-->
<!--        Show Favorites Only-->
<!--      </label>-->
<!--    </div>-->

<!--    <div class="list-group">-->
<!--      <button-->
<!--        v-for="ex in filteredExercises"-->
<!--        :key="ex.id"-->
<!--        class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"-->
<!--        @click="editExercise(ex)"-->
<!--      >-->
<!--        <div>-->
<!--          <strong>{{ ex.name }}</strong>-->
<!--          <div class="small text-muted">-->
<!--            {{ ex.category }} • {{ ex.measurement }}-->
<!--          </div>-->
<!--          <div class="mt-1">-->
<!--            <span-->
<!--              v-for="tagId in ex.tagIds"-->
<!--              :key="tagId"-->
<!--              class="badge bg-secondary me-1"-->
<!--            >-->
<!--              {{ getTagName(tagId) }}-->
<!--            </span>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div>-->
<!--          <i-->
<!--            v-if="ex.isFavorite"-->
<!--            class="bi bi-star-fill text-warning"-->
<!--            title="Favorite"-->
<!--          />-->
<!--        </div>-->
<!--      </button>-->
<!--    </div>-->

<!--    <component-->
<!--      :is="modalState.component"-->
<!--      v-if="modalState.isOpen"-->
<!--      v-bind="modalState.props"-->
<!--    />-->
<!--  </div>-->
<!--</template>-->

<!--<script lang="ts" setup>-->
<!--import { ref, computed, onMounted } from 'vue'-->
<!--import { useModalService } from '@/presentation/composition/useModalService'-->
<!--import { ModalKey } from '@/presentation/modals/modalKeys'-->
<!--import { useRecordStore } from '@/presentation/stores/exerciseStore'-->
<!--import { useTagStore } from '@/presentation/stores/tagStore'-->

<!--const modal = useModalService()-->
<!--const exStore = useRecordStore()-->
<!--const tagStore = useTagStore()-->

<!--const showFavorites = ref(false)-->

<!--onMounted(async () => {-->
<!--  await exStore.loadAll()-->
<!--  await tagStore.load()-->
<!--})-->

<!--const filteredExercises = computed(() =>-->
<!--  showFavorites.value-->
<!--    ? exStore.exercises.filter((e) => e.isFavorite)-->
<!--    : exStore.exercises-->
<!--)-->

<!--function getTagName(id: string): string {-->
<!--  return tagStore.list.find((t) => t.id === id)?.name || ''-->
<!--}-->

<!--function openEditor(exercise?: any) {-->
<!--  modal.openModalByKey(ModalKey.EXERCISE_EDITOR, { exercise })-->
<!--}-->

<!--function editExercise(exercise: any) {-->
<!--  openEditor(exercise)-->
<!--}-->

<!--const { modalState } = modal-->
<!--</script>-->

<!--<template>-->
<!--  <div class="trainings-page py-4">-->
<!--    <div class="mb-3">-->
<!--      <label class="form-label text-center w-100">Select Exercise Type:</label>-->

<!--      <b-button-group-->
<!--        v-model="selectedType"-->
<!--        color="light"-->
<!--        class="w-100"-->
<!--        :items="[ExerciseCategory.PHYSICS, ExerciseCategory.TECHNIQUE, ExerciseCategory.PRACTICE]"-->
<!--      />-->
<!--    </div>-->

<!--    <div class="mb-4">-->
<!--      <label class="form-label text-center w-100">Choose Exercise:</label>-->

<!--      <b-button-group-->
<!--        v-if="selectedExerciseId"-->
<!--        v-model="selectedExerciseId"-->
<!--        color="light"-->
<!--        vertical-->
<!--        option-value="id"-->
<!--        class="w-100"-->
<!--        :items="filteredExercises"-->
<!--      >-->
<!--        <template #default="{ item }">-->
<!--          {{ item.name }}-->
<!--          <span-->
<!--            v-if="item.measurement === 'seconds'"-->
<!--            class="badge text-bg-secondary"-->
<!--          >Sec</span>-->
<!--        </template>-->
<!--      </b-button-group>-->
<!--    </div>-->

<!--    <exercise-logger-->
<!--      v-if="selectedExercise"-->
<!--      :selected-exercise="selectedExercise"-->
<!--    />-->
<!--  </div>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import { computed, onMounted, ref, watch } from 'vue'-->
<!--import { useRecordStore } from '@/presentation/stores/exerciseStore.ts'-->
<!--import { type Exercise, ExerciseCategory } from '@/domain/entities/Exercise.ts'-->
<!--import ExerciseLogger from '@/presentation/components/pages/trainings/ExerciseLogger.vue'-->
<!--import BButtonGroup from '@/presentation/components/shared/BButtonGroup.vue'-->

<!--const store = useRecordStore()-->

<!--// Выбранный тип упражнения: technique, strength, practice-->
<!--const selectedType = ref<ExerciseCategory>(ExerciseCategory.PHYSICS)-->

<!--// ID выбранного упражнения-->
<!--const selectedExerciseId = ref<string | null>(null)-->

<!--// Фильтруем список упражнений по выбранному типу-->
<!--const filteredExercises = computed<Exercise[]>(() => {-->
<!--  return store.exercises.filter((ex: Exercise) => ex.category === selectedType.value)-->
<!--})-->

<!--// Получаем объект выбранного упражнения-->
<!--const selectedExercise = computed<Exercise | null>(() => {-->
<!--  return store.exercises.find((ex: Exercise) => ex.id === selectedExerciseId.value) || null-->
<!--})-->

<!--onMounted(async () => {-->
<!--  await store.loadExercises()-->
<!--  selectedExerciseId.value = filteredExercises.value[0].id-->
<!--  // Устанавливаем дефолтное упражнение для выбранного типа-->
<!--  const filtered = store.exercises.filter((ex: Exercise) => ex.category === selectedType.value)-->
<!--  if (filtered.length > 0) {-->
<!--    selectedExerciseId.value = filtered[0].id-->
<!--  }-->
<!--})-->

<!--// При смене выбранного типа сбрасываем выбранное упражнение-->
<!--watch(selectedType, (newType) => {-->
<!--  const filtered = store.exercises.filter((ex: Exercise) => ex.category === newType)-->
<!--  selectedExerciseId.value = filtered.length > 0 ? filtered[0].id : null-->
<!--}, {-->
<!--  immediate: true-->
<!--})-->
<!--</script>-->

<!--<style scoped>-->
<!--.trainings-page {-->
<!--  .badge {-->
<!--    font-size: 10px;-->
<!--    vertical-align: middle;-->
<!--  }-->
<!--}-->
<!--</style>-->
