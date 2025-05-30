<!-- src/presentation/components/trainings/ExerciseLogger.vue -->
<template>
  <div class="exercise-logger">
    <div class="form-label text-center">Select category</div>
    <b-button-group
      v-model="selectedCategory"
      :items="categories"
      color="secondary"
      outline
      class="mb-4 w-100"
    />

    <div class="form-label text-center">Select exercise</div>

    <b-button-group
      v-model="selectedExercise"
      :items="filteredExercises"
      color="light"
      vertical
      class="w-100 mb-4"
      @update:model-value="selectExercise"
    >
      <template #default="{ item }">
        {{ item.name }}
      </template>
    </b-button-group>

    <!--    <div class="list-group mb-4">-->
    <!--      <button-->
    <!--        v-for="ex in filteredExercises"-->
    <!--        :key="ex.id"-->
    <!--        :class="['list-group-item', { active: ex.id === selectedExercise?.id }]"-->
    <!--        @click="selectExercise(ex)"-->
    <!--      >-->
    <!--        {{ ex.name }}-->
    <!--      </button>-->
    <!--    </div>-->

    <div v-if="selectedExercise">
      <h4 class="mb-3 text-center">
        {{ selectedExercise.name }}
        ({{ selectedExercise.measurement === 'seconds' ? 'sec' : 'reps'  }})
      </h4>

      <div
        v-if="selectedExercise.canHaveCombo"
        class="mb-3"
      >
        <b-button
          class="w-100"
          color="primary"
          outline
        >
          <!--          @click="openComboSelector()"-->
          Select Combo
        </b-button>
        <span
          v-if="selectedCombo"
          class="badge bg-info text-dark"
        >
          {{ selectedCombo.title }}
        </span>
      </div>

      <div
        v-if="selectedExercise.canBeWeighted"
        class="form-check mb-2"
      >
        <input
          id="flag-weighted"
          v-model="flags.weighted"
          class="form-check-input"
          type="checkbox"
        >
        <label
          class="form-check-label"
          for="flag-weighted"
        >
          With additional weight
        </label>
      </div>
      <div
        v-if="selectedExercise.canBeAccelerated"
        class="form-check mb-3"
      >
        <input
          id="flag-accelerated"
          v-model="flags.accelerated"
          class="form-check-input"
          type="checkbox"
        >
        <label
          class="form-check-label"
          for="flag-accelerated"
        >
          Accelerated tempo
        </label>
      </div>

      <div class="d-flex gap-2 mb-2">
        <div class="col">
          <b-button
            color="secondary"
            outline
            class="px-3 w-100"
            @click="decrement"
          >-</b-button>
        </div>
        <div class="col">
          <b-input
            v-model.number="quantity"
            type="text"
            placeholder="Count"
            class="text-center"
            :min="0"
          />
        </div>
        <div class="col">
          <b-button
            color="secondary"
            outline
            class="px-3 w-100"
            @click="increment"
          >+</b-button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="d-flex flex-column gap-1 mt-5">
        <b-button
          color="primary"
          @click="addRecord()"
        >
          Add Progress
        </b-button>
        <b-button
          color="secondary"
          @click="enqueue()"
        >
          Add to Queue
        </b-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useExerciseStore } from '@/presentation/stores/exerciseStore'
import { useTagStore } from '@/presentation/stores/tagStore'
import { useComboStore } from '@/presentation/stores/comboStore'
import { useModalService } from '@/presentation/composition/useModalService'
import { ModalKey } from '@/presentation/modals/modalKeys'
import type { Combination } from '@/domain/entities/Combination'
import BButtonGroup from '@/presentation/components/shared/BButtonGroup.vue'
import { type Exercise, ExerciseCategory } from '@/domain/entities/Exercise.ts'
import { useRecordStore } from '@/presentation/stores/recordStore.ts'
import BButton from '@/presentation/components/shared/BButton.vue'
import BInput from '@/presentation/components/shared/BInput.vue'


const exStore = useExerciseStore()
const recordStore = useRecordStore()
const tagStore   = useTagStore()
const comboStore = useComboStore()
const modal      = useModalService()
const { modalState } = useModalService()

// UI state
const categories = [ExerciseCategory.PHYSICS, ExerciseCategory.TECHNIQUE, ExerciseCategory.PRACTICE]
const selectedCategory = ref<string>(ExerciseCategory.PHYSICS)
const selectedExercise = ref<Exercise>(recordStore.exercises[0] || null)
const quantity = ref<number>(0)
const flags = reactive({
  weighted: false,
  accelerated: false
})
const customTags = ref<string[]>([])
const selectedCombo = ref<Combination | null>(null)

const init = () => {
  selectedExercise.value = filteredExercises.value[0] || null
}

// Load data
onMounted(async () => {
  await exStore.loadAll()
  await tagStore.load()
  await comboStore.load()
  init()
})

const filteredExercises = computed<Exercise[]>(() =>
  recordStore.exercises.filter((e) => e.category === selectedCategory.value)
)

function selectExercise(ex: Exercise) {
  selectedExercise.value = ex
  flags.weighted = false
  flags.accelerated = false
  customTags.value = []
  selectedCombo.value = null
}

// Quantity controls
function increment() { quantity.value = quantity.value + 1 }
function decrement() { if (quantity.value>0) quantity.value-- }

// Helpers
function getTagName(id: string) {
  return tagStore.list.find((t) => t.id === id)?.name || ''
}

// Modals
function openTagSelector() {
  modal.openModalByKey(ModalKey.TAG_SELECTOR, {
    mode: 'tags',
    selected: customTags.value,
    onSave(ids: string[]) {
      customTags.value = ids
    }
  })
}

watch(() => selectedCategory.value, () => {
  selectedExercise.value = filteredExercises.value[0]
})

// function openComboSelector() {
//   modal.openModalByKey(ModalKey.COMBO_SELECTOR, {
//     mode: 'combo',
//     selected: selectedCombo.value?.id || '',
//     onSave(id: string) {
//       selectedCombo.value = comboStore.combos.find((c) => c.id === id) || null
//     }
//   })
// }

// Actions
async function addRecord() {
  if (!selectedExercise.value || quantity.value <= 0) return
  // await recordStore.logExercise(
  //   selectedExercise.value.id,
  //   quantity.value,
  //   {
  //     weighted: flags.weighted,
  //     accelerated: flags.accelerated,
  //     tags: customTags.value,
  //     comboId: selectedCombo.value?.id
  //   }
  // )
  quantity.value = 0
}
function enqueue() {}
</script>
<!--<template>-->
<!--  <div class="exercise-logger">-->
<!--    <h6 class="text-center mb-3">{{ selectedExercise?.name }}</h6>-->
<!--    <div class="small text-center text-muted">Add {{ selectedExercise?.measurement }}</div>-->

<!--    <div class="d-flex gap-2 mb-2">-->
<!--      <div class="col">-->
<!--        <b-button-->
<!--          color="secondary"-->
<!--          outline-->
<!--          class="px-3 w-100"-->
<!--          @click="numOfRepetitions&#45;&#45;"-->
<!--        >-</b-button>-->
<!--      </div>-->
<!--      <div class="col">-->
<!--        <b-input-->
<!--          v-model="numOfRepetitions"-->
<!--          type="number"-->
<!--          placeholder="Count"-->
<!--          class="text-center"-->
<!--        />-->
<!--      </div>-->
<!--      <div class="col">-->
<!--        <b-button-->
<!--          color="secondary"-->
<!--          outline-->
<!--          class="px-3 w-100"-->
<!--          @click="numOfRepetitions++"-->
<!--        >+</b-button>-->
<!--      </div>-->
<!--    </div>-->

<!--    <b-button-->
<!--      color="primary"-->
<!--      class="w-100"-->
<!--      @click="logRepetitions(numOfRepetitions)"-->
<!--    >-->
<!--      Add progress-->
<!--    </b-button>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import { ref } from 'vue'-->
<!--import { useRecordStore } from '@/presentation/stores/exerciseStore.ts'-->
<!--import type { Exercise } from '@/domain/entities/Exercise.ts'-->
<!--import BInput from '@/presentation/components/shared/BInput.vue'-->
<!--import BButton from '@/presentation/components/shared/BButton.vue'-->
<!--import { useToast } from "vue-toastification"-->

<!--const props = defineProps<{ selectedExercise: Exercise | null }>()-->
<!--const store = useRecordStore()-->
<!--const toast = useToast()-->
<!--const numOfRepetitions = ref<number>(10)-->

<!--// Повторения-->
<!--const logRepetitions = async (amount: number) => {-->
<!--  if (props.selectedExercise) {-->
<!--    try {-->
<!--      await store.logExercise(props.selectedExercise.id, amount, 'repetitions')-->
<!--      toast.success(-->
<!--        `${numOfRepetitions.value} ${props.selectedExercise?.measurement} of ${props.selectedExercise?.name} added successfully`-->
<!--      )-->
<!--    } catch (e) {-->
<!--      toast.error(e)-->
<!--    }-->
<!--  }-->
<!--}-->

<!--</script>-->

<!--<style lang="scss" scoped>-->
<!--.max-w50pr {-->
<!--  max-width: 50%;-->
<!--}-->
<!--</style>-->
