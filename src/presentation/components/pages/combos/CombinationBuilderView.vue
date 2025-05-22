<template>
  <div class="combination-builder">
    <combo-preview
      :combo-actions="modelValue"
      @clear="clearActions"
      @clear-last="clearLastAction"
    />

    <div class="">
      <label class="form-label mb-2">Action</label>
      <b-button-group
        v-model="selectedCategory"
        color="light"
        class="w-100"
        :items="categoryOptions"
      />
    </div>

    <div class="">
      <label class="form-label mb-2">Option</label>
      <b-button-group
        v-if="selectedCategory && selectedActionId"
        v-model="selectedActionId"
        color="light"
        vertical
        option-value="id"
        class="w-100"
        :items="availableActions"
      >
        <template #default="{ item }">
          {{ item?.name }}
        </template>
      </b-button-group>

      <b-button
        color="dark"
        class="btn-block w-100 mt-3"
        @click="addActionToCombo"
      >Add</b-button>
    </div>

    <random-combo-card
      v-if="isNew"
      v-model:iterations="randomIterationsNumber"
      @on-generate="onGenerateRandomCombo"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import { TYPES } from '@/infrastructure/di/types.ts'
import type { BoxingAction } from '@/domain/entities/BoxingAction.ts'
import { BoxingActionCategory } from '@/domain/entities/BoxingAction.ts'
import { getNextActions } from '@/application/useCases/getNextActions.ts'

// Если вы по-прежнему используете GetPunchesUseCase, замените его на новый use-case
// или импортируйте MOCK_ACTIONS напрямую.
// Здесь для примера предполагаем, что GetPunchesUseCase возвращает все BoxingAction.
import { GetPunchesUseCase } from '@/application/useCases/GetPunchesUseCase.ts'
import { generateRandomCombo } from '@/application/useCases/generateRandomCombo.ts'
import BButton from '@/presentation/components/shared/BButton.vue'
import BButtonGroup from '@/presentation/components/shared/BButtonGroup.vue'
import ComboPreview from '@/presentation/components/pages/combos/ComboPreview.vue'
import RandomComboCard from '@/presentation/components/pages/combos/RandomComboCard.vue'
import { getUC } from '@/infrastructure/di/resolver.ts'

export default defineComponent({
  name: 'CombinationBuilderView',
  components: {
    RandomComboCard,
    ComboPreview,
    BButtonGroup,
    BButton
  },
  props: {
    modelValue: {
      type: Array as () => BoxingAction[],
      default: () => []
    },
    isNew: Boolean
  },
  emits: ['update:model-value'],
  setup(props, { emit }) {
    const allActions = ref<BoxingAction[]>([])
    const comboTitle = ref('')
    const randomIterationsNumber = ref<number>(5)

    const categoryOptions = [BoxingActionCategory.PUNCH, BoxingActionCategory.MOVEMENT, BoxingActionCategory.DEFENSE]
    const selectedCategory = ref<BoxingActionCategory>(BoxingActionCategory.PUNCH)
    const selectedActionId = ref<number | null>(null)

    const getPunchesUseCase = getUC<GetPunchesUseCase>(TYPES.GetPunchesUseCase)

    onMounted(async () => {
      allActions.value = await getPunchesUseCase.execute()
      onUpdateAvailableActions()
    })

    const lastAction = computed(() => {
      if (props.modelValue.length === 0) return null
      return props.modelValue[props.modelValue.length - 1]
    })

    const availableActions = computed<BoxingAction[]>(() => {
      if (!lastAction.value) {
        return allActions.value.filter((a) => a.category === selectedCategory.value)
      }
      const possible = getNextActions(lastAction.value, allActions.value)
      return possible.filter((a) => a.category === selectedCategory.value)
    })

    function onUpdateAvailableActions() {
      if (availableActions.value.length > 0) {
        selectedActionId.value = availableActions.value[0].id
      } else {
        selectedActionId.value = null
      }
    }

    function addActionToCombo() {
      if (selectedActionId.value == null) return
      const chosen = allActions.value.find((a) => a.id === selectedActionId.value)
      if (!chosen) return
      emit('update:model-value', [...props.modelValue, chosen])
      onUpdateAvailableActions()
    }

    function onGenerateRandomCombo() {
      const randomCombo = generateRandomCombo(allActions.value, randomIterationsNumber.value)
      emit('update:model-value', randomCombo)
    }

    const clearActions = () => {
      emit('update:model-value', [])
    }

    const clearLastAction = () => {
      emit('update:model-value', [...props.modelValue.slice(0,-1) ])
      console.log(props.modelValue.slice(0, -1))
    }

    watch(selectedCategory, () => {
      onUpdateAvailableActions()
    })

    return {
      categoryOptions,
      selectedCategory,
      selectedActionId,
      comboTitle,
      availableActions,
      addActionToCombo,
      onGenerateRandomCombo,
      randomIterationsNumber,
      clearActions,
      clearLastAction
    }
  }
})
</script>

<style scoped lang="scss">
@import "bootstrap/scss/mixins/breakpoints";

.combination-builder {
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 24px;
  max-width: 430px;
  @include media-breakpoint-down(sm) {
    max-width: 100%;
  }
}
</style>
