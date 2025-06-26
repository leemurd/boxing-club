<!-- src/presentation/components/shared/BButton.vue -->
<template>
  <ion-button
    :color="color"
    :fill="fill"
    :size="size"
    :type="type"
    :expand="expand"
  >
    <slot />
  </ion-button>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, toRefs } from 'vue'
import { IonButton } from '@ionic/vue'
import {
  type ButtonColor,
  type ButtonSize
} from '@/presentation/components/shared/types.ts'



// Пропсы компонента
const props = withDefaults(
  defineProps<{
    color?: ButtonColor
    size?: ButtonSize
    fill?: 'clear' | 'outline' | 'solid' | 'default'
    submit?: boolean
    type?: 'submit' | 'button' | 'reset'
    expand?: 'block' | 'full'
  }>(),
  {
    // color: '',
    // size: '',
    // fill: '',
    submit: false,
    type: 'button'
  }
)

const {
  color, size, type
} = toRefs(props)
</script>
