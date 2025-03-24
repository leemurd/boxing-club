<template>
  <component
    :is="tag"
    :class="{
      'btn': true,
      [`btn-${colorMap[color]}`]: !outline,
      [`btn-${BtnSizeMap[size]}`]: size !== 'medium',
      [`btn-outline-${colorMap[color]}`]: outline,
    }"
  >
    <slot/>
  </component>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { useThemeStore } from '@/presentation/stores/themeStore.ts'
import {
  BtnSizeMap,
  type ButtonColor,
  type ButtonSize
} from '@/presentation/components/shared/types.ts'

const themeStore = useThemeStore()

const BtnColorDarkMap: Record<ButtonColor, string> = {
  primary: 'light', //
  secondary: 'secondary',
  blue: 'primary',
  green: 'success',
  dark: 'light', //
  red: 'danger',
  light: 'dark', //
  info: 'info',
  warning: 'warning'
}

const BtnColorMap: Record<ButtonColor, string> = {
  primary: 'primary',
  secondary: 'secondary',
  blue: 'primary',
  green: 'success',
  dark: 'dark',
  red: 'danger',
  light: 'light',
  info: 'info',
  warning: 'warning'
}

const colorMap = computed(() => themeStore.isDarkTheme ? BtnColorDarkMap : BtnColorMap)

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
