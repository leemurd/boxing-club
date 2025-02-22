<template>
  <div>
    <h1>Справочник ударов</h1>
    <ul>
      <li v-for="punch in punches" :key="punch.id">
        <strong>{{ punch.name }}</strong>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { container } from '@/infrastructure/di/container';
import { TYPES } from '@/infrastructure/di/types';
import { GetPunchesUseCase } from '@/application/useCases/GetPunchesUseCase';
import type { Punch } from '@/domain/entities/Punch';

export default defineComponent({
  name: 'PunchesCatalog',
  setup() {
    const getPunchesUseCase = container.get<GetPunchesUseCase>(TYPES.GetPunchesUseCase);
    const punches = ref<Punch[]>([]);

    onMounted(async () => {
      punches.value = await getPunchesUseCase.execute();
    });

    return {
      punches,
    };
  },
});
</script>
