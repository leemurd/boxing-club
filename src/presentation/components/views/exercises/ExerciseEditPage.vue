<!-- src/presentation/components/views/exercises/ExerciseEditPage.vue -->
<template>
  <page-default header-back>
    <div class="">
      <h1 class="mb-4">{{ isNew ? 'Create Exercise' : 'Edit Exercise' }}</h1>

      <ion-list lines="full">
        <b-input
          v-model="form.name"
          :loading="isLoading"
          type="text"
          label="Label"
          required
          :disabled="isDefault"
        />
        <ion-item>
          <b-select
            v-model="form.category"
            :items="categories"
            :disabled="isDefault"
            label="Category"
          />
        </ion-item>
        <ion-item>
          <b-select
            v-model="form.measurement"
            :items="['repetitions', 'seconds']"
            :disabled="isDefault"
            label="Measurement Unit"
          />
        </ion-item>
      </ion-list>

      <ion-list
        class="ion-margin-top"
        lines="none"
      >
        <ion-item>
          <b-checkbox
            v-model="form.canBeWeighted"
            :disabled="isDefault"
          >
            Can be weighted
          </b-checkbox>
        </ion-item>
        <ion-item>
          <b-checkbox
            v-model="form.alwaysWeighted"
            :disabled="isDefault"
          >
            Is always weighted
          </b-checkbox>
        </ion-item>
        <ion-item>
          <b-checkbox
            v-model="form.canBeAccelerated"
            :disabled="isDefault"
          >
            Can be accelerated
          </b-checkbox>
        </ion-item>
        <ion-item>
          <b-checkbox
            v-model="form.alwaysAccelerated"
            :disabled="isDefault"
          >
            Is always accelerated
          </b-checkbox>
        </ion-item>
        <ion-item>
          <b-checkbox
            v-model="form.canHaveCombo"
            :disabled="isDefault"
          >
            Can be with combo
          </b-checkbox>
        </ion-item>
        <ion-item>
          <b-checkbox
            v-model="form.isFavorite"
          >
            Favorite
          </b-checkbox>
        </ion-item>
      </ion-list>

      <div>
        <!-- Tags -->
        <b-card class="mb-4 ion-margin-top">
          <template v-slot:header>
            <div class="d-flex justify-content-between align-items-center">
              <label class="form-label mb-0">Tags</label>
              <b-button
                v-if="!isDefault"
                color="medium"
                size="small"
                class="ms-auto"
                @click="openTagModal"
              >
                Select Tags
              </b-button>
            </div>
          </template>

          <template
            v-if="form.tagIds.length > 0"
            v-slot
          >
            <div class="card-text">
              <div class="d-flex gap-1 flex-wrap">
                <b-badge
                  v-for="tagId in form.tagIds"
                  :key="tagId"
                  :color="tagStore.list.find(t => t.id === tagId)?.isAutomatic ? 'medium' : 'primary'"
                >
                  {{ tagStore.list.find(t => t.id === tagId)?.name }}
                </b-badge>
              </div>
            </div>
          </template>
        </b-card>

        <!-- Actions -->
        <div class="d-flex flex-column">
          <b-button
            color="primary"
            class="mb-2 w-100"
            type="submit"
            :disabled="form.name.trim().length === 0"
            @click="onSave"
          >
            {{ isNew ? 'Create' : 'Save' }}
          </b-button>

          <b-button
            v-if="!isDefault && !isNew"
            color="danger"
            class="w-100 mt-2"
            type="button"
            fill="outline"
            @click="onRemove"
          >
            Remove
          </b-button>
        </div>
      </div>
    </div>
  </page-default>
</template>

<script lang="ts" setup>
import { ref, computed, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ExerciseCategory, type Exercise } from '@/domain/entities/Exercise'
import { useExerciseStore } from '@/presentation/stores/exerciseStore'
import { useTagStore } from '@/presentation/stores/tagStore'
import { useModalService } from '@/presentation/composition/useModalService'
import { ModalKey } from '@/presentation/modals/modalKeys'
import BInput from '@/presentation/components/shared/BInput.vue'
import { onUserLoaded } from '@/presentation/utils/onUserLoaded.ts'
import { defaultExercise, EXERCISES } from '@/domain/constants/exercises.ts'
import BCard from '@/presentation/components/shared/BCard.vue'
import BButton from '@/presentation/components/shared/BButton.vue'
import BSelect from '@/presentation/components/shared/BSelect.vue'
import BCheckbox from '@/presentation/components/shared/BCheckbox.vue'
import { DEFAULT_TAG_IDS } from '@/domain/constants/defaultTags.ts'
import BBadge from '@/presentation/components/shared/BBadge.vue'
import PageDefault from '@/presentation/components/layout/page/PageDefault.vue'
import { IonItem, IonList } from '@ionic/vue'

const route = useRoute()
const router = useRouter()
const exStore = useExerciseStore()
const tagStore = useTagStore()
const modal = useModalService()

const id = computed<string | undefined>(() => (route.params?.id as string | undefined))
const isNew = ref(!id.value)
const isLoading = computed(() => exStore.loading)

const currentExercise = computed<Exercise | null>(() => exStore.current || null)
const isDefault = computed(() => isNew.value ? false : !!(EXERCISES.find((item) => item.id === currentExercise.value?.id)))
const categories = Object.values(ExerciseCategory)

const form = ref<Exercise>({
  id:              id.value || '',
  name:            '',
  category:        ExerciseCategory.PHYSICS,
  measurement:     'repetitions',
  canBeWeighted:   false,
  canBeAccelerated:false,
  alwaysWeighted: false,
  alwaysAccelerated: false,
  tagIds:          [],
  isFavorite:      false,
  canHaveCombo: false
})

onUserLoaded(async () => {
  await exStore.loadAll()
  await tagStore.load()
  if (!isNew.value) {
    await exStore.loadById(id.value!)
    const {current} = exStore
    if (current) {
      console.log(current)
      Object.assign(form.value, current)
    }
  } else {
    Object.assign(form.value, defaultExercise)
  }
})

onBeforeUnmount(() => {
  Object.assign(form.value, defaultExercise)
  exStore.current = null
})

function openTagModal() {
  modal.openModalByKey(ModalKey.TAG_SELECTOR, {
    selected: form.value.tagIds,
    onSave(ids: string[]) {
      form.value.tagIds = ids
    }
  })
}

async function onSave() {
  if (isNew.value) {
    await exStore.createExercise(form.value)
  } else {
    await exStore.updateExercise(form.value)
  }
  await router.push({ name: 'ExercisesIndex' })
}

const onRemove = async () => {
  await exStore.removeExercise(form.value.id)
  router.back()
}

watch(() => [form.value.alwaysAccelerated, form.value.alwaysWeighted], ([newAlwaysAccelerated, newAlwaysWeighted]) => {
  if (newAlwaysAccelerated) {
    form.value.canBeAccelerated = true
  }
  if (newAlwaysWeighted) {
    form.value.canBeWeighted = true
  }
})

watch(() => form.value.canBeAccelerated, (val) => {
  form.value.tagIds = [
    ...form.value.tagIds.filter((item) => item !== DEFAULT_TAG_IDS.PACE)
  ]
  if (val) form.value.tagIds.push(DEFAULT_TAG_IDS.PACE)
  else form.value.alwaysAccelerated = false
})
watch(() => form.value.canBeWeighted, (val) => {
  form.value.tagIds = [
    ...form.value.tagIds.filter((item) => item !== DEFAULT_TAG_IDS.WEIGHT)
  ]
  if (val) form.value.tagIds.push(DEFAULT_TAG_IDS.WEIGHT)
  else form.value.alwaysWeighted = false
})

watch(() => form.value.category, () => {
  form.value.tagIds = [
    ...form.value.tagIds.filter(
      (item) => ![
        DEFAULT_TAG_IDS.PHYSICS as string,
        DEFAULT_TAG_IDS.PRACTICE as string,
        DEFAULT_TAG_IDS.TECHNIQUE as string
      ].includes(item)
    )
  ]
}, {
  immediate: true
})

</script>
