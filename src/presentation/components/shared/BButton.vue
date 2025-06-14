<!-- IonicButton.vue -->
<template>
  <ion-button
    :color="color"
    :fill="outline ? 'outline' : 'solid'"
    :size="size"
    :type="type"
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
    outline?: boolean
    submit?: boolean
    type?: 'submit' | 'button' | 'reset'
  }>(),
  {
    color: 'primary',
    size: 'default',
    fill: 'default',
    submit: false,
    type: 'button'
  }
)

const {
  color, size, outline, type
} = toRefs(props)
</script>
