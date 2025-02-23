<template>
  <div class="combination-builder">
    <div class="combination-builder-wrap">
      <h1>Combo creator</h1>

      <div class="input-group input-group-lg mb-3">
        <label
          class="input-group-text min-width-220px-lg-max"
          for="inputGroupSelect01"
        >Choose action type</label>
        <select
          v-model="selectedType"
          class="form-select text-capitalize"
          id="inputGroupSelect01"
        >
          <option
            v-for="type in typeOptions"
            :value="type"
            :key="type"
          >{{ type }}</option>
        </select>
      </div>

      <div class="input-group input-group-lg mb-3">
        <label
          class="input-group-text min-width-220px-lg-max"
          for="inputGroupSelect02"
        >Select action</label>
        <select
          v-model="selectedPunchId"
          class="form-select"
          id="inputGroupSelect02"
        >
          <option
            v-for="punch in availableActions"
            :value="punch.id"
            :key="punch.id"
          >{{ punch.name }}</option>
        </select>
      </div>

      <button
        class="btn btn-primary btn-block w-100"
        @click="addPunchToCombo"
      >Add action</button>

      <div>
        <p>Preview:</p>
        <ul>
          <li v-for="punch in comboPunches" :key="punch.id">{{ punch.name }}</li>
        </ul>
      </div>

      <div class="input-group input-group-lg mb-3">
        <input
          v-model="comboTitle"
          type="text"
          class="form-control"
          placeholder="Combo title"
          aria-label="Combo title"
          aria-describedby="button-addon2"
        >
        <button
          class="btn btn-outline-secondary"
          type="button"
          id="button-addon2"
          @click="buildCombo"
        >Button</button>
      </div>

      <div v-if="createdCombo">
        <h4>Созданная комбинация: {{ createdCombo.title }}</h4>
        <ul>
          <li v-for="punch in createdCombo.punches" :key="punch.id">{{ punch.name }}</li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import { container } from '@/infrastructure/di/container'
import { TYPES } from '@/infrastructure/di/types'
import { GetPunchesUseCase } from '@/application/useCases/GetPunchesUseCase'
import { CreateCombinationUseCase } from '@/application/useCases/CreateCombinationUseCase'
import { CombinationBuilder } from '@/domain/services/CombinationBuilder'
import type { Combination } from '@/domain/entities/Combination'
import type { BoxingAction } from '@/domain/entities/BoxingAction.ts'
import { ActionCategory, type ActionCategoryValue } from '@/domain/entities/ActionCategory.ts'

export default defineComponent({
  name: 'CombinationBuilderView',
  setup() {
    const allPunches = ref<BoxingAction[]>([])
    const availableActions = ref<BoxingAction[]>([])
    const selectedPunchId = ref<number | null>(null)
    const typeOptions = Object.values(ActionCategory)
    const selectedType = ref<ActionCategoryValue>(ActionCategory.PUNCH)

    const comboPunches = ref<BoxingAction[]>([])
    const comboTitle = ref<string>('')
    const createdCombo = ref<Combination | null>(null)

    const getPunchesUseCase = container.get<GetPunchesUseCase>(TYPES.GetPunchesUseCase)

    const getAvailableActions = async () => {
      availableActions.value = []
      const lastAddedPunch = comboPunches.value[comboPunches.value.length - 1]
      if (!lastAddedPunch) {
        availableActions.value = allPunches.value.filter(item => item.category === selectedType.value)
        selectedPunchId.value = availableActions.value[0]?.id
        return
      }
      for (const item of lastAddedPunch.possibleNext) {
        const action = await getPunchesUseCase.getPunchById(item)
        if (action && action.category === selectedType.value) {
          availableActions.value.push(action)
        }
      }
      selectedPunchId.value = availableActions.value[0]?.id
    }

    // Здесь мы пока что не регистрировали CreateCombinationUseCase в контейнере,
    // поэтому просто создадим его вручную:
    const combinationBuilder = new CombinationBuilder()
    const createCombinationUseCase = new CreateCombinationUseCase(combinationBuilder)

    onMounted(async () => {
      allPunches.value = await getPunchesUseCase.execute()
      selectedPunchId.value = allPunches.value[0]?.id ?? null
      await getAvailableActions()
    })

    function addPunchToCombo() {
      if (!selectedPunchId.value) return
      const punch = allPunches.value.find((p) => p.id === selectedPunchId.value)
      if (punch) {
        comboPunches.value.push(punch)
        // можно параллельно вызывать combinationBuilder.addPunch(punch);
        combinationBuilder.addAction(punch)

        getAvailableActions()
      }
    }

    function buildCombo() {
      if (!comboTitle.value.trim()) return
      createdCombo.value = createCombinationUseCase.buildCombination(comboTitle.value.trim())
      // Обнулить для новой комбинации
      comboPunches.value = []
      combinationBuilder.reset()
      comboTitle.value = ''
    }

    watch(selectedType, async () => {
      await getAvailableActions()
    })

    return {
      allPunches,
      selectedPunchId,
      selectedType,
      typeOptions,
      comboPunches,
      comboTitle,
      createdCombo,
      addPunchToCombo,
      buildCombo,
      availableActions,
    }
  },
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
