<template>
  <div class="combination-builder">
    <div class="combination-builder-wrap">
      <h1>Combo creator</h1>

      <div class="input-group input-group-lg mb-3">
        <label class="input-group-text min-width-220px-lg-max" for="selectCategory">
          Choose action category
        </label>
        <select v-model="selectedCategory" class="form-select text-capitalize" id="selectCategory">
          <option v-for="cat in categoryOptions" :value="cat" :key="cat">{{ cat }}</option>
        </select>
      </div>

      <div class="input-group input-group-lg mb-3">
        <label class="input-group-text min-width-220px-lg-max" for="selectAction">
          Select action
        </label>
        <select v-model="selectedActionId" class="form-select" id="selectAction">
          <option v-for="act in availableActions" :value="act.id" :key="act.id">{{ act.name }}</option>
        </select>
      </div>

      <button class="btn btn-primary btn-block w-100" @click="addActionToCombo">
        Add action
      </button>

      <div>
        <p>Preview:</p>
        <ul>
          <li v-for="item in comboActions" :key="item.id">
            {{ item.name }}
          </li>
        </ul>
      </div>

      <div class="input-group input-group-lg mb-3">
        <input
          v-model="comboTitle"
          type="text"
          class="form-control"
          placeholder="Combo title"
          aria-label="Combo title"
        />
        <button class="btn btn-outline-secondary" type="button" @click="buildCombo">
          Save Combo
        </button>
      </div>

      <div v-if="createdCombo">
        <h4>Created combo: {{ createdCombo.title }}</h4>
        <ul>
          <li v-for="punch in createdCombo.punches" :key="punch.id">
            {{ punch.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import { container } from '@/infrastructure/di/container'
import { TYPES } from '@/infrastructure/di/types'
import { CombinationBuilder } from '@/domain/services/CombinationBuilder'
import { CreateCombinationUseCase } from '@/application/useCases/CreateCombinationUseCase'
import type { Combination } from '@/domain/entities/Combination'
import type { BoxingAction } from '@/domain/entities/BoxingAction'
import { BoxingActionCategory } from '@/domain/entities/BoxingAction'
import { getNextActions } from '@/application/useCases/getNextActions'

// Если вы по-прежнему используете GetPunchesUseCase, замените его на новый use-case
// или импортируйте MOCK_ACTIONS напрямую.
// Здесь для примера предполагаем, что GetPunchesUseCase возвращает все BoxingAction.
import { GetPunchesUseCase } from '@/application/useCases/GetPunchesUseCase'

export default defineComponent({
  name: 'CombinationBuilderView',
  setup() {
    const allActions = ref<BoxingAction[]>([])
    const comboActions = ref<BoxingAction[]>([])
    const comboTitle = ref('')
    const createdCombo = ref<Combination | null>(null)

    const categoryOptions = [
      BoxingActionCategory.PUNCH,
      BoxingActionCategory.MOVEMENT,
      BoxingActionCategory.DEFENSE
    ]
    const selectedCategory = ref<BoxingActionCategory>(BoxingActionCategory.PUNCH)
    const selectedActionId = ref<number | null>(null)

    const getPunchesUseCase = container.get<GetPunchesUseCase>(TYPES.GetPunchesUseCase)
    const combinationBuilder = new CombinationBuilder()
    const createCombinationUseCase = new CreateCombinationUseCase(combinationBuilder)

    onMounted(async () => {
      allActions.value = await getPunchesUseCase.execute()
      updateAvailableActions()
    })

    const lastAction = computed(() => {
      if (comboActions.value.length === 0) return null
      return comboActions.value[comboActions.value.length - 1]
    })

    const availableActions = computed<BoxingAction[]>(() => {
      if (!lastAction.value) {
        return allActions.value.filter(a => a.category === selectedCategory.value)
      }
      const possible = getNextActions(lastAction.value, allActions.value)
      return possible.filter(a => a.category === selectedCategory.value)
    })

    function updateAvailableActions() {
      if (availableActions.value.length > 0) {
        selectedActionId.value = availableActions.value[0].id
      } else {
        selectedActionId.value = null
      }
    }

    function addActionToCombo() {
      if (selectedActionId.value == null) return
      const chosen = allActions.value.find(a => a.id === selectedActionId.value)
      if (!chosen) return
      comboActions.value.push(chosen)
      combinationBuilder.addAction(chosen)
      updateAvailableActions()
    }

    function buildCombo() {
      if (!comboTitle.value.trim()) return
      createdCombo.value = createCombinationUseCase.buildCombination(comboTitle.value.trim())
      comboActions.value = []
      combinationBuilder.reset()
      comboTitle.value = ''
      updateAvailableActions()
    }

    watch(selectedCategory, () => {
      updateAvailableActions()
    })

    return {
      categoryOptions,
      selectedCategory,
      selectedActionId,
      comboTitle,
      createdCombo,
      availableActions,
      comboActions,
      addActionToCombo,
      buildCombo
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
  &-wrap {
    width: 400px;
  }
}
</style>
