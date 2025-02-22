<template>
  <div>
    <h1>Сконструировать комбо</h1>

    <div>
      <label>Выберите действие:</label>
      <select v-model="selectedType">
        <option v-for="type in typeOptions" :value="type" :key="type">
          {{ type }}
        </option>
      </select>
      <button @click="addPunchToCombo">Выбрать</button>
    </div>

    <div>
      <label>Выберите удар:</label>
      <select v-model="selectedPunchId">
        <option v-for="punch in availablePunches" :value="punch.id" :key="punch.id">
          {{ punch.name }}
        </option>
      </select>
      <button @click="addPunchToCombo">Добавить удар</button>
    </div>

    <div>
      <p>Текущая серия:</p>
      <ul>
        <li v-for="punch in comboPunches" :key="punch.id">{{ punch.name }}</li>
      </ul>
    </div>

    <div>
      <input v-model="comboTitle" placeholder="Название комбинации" />
      <button @click="buildCombo">Создать комбо</button>
    </div>

    <div v-if="createdCombo">
      <h2>Созданная комбинация: {{ createdCombo.title }}</h2>
      <ul>
        <li v-for="punch in createdCombo.punches" :key="punch.id">{{ punch.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue'
import { container } from '@/infrastructure/di/container'
import { TYPES } from '@/infrastructure/di/types'
import { GetPunchesUseCase } from '@/application/useCases/GetPunchesUseCase'
import { Punch } from '@/domain/entities/Punch'
import { CreateCombinationUseCase } from '@/application/useCases/CreateCombinationUseCase'
import { CombinationBuilder } from '@/domain/services/CombinationBuilder'
import type { Combination } from '@/domain/entities/Combination'
import type { BoxingAction } from '@/domain/entities/BoxingAction.ts'
import type { Movement } from '@/domain/entities/Movement.ts'
import type { Defense } from '@/domain/entities/Defense.ts'
import { ActionCategory, type ActionCategoryValue } from '@/domain/entities/ActionCategory.ts'

export default defineComponent({
  name: 'CombinationBuilderView',
  setup() {
    const allPunches = ref<BoxingAction[]>([])
    const availablePunches = ref<Punch[]>([])
    const availableMoves = ref<Movement[]>([])
    const availableDefence = ref<Defense[]>([])
    const selectedPunchId = ref<number | null>(null)
    const typeOptions = Object.values(ActionCategory)
    const selectedType = ref<ActionCategoryValue>(ActionCategory.PUNCH)

    const comboPunches = ref<BoxingAction[]>([])
    const comboTitle = ref<string>('')
    const createdCombo = ref<Combination | null>(null)

    const getPunchesUseCase = container.get<GetPunchesUseCase>(TYPES.GetPunchesUseCase)

    const getAvailablePunches = async () => {
      availablePunches.value = []
      const lastAddedPunch = comboPunches.value[comboPunches.value.length - 1]
      if (!lastAddedPunch) {
        availablePunches.value = allPunches.value.filter(item => item.category === selectedType.value)
        selectedPunchId.value = availablePunches.value[0]?.id
        return
      }
      for (const item of lastAddedPunch.possibleNext) {
        // const index = lastAddedPunch.possibleNext.indexOf(item)
        const action = await getPunchesUseCase.getPunchById(item)
        if (action && action.category === selectedType.value) {
          availablePunches.value.push(action)
          // if (index === 0) selectedPunchId.value = item
        }
      }
      console.log(availablePunches.value[0]?.id)
      selectedPunchId.value = availablePunches.value[0]?.id
    }

    // Здесь мы пока что не регистрировали CreateCombinationUseCase в контейнере,
    // поэтому просто создадим его вручную:
    const combinationBuilder = new CombinationBuilder()
    const createCombinationUseCase = new CreateCombinationUseCase(combinationBuilder)

    onMounted(async () => {
      allPunches.value = await getPunchesUseCase.execute()
      selectedPunchId.value = allPunches.value[0]?.id ?? null
      await getAvailablePunches()
    })

    function addPunchToCombo() {
      if (!selectedPunchId.value) return
      const punch = allPunches.value.find((p) => p.id === selectedPunchId.value)
      if (punch) {
        comboPunches.value.push(punch)
        // можно параллельно вызывать combinationBuilder.addPunch(punch);
        combinationBuilder.addAction(punch)

        getAvailablePunches()
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
      console.log(selectedType.value)
      await getAvailablePunches()
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
      availablePunches,
    }
  },
})
</script>
