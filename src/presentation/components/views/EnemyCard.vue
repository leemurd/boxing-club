<!-- src/presentation/components/views/EnemyCard.vue -->
<template>
  <page-default>
    <div class="enemy-card">
      <div class="enemy-card__item">
        <horizontal-segment-group
          v-model="heightRelation"
          :items="sizeKeys"
          label="Кто выше?"
        >
          <template v-slot="{ item }">{{ sizeMap[item as BodyRelation] }}</template>
        </horizontal-segment-group>
      </div>
      <div class="enemy-card__item">
        <horizontal-segment-group
          v-model="weightRelation"
          :items="sizeKeys"
          label="Кто тяжелее?"
        >
          <template v-slot="{ item }">{{ sizeMap[item as BodyRelation] }}</template>
        </horizontal-segment-group>
      </div>


      <div class="enemy-card__item">
        <horizontal-segment-group
          v-model="myHandedness"
          :items="stanceKeys"
          label="Stance (Я)"
        >
          <template v-slot="{ item }">{{ stanceMap[item as StanceSide] }}</template>
        </horizontal-segment-group>
      </div>

      <div class="enemy-card__item">
        <horizontal-segment-group
          v-model="oppHandedness"
          :items="stanceKeys"
          label="Stance (Противник)"
        >
          <template v-slot="{ item }">{{ stanceMap[item as StanceSide] }}</template>
        </horizontal-segment-group>
      </div>

      <div class="enemy-card__item">
        <vertical-radio-group
          v-model="myStyle"
          :items="boxingStyleKeys"
          label="Стиль (Я)"
        >
          <template v-slot="{ item }">{{ boxingStyleMap[item as BoxerStyle] }}</template>
        </vertical-radio-group>
      </div>

      <div class="enemy-card__item">
        <vertical-radio-group
          v-model="myGuard"
          :items="boxingGuardKeys"
          label="Руки (Я)"
        >
          <template v-slot="{ item }">{{ boxingGuardMap[item as BoxerGuard] }}</template>
        </vertical-radio-group>
      </div>

      <div class="enemy-card__item">
        <vertical-radio-group
          v-model="oppStyle"
          color="light"
          vertical
          size="small"
          class="w-100"
          :items="boxingStyleKeys"
          label="Стиль (Противник)"
        >
          <template v-slot="{ item }">{{ boxingStyleMap[item as BoxerStyle] }}</template>
        </vertical-radio-group>
      </div>

      <div class="enemy-card__item">
        <vertical-radio-group
          v-model="oppGuard"
          color="light"
          vertical
          size="small"
          class="w-100"
          :items="boxingGuardKeys"
          label="Руки (Противник)"
        >
          <template v-slot="{ item }">{{ boxingGuardMap[item as BoxerGuard] }}</template>
        </vertical-radio-group>
      </div>

      <ul v-if="strategyResult.length">
        <li
          v-for="(item, idx) in strategyResult"
          :key="idx"
        >
          {{ item }}
        </li>
      </ul>

      <b-button
        color="primary"
        class="w-100"
        size="default"
        @click="calculateStrategy"
      >
        Get strategy
      </b-button>
    </div>
  </page-default>
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
import PageDefault from '@/presentation/components/layout/page/PageDefault.vue'
import HorizontalSegmentGroup from '@/presentation/components/shared/HorizontalSegmentGroup.vue'
import VerticalRadioGroup from '@/presentation/components/shared/VerticalRadioGroup.vue'

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
  gap: 20px;
}
</style>
