<template>
  <div class="combination-builder">
    <div class="combination-builder-wrap">
      <h1>Combo creator</h1>

      <!-- 1) Выбираем категорию (punch/defense/movement) -->
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
          >
            {{ type }}
          </option>
        </select>
      </div>

      <!-- 2) Выбираем конкретное действие из списка (фильтруется по позиции и типу) -->
      <div class="input-group input-group-lg mb-3">
        <label
          class="input-group-text min-width-220px-lg-max"
          for="inputGroupSelect02"
        >Select action</label>
        <select
          v-model="selectedActionId"
          class="form-select"
          id="inputGroupSelect02"
        >
          <option
            v-for="action in availableActions"
            :value="action.id"
            :key="action.id"
          >
            {{ action.name }}
          </option>
        </select>
      </div>

      <button
        class="btn btn-primary btn-block w-100"
        @click="addActionToCombo"
      >Add action</button>

      <!-- 3) Превью выбранных действий -->
      <div>
        <p>Preview (current stance: {{ currentStance }}):</p>
        <ul>
          <li v-for="(act, idx) in comboActions" :key="idx">
            {{ act.name }} (→ {{ act.toPosition }})
          </li>
        </ul>
      </div>

      <!-- 4) Завершаем комбинацию с названием -->
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
        >Save combo</button>
      </div>

      <!-- 5) Отображаем созданную комбинацию -->
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
import { defineComponent, ref, onMounted, watch } from 'vue';
import { container } from '@/infrastructure/di/container';
import { TYPES } from '@/infrastructure/di/types';

// Новый репозиторий
import { IPositionedActionRepository } from '@/domain/repositories/IPositionedActionRepository';
import { PositionedAction } from '@/domain/entities/PositionedAction';

import { CombinationBuilder } from '@/domain/services/CombinationBuilder';
import { CreateCombinationUseCase } from '@/application/useCases/CreateCombinationUseCase';
import type { Combination } from '@/domain/entities/Combination';

import { ActionCategory, type ActionCategoryValue } from '@/domain/entities/ActionCategory';
import { Stance } from '@/domain/entities/Stance';

export default defineComponent({
  name: 'CombinationBuilderView',
  setup() {
    // 1. DI: получаем репозиторий
    const actionRepo = container.get<IPositionedActionRepository>(TYPES.IPositionedActionRepository);

    // 2. States / Refs
    const allActions = ref<PositionedAction[]>([]);
    const availableActions = ref<PositionedAction[]>([]);

    // Текущая стойка
    const currentStance = ref<Stance>(Stance.ORTHO_NEUTRAL);

    // Выбранная категория
    const typeOptions = Object.values(ActionCategory);
    const selectedType = ref<ActionCategoryValue>(ActionCategory.PUNCH);

    // Выбранный ID действия
    const selectedActionId = ref<number | null>(null);

    // Выбранные действия (предварительный набор)
    const comboActions = ref<PositionedAction[]>([]);
    const comboTitle = ref<string>('');
    const createdCombo = ref<Combination | null>(null);

    // UseCase для сборки комбинации
    const combinationBuilder = new CombinationBuilder();
    const createCombinationUseCase = new CreateCombinationUseCase(combinationBuilder);

    // 3. Загрузить все действия при монтировании
    onMounted(async () => {
      allActions.value = await actionRepo.getAll();
      getAvailableActions();
    });

    // 4. Метод получения доступных действий (по текущей стойке + типу)
    const getAvailableActions = () => {
      availableActions.value = allActions.value.filter(a => {
        return a.fromPosition === currentStance.value && a.category === selectedType.value;
      });
      selectedActionId.value = availableActions.value[0]?.id ?? null;
    };

    // 5. Метод "добавить действие в комбо"
    function addActionToCombo() {
      if (!selectedActionId.value) return;
      const action = allActions.value.find(a => a.id === selectedActionId.value);
      if (!action) return;

      comboActions.value.push(action);
      combinationBuilder.addAction(action);

      // Переходим в новую стойку
      currentStance.value = action.toPosition;

      // Снова получаем список возможных дальнейших действий
      getAvailableActions();
    }

    // 6. Завершить сборку комбо
    function buildCombo() {
      if (!comboTitle.value.trim()) return;
      createdCombo.value = createCombinationUseCase.buildCombination(comboTitle.value.trim());
      // Сбросить всё
      comboActions.value = [];
      combinationBuilder.reset();
      comboTitle.value = '';
      // Вернёмся в исходную стойку
      currentStance.value = Stance.ORTHO_NEUTRAL;
      getAvailableActions();
    }

    // 7. Watcher: если меняем тип (punch/defense/movement), нужно пересчитать доступные варианты
    watch(selectedType, () => {
      getAvailableActions();
    });

    return {
      // template bindings
      typeOptions,
      selectedType,
      availableActions,
      selectedActionId,

      comboActions,
      comboTitle,
      createdCombo,

      addActionToCombo,
      buildCombo,

      // для отладки
      currentStance,
    };
  },
});
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
