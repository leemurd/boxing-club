<!-- src/presentation/components/views/progress/RecordLogger.vue -->
<template>
  <page-default header-back>
    <div class="exercise-logger">
      <div class="form-label text-center">Select category</div>
      <horizontal-segment-group
        v-model="selectedCategory"
        :items="categories"
      />

      <div class="form-label text-center mt-3">Select exercise</div>

      <vertical-radio-group
        v-model="selectedExercise"
        :items="filteredExercises"
        option-label="name"
        @update:model-value="selectExercise"
      />

      <div v-if="selectedExercise">
        <h4 class="mb-3 mt-3 text-center">
          {{ selectedExercise.name }}
          ({{ selectedExercise.measurement === 'seconds' ? 'sec' : 'reps' }})
        </h4>

        <b-card
          v-if="selectedExercise.canHaveCombo"
          class="mb-3"
        >
          <template #default>
            <div class="d-flex justify-content-center align-items-center gap-2">
              Use combo
              <span
                v-if="selectedCombo"
                class="badge bg-primary"
              >
                {{ selectedCombo.title }}
              </span>
            </div>
          </template>
          <template #footer>
            <div class="d-flex gap-2">
              <div class="flex-grow-1">
                <b-button
                  class="w-100"
                  color="secondary"
                  @click="openComboSelector"
                >
                  Select Combo
                </b-button>
              </div>
              <div
                v-if="selectedCombo"
                class="col-auto"
              >
                <b-button
                  color="danger"
                  outline
                  size="default"
                  @click="clearCombo"
                >
                  Clear
                </b-button>
              </div>
            </div>
          </template>
        </b-card>

        <b-checkbox
          v-if="selectedExercise.canBeWeighted && !selectedExercise.alwaysWeighted"
          v-model="flags.weighted"
        >
          With additional weight
        </b-checkbox>

        <b-checkbox
          v-if="selectedExercise.canBeAccelerated && !selectedExercise.alwaysAccelerated"
          v-model="flags.accelerated"
        >
          Accelerated tempo
        </b-checkbox>

        <div class="d-flex gap-2 mb-2 mt-4">
          <div class="col"><b-button
            color="secondary"
            outline
            class="px-3 w-100"
            @click="decrement"
          >-</b-button></div>
          <div class="col">
            <b-input
              v-model.number="quantity"
              type="text"
              placeholder="Count"
              class="text-center"
              :min="0"
            />
          </div>
          <div class="col"><b-button
            color="secondary"
            outline
            class="px-3 w-100"
            @click="increment"
          >+</b-button></div>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex flex-column gap-2 mt-4">
          <b-button
            color="primary"
            @click="addRecord"
          >
            Add Progress
          </b-button>
          <b-button color="dark">
            <!-- @click="enqueue()" -->
            Add to Queue
          </b-button>
        </div>
      </div>
    </div>
  </page-default>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useExerciseStore } from '@/presentation/stores/exerciseStore.ts'
import { useTagStore } from '@/presentation/stores/tagStore.ts'
import { useComboStore } from '@/presentation/stores/comboStore.ts'
import { useModalService } from '@/presentation/composition/useModalService.ts'
import { ModalKey } from '@/presentation/modals/modalKeys.ts'
import type { Combination } from '@/domain/entities/Combination.ts'
import { type Exercise, ExerciseCategory } from '@/domain/entities/Exercise.ts'
import BButton from '@/presentation/components/shared/BButton.vue'
import BInput from '@/presentation/components/shared/BInput.vue'
import type { TrainingRecord } from '@/domain/entities/TrainingRecord.ts'
import { categoryTagMap } from '@/presentation/constants/progress/data.ts'
import BCard from '@/presentation/components/shared/BCard.vue'
import BCheckbox from '@/presentation/components/shared/BCheckbox.vue'
import { DEFAULT_TAG_IDS } from '@/domain/constants/defaultTags.ts'
import { useProgressStore } from '@/presentation/stores/progressStore.ts'
import PageDefault from '@/presentation/components/layout/page/PageDefault.vue'
import useProjectRouter from '@/presentation/composition/useProjectRouter.ts'
import HorizontalSegmentGroup from '@/presentation/components/shared/HorizontalSegmentGroup.vue'
import VerticalRadioGroup from '@/presentation/components/shared/VerticalRadioGroup.vue'

// STORES и SERVICES
const exStore = useExerciseStore()
const progressStore = useProgressStore()
const tagStore = useTagStore()
const comboStore = useComboStore()
const modal = useModalService()
const router = useProjectRouter()

// Список категорий и текущее значение
const categories = [ExerciseCategory.PHYSICS, ExerciseCategory.TECHNIQUE, ExerciseCategory.PRACTICE]
const selectedCategory = ref<ExerciseCategory>(ExerciseCategory.PHYSICS)

// Текущее выбранное упражнение и комбо
const selectedExercise = ref<Exercise | null>(null)
const selectedCombo = ref<Combination | null>(null)

// Флаги weight/accelerated
const flags = reactive({
  weighted: false,
  accelerated: false
})

// Количество подходов/секунд
const quantity = ref<number>(0)

// Объект записи без полей id/userId/timestamp, но со всеми остальными
const record = reactive<Omit<TrainingRecord, 'id' | 'userId' | 'timestamp'>>({
  exerciseId: '',
  comboId: null,
  category: ExerciseCategory.PHYSICS,
  measurement: 'repetitions',
  amount: 0,
  tagIds: []
})

// Фильтрованный список упражнений по выбранной категории
const filteredExercises = computed<Exercise[]>(() => {
  return exStore.exercises.filter((e) => e.category === selectedCategory.value)
})

const clear = () => {
  flags.weighted = false
  flags.accelerated = false
  selectedCombo.value = null
}

// Вызывается, когда мы выбираем упражнение в BButtonGroup
const selectExercise = (ex: Exercise) => {
  selectedExercise.value = ex
  clear()
}

// Quantity controls
const increment = () => {
  quantity.value = quantity.value + 1
}
const decrement = () => {
  if (quantity.value > 0) quantity.value--
}

// Открывает модалку выбора Combo
const openComboSelector = () => {
  modal.openModalByKey(ModalKey.COMBO_SELECTOR, {
    mode: 'combo',
    selected: selectedCombo.value?.id || '',
    onSave(id: string) {
      selectedCombo.value = comboStore.combos.find((c) => c.id === id) || null
    }
  })
}
const clearCombo = () => {
  selectedCombo.value = null
}

const makeRecord = () => {
  if (!selectedExercise.value) return
  record.exerciseId = selectedExercise.value.id
  record.category = selectedExercise.value.category
  record.measurement = selectedExercise.value.measurement
  record.amount = quantity.value
  record.comboId = selectedCombo.value?.id || null
  // Теги: все теги, принадлежащие упражнению, + тег по категории
  record.tagIds = [
    ...(selectedExercise.value.tagIds || []),
    categoryTagMap[selectedCategory.value]
  ]

  record.tagIds = record.tagIds.filter(
    (i) => !([DEFAULT_TAG_IDS.WEIGHT as string, DEFAULT_TAG_IDS.PACE as string].includes(i))
  )
  if (flags.weighted || selectedExercise.value.alwaysWeighted) {
    record.tagIds.push(DEFAULT_TAG_IDS.WEIGHT)
  }
  if (flags.accelerated || selectedExercise.value.alwaysAccelerated) {
    record.tagIds.push(DEFAULT_TAG_IDS.PACE)
  }

}

const canAdd = computed(() => {
  return !!selectedExercise.value && quantity.value > 0
})

async function addRecord() {
  if (!canAdd.value) return

  makeRecord()
  await progressStore.logExercise(
    record.exerciseId,
    record.category,
    record.amount,
    record.measurement,
    record.tagIds,
    record?.comboId || null
  )

  quantity.value = 0
  clear()
  await router.push({ name: 'ProgressPage' })
}

watch(() => selectedCategory.value, () => {
  selectedExercise.value = filteredExercises.value[0] || null
})

watch(
  () => selectedExercise.value,
  () => makeRecord()
)

const init = async () => {
  await exStore.loadAll()
  await tagStore.load()
  await comboStore.load()
  selectedExercise.value = filteredExercises.value[0] || null
}

onMounted(async () => {
  await init()
})
</script>

<style scoped>
.exercise-logger {
}
</style>
