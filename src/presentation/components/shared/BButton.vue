<template>
  <component
    :is="tag"
    :class="{
      'btn': true,
      [`btn-${colorMap[color]}`]: !outline,
      [`btn-${BtnSizeMap[size]}`]: size !== 'medium',
      [`btn-outline-${colorMap[color]}`]: outline,
    }"
    :type="type"
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

const colorMap = computed<Record<ButtonColor, string>>(() => ({
  primary: 'primary',
  secondary: 'secondary',
  blue: 'primary',
  green: 'success',
  dark: themeStore.isDarkTheme? 'light' : 'dark',
  red: 'danger',
  light: themeStore.isDarkTheme? 'dark' : 'light',
  info: 'info',
  warning: 'warning',
  link: 'link'
}))

withDefaults(defineProps<{
  tag?: string;
  color?: ButtonColor
  size?: ButtonSize
  submit?: boolean,
  outline?: boolean,
  type?: string
}>(), {
  tag: 'button',
  color: 'primary',
  size: 'medium',
  type: ''
})

</script>

<style scoped lang="scss">
@import '@/presentation/styles/mixins';

.btn {
  @include slabFont;
}

@include color-mode('dark') {
  .btn-link {
    color: $gray-500!important;
    background-color: transparent!important;
  }
}

.btn-link {
  color: $dark !important;
  text-decoration: none;
  font-weight: 500;
}

</style>
