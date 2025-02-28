<template>
  <div class="combination-builder">
    <div class="combination-builder-wrap">
      <h1>Комбинатор</h1>

      <h4>Действие</h4>
      <div class="btn-group btn-group-sm mb-4 w-100" role="group">
        <template
          v-for="(cat, index) in categoryOptions"
          :key="index"
        >
          <input
            type="radio"
            class="btn-check"
            name="height"
            :id="`height${index}`"
            autocomplete="off"
            v-model="selectedCategory"
            :value="cat"
          >
          <label class="btn btn-outline-primary text-capitalize" :for="`height${index}`">{{ cat }}</label>
        </template>
      </div>

      <h4>Вариант</h4>
      <div class="btn-group-vertical btn-group-sm mb-4 w-100" role="group">
        <template
          v-for="(act, index) in availableActions"
          :key="index"
        >
          <input
            type="radio"
            class="btn-check"
            name="action"
            :id="`action${act.id}`"
            autocomplete="off"
            v-model="selectedActionId"
            :value="act.id"
          >
          <label class="btn btn-outline-secondary" :for="`action${act.id}`">{{ act.name }}</label>
        </template>
      </div>

      <button class="btn btn-primary btn-block w-100" @click="addActionToCombo">
        Добавить
      </button>

      <div>
        <p>Preview:</p>
        <div class="d-flex justify-content-center flex-wrap mb-4">
          <div
            v-for="(item, index) in comboActions" :key="index"
            class=""
          >
            <span class="badge text-bg-primary m-1">{{ item.name }}</span>
            <template v-if="index !== comboActions.length - 1">-</template>
          </div>
        </div>
      </div>

      <div class="input-group input-group-sm mb-3">
        <span class="input-group-text" id="inputGroup-sizing-sm">Count:</span>
        <input
          type="number"
          class="form-control text-center"
          placeholder=""
          aria-label="Количество движений"
          aria-describedby="button-addon2"
          v-model="randomIterationsNumber"
        >
        <button
          class="btn btn-outline-success"
          type="button"
          id="button-addon2"
          @click="onGenerateRandomCombo"
        >Generate random combo</button>
      </div>

      <div class="input-group input-group-sm mb-3">
        <input
          v-model="comboTitle"
          type="text"
          class="form-control"
          placeholder="Combo title"
          aria-label="Combo title"
        />
        <button class="btn btn-success" type="button" @click="buildCombo">
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
import { generateRandomCombo } from '@/application/useCases/generateRandomCombo.ts'

export default defineComponent({
  name: 'CombinationBuilderView',
  setup() {
    const allActions = ref<BoxingAction[]>([])
    const comboActions = ref<BoxingAction[]>([])
    const comboTitle = ref('')
    const randomIterationsNumber = ref<number>(5)
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
      onUpdateAvailableActions()
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

    function onUpdateAvailableActions() {
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
      onUpdateAvailableActions()
    }

    function buildCombo() {
      if (!comboTitle.value.trim()) return
      createdCombo.value = createCombinationUseCase.buildCombination(comboTitle.value.trim())
      comboActions.value = []
      combinationBuilder.reset()
      comboTitle.value = ''
      onUpdateAvailableActions()
    }

    function onGenerateRandomCombo() {
      const randomCombo = generateRandomCombo(allActions.value, randomIterationsNumber.value)
      comboActions.value = randomCombo
      combinationBuilder.reset()
      randomCombo.forEach(a => combinationBuilder.addAction(a))
    }

    watch(selectedCategory, () => {
      onUpdateAvailableActions()
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
      buildCombo,
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
    //width: 400px;
    max-width: 430px;
  }
}
</style>
