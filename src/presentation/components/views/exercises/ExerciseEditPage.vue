<!-- src/presentation/components/views/exercises/ExerciseEditPage.vue -->
<template>
  <div class="">
    <h1 class="mb-4">{{ isNew ? 'Create Exercise' : 'Edit Exercise' }}</h1>

    <form @submit.prevent="onSave">
      <!-- Name -->
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input
          v-model="form.name"
          type="text"
          class="form-control"
          placeholder="Exercise name"
          required
        >
      </div>

      <!-- Category -->
      <div class="mb-3">
        <label class="form-label">Category</label>
        <select
          v-model="form.category"
          class="form-select"
        >
          <option
            v-for="cat in categories"
            :key="cat"
            :value="cat"
          >
            {{ cat }}
          </option>
        </select>
      </div>

      <!-- Measurement Unit -->
      <div class="mb-3">
        <label class="form-label">Measurement Unit</label>
        <select
          v-model="form.measurement"
          class="form-select"
        >
          <option value="repetitions">Repetitions</option>
          <option value="seconds">Seconds</option>
        </select>
      </div>

      <!-- Flags -->
      <div class="form-check mb-3">
        <input
          id="weighted"
          v-model="form.canBeWeighted"
          class="form-check-input"
          type="checkbox"
        >
        <label
          class="form-check-label"
          for="weighted"
        >
          Can be weighted
        </label>
      </div>
      <div class="form-check mb-3">
        <input
          id="accelerated"
          v-model="form.canBeAccelerated"
          class="form-check-input"
          type="checkbox"
        >
        <label
          class="form-check-label"
          for="accelerated"
        >
          Can be accelerated
        </label>
      </div>

      <!-- Tags -->
      <div class="mb-3">
        <label class="form-label">Tags</label>
        <button
          type="button"
          class="btn btn-outline-secondary ms-2"
          @click="openTagModal"
        >
          Select Tags
        </button>
        <div class="mt-2">
          <span
            v-for="tagId in form.tagIds"
            :key="tagId"
            class="badge bg-secondary me-1"
          >
            {{ tagStore.list.find(t => t.id === tagId)?.name }}
          </span>
        </div>
      </div>

      <!-- Favorite -->
      <div class="form-check mb-4">
        <input
          id="favorite"
          v-model="form.isFavorite"
          class="form-check-input"
          type="checkbox"
        >
        <label
          class="form-check-label"
          for="favorite"
        >
          Favorite
        </label>
      </div>

      <!-- Actions -->
      <div class="d-flex">
        <button
          class="btn btn-primary me-2"
          type="submit"
        >
          {{ isNew ? 'Create' : 'Save' }}
        </button>
        <button
          class="btn btn-secondary"
          type="button"
          @click="onCancel"
        >
          Cancel
        </button>
      </div>
    </form>

    <!-- Tag Selector Modal -->
    <component
      :is="modalState.component"
      v-if="modalState.isOpen && modalState.props.mode === 'tags'"
      v-bind="modalState.props"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ExerciseCategory, type Exercise } from '@/domain/entities/Exercise'
import { useExerciseStore } from '@/presentation/stores/exerciseStore'
import { useTagStore } from '@/presentation/stores/tagStore'
import { useModalService } from '@/presentation/composition/useModalService'
import { ModalKey } from '@/presentation/modals/modalKeys'

const route = useRoute()
const router = useRouter()
const exStore = useExerciseStore()
const tagStore = useTagStore()
const modal = useModalService()

const id = ref(route.params.id as string | undefined)
const isNew = ref(!id.value)

const categories = Object.values(ExerciseCategory)

const form = reactive<Exercise>({
  id:              id.value || '',
  name:            '',
  category:        ExerciseCategory.PHYSICS,
  measurement:     'repetitions',
  canBeWeighted:   false,
  canBeAccelerated:false,
  tagIds:          [],
  isFavorite:      false,
  canHaveCombo: false
})

onMounted(async () => {
  await tagStore.load()
  if (!isNew.value) {
    await exStore.loadById(id.value!)
    const {current} = exStore
    if (current) Object.assign(form, current)
  }
})

function openTagModal() {
  modal.openModalByKey(ModalKey.TAG_SELECTOR, {
    mode: 'tags',
    selected: form.tagIds,
    onSave(ids: string[]) {
      form.tagIds = ids
    }
  })
}

async function onSave() {
  if (isNew.value) {
    await exStore.createExercise(form)
  } else {
    await exStore.updateExercise(form)
  }
  await router.push({ name: 'Exercises' })
}

function onCancel() {
  router.back()
}

const { modalState } = modal
</script>
