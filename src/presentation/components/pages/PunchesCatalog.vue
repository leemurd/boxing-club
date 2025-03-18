<template>
  <div>
    <ul>
      <li
        v-for="punch in punches"
        :key="punch.id"
      >
        <strong>{{ punch.name }}</strong>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { container } from '@/infrastructure/di/container.ts'
import { TYPES } from '@/infrastructure/di/types.ts'
import { GetPunchesUseCase } from '@/application/useCases/GetPunchesUseCase.ts'
import type { BoxingAction } from '@/domain/entities/BoxingAction.ts'

export default defineComponent({
  name: 'PunchesCatalog',
  setup() {
    const getPunchesUseCase = container.get<GetPunchesUseCase>(TYPES.GetPunchesUseCase)
    const punches = ref<BoxingAction[]>([])

    onMounted(async () => {
      punches.value = await getPunchesUseCase.execute()
    })

    return {
      punches
    }
  }
})
</script>
