<template>
  <div class="combination-builder">
    <combo-preview
      :combo-actions="modelValue"
      @clear="clearActions"
      @clear-last="clearLastAction"
    />

    <div class="">
      <label class="form-label mb-2">Action</label>
      <horizontal-segment-group
        v-model="selectedCategory"
        :items="categoryOptions"
      />
    </div>

    <div class="">
      <label class="form-label mb-2">Option</label>
      <vertical-radio-group
        v-if="selectedCategory && selectedActionId"
        v-model="selectedActionId"
        option-value="id"
        :items="availableActions"
      >
        <template v-slot="{ item }">
          {{ item?.name }}
        </template>
      </vertical-radio-group>

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
import { getNextActions } from '@/application/useCases/combination/getNextActions.ts'
import { GetPunchesUseCase } from '@/application/useCases/combination/GetPunchesUseCase.ts'
import { generateRandomCombo } from '@/application/useCases/combination/generateRandomCombo.ts'
import BButton from '@/presentation/components/shared/BButton.vue'
import ComboPreview from '@/presentation/components/pages/combos/ComboPreview.vue'
import RandomComboCard from '@/presentation/components/pages/combos/RandomComboCard.vue'
import { getUC } from '@/infrastructure/di/resolver.ts'
import HorizontalSegmentGroup from '@/presentation/components/shared/HorizontalSegmentGroup.vue'
import VerticalRadioGroup from '@/presentation/components/shared/VerticalRadioGroup.vue'

export default defineComponent({
  name: 'CombinationBuilderView',
  components: {
    VerticalRadioGroup,
    HorizontalSegmentGroup,
    RandomComboCard,
    ComboPreview,
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
.combination-builder {
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 24px;
  width: 100%;
}
</style>
