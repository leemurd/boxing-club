<!-- src/presentation/components/views/EnemyCard.vue -->
<template>
  <div class="enemy-card">

    <div class="enemy-card__item">
      <div class="form-label text-center">Кто выше?</div>
      <b-button-group
        v-model="heightRelation"
        color="light"
        vertical
        size="small"
        class="w-100"
        :items="sizeKeys"
      >
        <template #default="{ item }">{{ sizeMap[item] }}</template>
      </b-button-group>
    </div>
    <div class="enemy-card__item">
      <div class="form-label text-center">Кто тяжелее?</div>
      <b-button-group
        v-model="weightRelation"
        color="light"
        vertical
        size="small"
        class="w-100"
        :items="sizeKeys"
      >
        <template #default="{ item }">{{ sizeMap[item] }}</template>
      </b-button-group>
    </div>


    <div class="enemy-card__item">
      <div class="form-label text-center">Stance (Я)</div>
      <b-button-group
        v-model="myHandedness"
        color="light"
        vertical
        size="small"
        class="w-100"
        :items="stanceKeys"
      >
        <template #default="{ item }">{{ stanceMap[item] }}</template>
      </b-button-group>
    </div>

    <div class="enemy-card__item">
      <div class="form-label text-center">Стиль (Я)</div>
      <b-button-group
        v-model="myStyle"
        color="light"
        vertical
        size="small"
        class="w-100"
        :items="boxingStyleKeys"
      >
        <template #default="{ item }">{{ boxingStyleMap[item] }}</template>
      </b-button-group>
    </div>

    <div class="enemy-card__item">
      <div class="form-label text-center">Руки (Я)</div>
      <b-button-group
        v-model="myGuard"
        color="light"
        vertical
        size="small"
        class="w-100"
        :items="boxingGuardKeys"
      >
        <template #default="{ item }">{{ boxingGuardMap[item] }}</template>
      </b-button-group>
    </div>

    <div class="enemy-card__item">
      <div class="form-label text-center">Stance (Противник)</div>
      <b-button-group
        v-model="oppHandedness"
        color="light"
        vertical
        size="small"
        class="w-100"
        :items="stanceKeys"
      >
        <template #default="{ item }">{{ stanceMap[item] }}</template>
      </b-button-group>
    </div>

    <div class="enemy-card__item">
      <div class="form-label text-center">Стиль (Противник)</div>
      <b-button-group
        v-model="oppStyle"
        color="light"
        vertical
        size="small"
        class="w-100"
        :items="boxingStyleKeys"
      >
        <template #default="{ item }">{{ boxingStyleMap[item] }}</template>
      </b-button-group>
    </div>

    <div class="enemy-card__item">
      <div class="form-label text-center">Руки (Противник)</div>
      <b-button-group
        v-model="oppGuard"
        color="light"
        vertical
        size="small"
        class="w-100"
        :items="boxingGuardKeys"
      >
        <template #default="{ item }">{{ boxingGuardMap[item] }}</template>
      </b-button-group>
    </div>

    <b-button
      color="primary"
      class="w-100"
      size="large"
      @click="calculateStrategy"
    >
      Get strategy
    </b-button>

    <ul v-if="strategyResult.length">
      <li
        v-for="(item, idx) in strategyResult"
        :key="idx"
      >
        {{ item }}
      </li>
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
} from '@/application/useCases/getEnemyCard.ts'
import BButton from '@/presentation/components/shared/BButton.vue'
import BButtonGroup from '@/presentation/components/shared/BButtonGroup.vue'

const sizeMap: Record<BodyRelation, string> = {
  [BodyRelation.I_AM_BIGGER]: 'Me',
  [BodyRelation.I_AM_SMALLER]: 'Opponent',
  [BodyRelation.EQUAL]: 'Similar'
}
const sizeKeys = Object.keys(sizeMap) as BodyRelation[]

const stanceMap: Record<StanceSide, string> = {
  orthodox: 'Orthodox',
  southpaw: 'Southpaw'
}
const stanceKeys = Object.keys(stanceMap) as StanceSide[]

const boxingStyleMap: Record<BoxerStyle, string> = {
  gamer: 'Player',
  puncher: 'Puncher',
  technician: 'Technician',
  counterpuncher: 'Counterpuncher'
}
const boxingStyleKeys = Object.keys(boxingStyleMap) as BoxerStyle[]

const boxingGuardMap: Record<BoxerGuard, string> = {
  closed: 'Closed stance',
  classical: 'Classical stance',
  handsDown: 'Hand down'
}
const boxingGuardKeys = Object.keys(boxingGuardMap) as BoxerGuard[]

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
  padding: 0 20px;
  gap: 30px;
}
</style>
