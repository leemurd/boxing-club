<template>
  <div class="combination-builder">
    <div class="combination-builder-wrap">
      <h6>Action</h6>
      <b-button-group
        v-if="isNew"
        v-model="selectedCategory"
        color="secondary"
        outline
        class="w-100 mb-4"
        :items="categoryOptions"
      />

      <div
        v-if="comboActions.length"
        class=""
      >
        <p class="mb-1">
          Preview:
        </p>
        <div class="d-flex justify-content-center flex-wrap">
          <div
            v-for="(item, index) in comboActions"
            :key="index"
            class=""
          >
            <span class="badge text-bg-primary my-1">{{ item.name }}</span>
            <span
              v-if="index !== comboActions.length - 1"
              class="mx-1"
            >-</span>
          </div>
        </div>
      </div>

      <template v-if="isNew">
        <h6>Option</h6>
        <b-button-group
          v-if="selectedCategory && selectedActionId"
          v-model="selectedActionId"
          color="secondary"
          outline
          vertical
          option-value="id"
          class="w-100 mb-4"
          :items="availableActions"
        >
          <template #default="{ item }">
            {{ item?.name }}
          </template>
        </b-button-group>

        <b-button
          color="primary"
          class="btn-block w-100 mb-3"
          @click="addActionToCombo"
        >
          Add
        </b-button>

        <div class="input-group input-group-sm mb-3">
          <span
            id="inputGroup-sizing-sm"
            class="input-group-text"
          >Count:</span>
          <b-input
            v-model="randomIterationsNumber"
            type="number"
            class="text-center"
          />

          <b-button
            id="button-addon2"
            color="secondary"
            type="button"
            @click="onGenerateRandomCombo"
          >
            Generate random combo
          </b-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import { container } from '@/infrastructure/di/container.ts'
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
import BInput from '@/presentation/components/shared/BInput.vue'

export default defineComponent({
  name: 'CombinationBuilderView',
  components: {
    BInput,
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
    const comboActions = ref<BoxingAction[]>(props.modelValue)
    const comboTitle = ref('')
    const randomIterationsNumber = ref<number>(5)

    const categoryOptions = [BoxingActionCategory.PUNCH, BoxingActionCategory.MOVEMENT, BoxingActionCategory.DEFENSE]
    const selectedCategory = ref<BoxingActionCategory>(BoxingActionCategory.PUNCH)
    const selectedActionId = ref<number | null>(null)

    const getPunchesUseCase = container.get<GetPunchesUseCase>(TYPES.GetPunchesUseCase)

    onMounted(async () => {
      allActions.value = await getPunchesUseCase.execute()
      onUpdateAvailableActions()
    })

    const lastAction = computed(() => {
      if (comboActions.value.length === 0) return null
      return comboActions.value[comboActions.value.length - 1]
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
      comboActions.value.push(chosen)
      onUpdateAvailableActions()
    }

    function onGenerateRandomCombo() {
      const randomCombo = generateRandomCombo(allActions.value, randomIterationsNumber.value)
      comboActions.value = randomCombo
    }

    watch(selectedCategory, () => {
      onUpdateAvailableActions()
    })

    watch(comboActions, (value) => {
      emit('update:model-value', value)
    })

    return {
      categoryOptions,
      selectedCategory,
      selectedActionId,
      comboTitle,
      availableActions,
      comboActions,
      addActionToCombo,
      onGenerateRandomCombo,
      randomIterationsNumber
    }
  }
})
</script>

<style scoped lang="scss">
.min-width-220px-lg-max {
  min-width: 220px;
}
.combination-builder {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  &-wrap {
    max-width: 430px;
  }
}
</style>
