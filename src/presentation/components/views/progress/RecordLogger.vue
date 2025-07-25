<!-- src/presentation/components/views/progress/RecordLogger.vue -->
<template>
  <page-default header-back>
    <div class="exercise-logger">
      <horizontal-segment-group
        v-model="selectedCategory"
        :items="categories"
        label="Select category"
      />

      <vertical-radio-group
        v-model="selectedExercise"
        :items="filteredExercises"
        option-label="name"
        label="Select exercise"
        @update:model-value="selectExercise"
      />

      <div v-if="selectedExercise">
        <h4 class="mb-3 mt-3 text-center">
          {{ selectedExercise.name }}
        </h4>

        <b-card
          v-if="selectedExercise.canHaveCombo"
          class="mb-3"
        >
          <template v-slot>
            <div class="d-flex justify-content-center align-items-center gap-2">
              Use combo
              <b-badge
                v-if="selectedCombo"
                color="primary"
              >
                {{ selectedCombo.title }}
              </b-badge>
            </div>
          </template>
          <template v-slot:footer>
            <div class="d-flex gap-2">
              <div class="flex-grow-1">
                <b-button
                  class="w-100"
                  color="medium"
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
          <div class="col">
            <b-input
              v-model.number="quantity"
              type="number"
              placeholder="Count"
              :label="selectedExercise.measurement"
              class="text-center"
              :min="0"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="d-flex flex-column gap-2 mt-4">
          <b-button
            color="primary"
            @click="addRecord"
          >
            Add Progress
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
import { modalController } from '@ionic/vue'
import ComboSelectorModal from '@/presentation/components/modals/ComboSelectorModal.vue'
import BBadge from '@/presentation/components/shared/BBadge.vue'


// STORES и SERVICES
const exStore = useExerciseStore()
const progressStore = useProgressStore()
const tagStore = useTagStore()
const comboStore = useComboStore()
const router = useProjectRouter()

const categories = [ExerciseCategory.PHYSICS, ExerciseCategory.TECHNIQUE, ExerciseCategory.PRACTICE]
const selectedCategory = ref<ExerciseCategory>(ExerciseCategory.PHYSICS)

const selectedExercise = ref<Exercise | null>(null)
const selectedCombo = ref<Combination | null>(null)

const flags = reactive({
  weighted: false,
  accelerated: false
})

// Количество подходов/секунд
const quantity = ref<number>(0)

const record = reactive<Omit<TrainingRecord, 'id' | 'userId' | 'timestamp'>>({
  exerciseId: '',
  comboId: null,
  category: ExerciseCategory.PHYSICS,
  measurement: 'repetitions',
  amount: 0,
  tagIds: []
})

const filteredExercises = computed<Exercise[]>(() => {
  return exStore.exercises.filter((e) => e.category === selectedCategory.value)
})

const clear = () => {
  flags.weighted = false
  flags.accelerated = false
  selectedCombo.value = null
}

const selectExercise = (ex: Exercise) => {
  selectedExercise.value = ex
  clear()
}

const openComboSelector = async () => {
  const modal = await modalController.create({
    component: ComboSelectorModal,
    componentProps: {
      selected: selectedCombo.value ?? null
    }
  })

  await modal.present()

  const { data, role } = await modal.onWillDismiss()

  if (role === 'confirm') {
    selectedCombo.value = comboStore.combos.find((c) => c.id === data) ?? null
  }
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
