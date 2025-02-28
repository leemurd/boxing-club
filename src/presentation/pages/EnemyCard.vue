<template>
  <div class="enemy-card">
    <h1>Enemy Card</h1>

    <div class="row">
      <div class="col">
        <h4>Кто выше?</h4>
        <div class="btn-group-vertical btn-group-sm mb-4" role="group" aria-label="height relation">
          <template v-for="(item, index) in Object.keys(sizeMap)" :key="index">
            <input
              type="radio"
              class="btn-check"
              name="height"
              :id="`height_${item}`"
              :value="item"
              v-model="heightRelation"
            />
            <label class="btn btn-outline-primary" :for="`height_${item}`">{{ sizeMap[item] }}</label>
          </template>
        </div>
      </div>

      <div class="col">
        <h4>Кто тяжелее?</h4>
        <div class="btn-group-vertical btn-group-sm mb-4" role="group" aria-label="weight relation">
          <template v-for="(item, index) in Object.keys(sizeMap)" :key="index">
            <input
              type="radio"
              class="btn-check"
              name="weight"
              :id="`weight_${item}`"
              :value="item"
              v-model="weightRelation"
            />
            <label class="btn btn-outline-primary" :for="`weight_${item}`">{{ sizeMap[item] }}</label>
          </template>
        </div>
      </div>
    </div>

    <div class="d-flex">
      <div class="row">
        <div class="col d-flex flex-column">
          <h4>Я</h4>
          <div class="btn-group btn-group-sm mb-4" role="group" aria-label="my stance">
            <template v-for="(item, index) in Object.keys(stanceMap)" :key="index">
              <input
                type="radio"
                class="btn-check"
                name="myStance"
                :id="`stance_${item}`"
                :value="item"
                v-model="myHandedness"
              />
              <label class="btn btn-outline-primary" :for="`stance_${item}`">{{ stanceMap[item] }}</label>
            </template>
          </div>

          <h6>Стиль</h6>
          <div class="btn-group-vertical btn-group-sm mb-4" role="group" aria-label="my style">
            <template v-for="(item, index) in Object.keys(boxingStyleMap)" :key="index">
              <input
                type="radio"
                class="btn-check"
                name="myStyle"
                :id="`myStyle_${item}`"
                :value="item"
                v-model="myStyle"
              />
              <label class="btn btn-outline-primary" :for="`myStyle_${item}`">{{ boxingStyleMap[item] }}</label>
            </template>
          </div>

          <h6>Руки</h6>
          <div class="btn-group-vertical btn-group-sm mb-4" role="group" aria-label="my guard">
            <template v-for="(item, index) in Object.keys(boxingGuardMap)" :key="index">
              <input
                type="radio"
                class="btn-check"
                name="myGuard"
                :id="`myGuard_${item}`"
                :value="item"
                v-model="myGuard"
              />
              <label class="btn btn-outline-primary" :for="`myGuard_${item}`">{{ boxingGuardMap[item] }}</label>
            </template>
          </div>
        </div>

        <div class="col d-flex flex-column">
          <h4>Противник</h4>
          <div class="btn-group btn-group-sm mb-4" role="group" aria-label="opp stance">
            <template v-for="(item, index) in Object.keys(stanceMap)" :key="index">
              <input
                type="radio"
                class="btn-check"
                name="oppStance"
                :id="`oppStance_${item}`"
                :value="item"
                v-model="oppHandedness"
              />
              <label class="btn btn-outline-primary" :for="`oppStance_${item}`">{{ stanceMap[item] }}</label>
            </template>
          </div>

          <h6>Стиль</h6>
          <div class="btn-group-vertical btn-group-sm mb-4" role="group" aria-label="opp style">
            <template v-for="(item, index) in Object.keys(boxingStyleMap)" :key="index">
              <input
                type="radio"
                class="btn-check"
                name="oppStyle"
                :id="`oppStyle_${item}`"
                :value="item"
                v-model="oppStyle"
              />
              <label class="btn btn-outline-primary" :for="`oppStyle_${item}`">{{ boxingStyleMap[item] }}</label>
            </template>
          </div>

          <h6>Руки</h6>
          <div class="btn-group-vertical btn-group-sm mb-4" role="group" aria-label="opp guard">
            <template v-for="(item, index) in Object.keys(boxingGuardMap)" :key="index">
              <input
                type="radio"
                class="btn-check"
                name="oppGuard"
                :id="`oppGuard_${item}`"
                :value="item"
                v-model="oppGuard"
              />
              <label class="btn btn-outline-primary" :for="`oppGuard_${item}`">{{ boxingGuardMap[item] }}</label>
            </template>
          </div>
        </div>
      </div>
    </div>

    <button class="btn btn-success mb-3" @click="calculateStrategy">
      Получить стратегию
    </button>

    <ul v-if="strategyResult?.length">
      <li v-for="(item, key) in strategyResult" :key="key">{{ item }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  BodyRelation,
  getExtendedFightStrategy,
  type FightOptions,
  type StanceSide,
  type BoxerStyle,
  type BoxerGuard
} from '@/application/useCases/getEnemyCard'

const sizeMap: Record<BodyRelation, string> = {
  [BodyRelation.I_AM_BIGGER]: 'Я',
  [BodyRelation.I_AM_SMALLER]: 'Противник',
  [BodyRelation.EQUAL]: 'Примерно одинаково',
}

const stanceMap: Record<StanceSide, string> = {
  orthodox: 'Правша',
  southpaw: 'Левша',
}

const boxingStyleMap: Record<BoxerStyle, string> = {
  gamer: 'Игровик',
  puncher: 'Панчер',
  technician: 'Технарь',
  counterpuncher: 'Контрпанчер',
}

const boxingGuardMap: Record<BoxerGuard, string> = {
  closed: 'Закрытая стойка',
  classical: 'Классическая стойка',
  handsDown: 'Руки внизу',
}

const heightRelation = ref(BodyRelation.I_AM_BIGGER)
const weightRelation = ref(BodyRelation.I_AM_BIGGER)
const myHandedness = ref<StanceSide>('orthodox')
const oppHandedness = ref<StanceSide>('orthodox')
const myStyle = ref<BoxerStyle>('gamer')
const oppStyle = ref<BoxerStyle>('gamer')
const myGuard = ref<BoxerGuard>('closed')
const oppGuard = ref<BoxerGuard>('closed')

const strategyResult = ref<string[]>([])

function calculateStrategy() {
  const opts: FightOptions = {
    heightRelation: heightRelation.value,
    weightRelation: weightRelation.value,
    myHandedness: myHandedness.value,
    oppHandedness: oppHandedness.value,
    myStyle: myStyle.value,
    oppStyle: oppStyle.value,
    myGuard: myGuard.value,
    oppGuard: oppGuard.value
  }
  strategyResult.value = getExtendedFightStrategy(opts)
}
</script>

<style scoped lang="scss">
.enemy-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
