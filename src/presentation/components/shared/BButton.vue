<template>
  <component
    :is="tag"
    :class="{
      'btn': true,
      [`btn-${BtnColorMap[color]}`]: !outline,
      [`btn-${BtnSizeMap[size]}`]: size !== 'medium',
      [`btn-outline-${BtnColorMap[color]}`]: outline,
    }"
  >
    <slot/>
  </component>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

type ButtonColor = 'primary' | 'secondary' | 'blue' | 'green' | 'dark' | 'red'
type ButtonSize = 'small' | 'medium' | 'large'

const BtnColorMap: Record<ButtonColor, string> = {
  primary: 'light',
  secondary: 'secondary',
  blue: 'primary',
  green: 'success',
  dark: 'dark',
  red: 'danger'
}

const BtnSizeMap: Record<ButtonSize, string> = {
  small: 'sm',
  medium: '',
  large: 'lg'
}

withDefaults(defineProps<{
  tag?: string;
  color?: ButtonColor
  size?: ButtonSize
  submit?: boolean,
  outline?: boolean,
}>(), {
  tag: 'button',
  color: 'primary',
  size: 'medium'
})

</script>

<style scoped lang="scss">

</style>
