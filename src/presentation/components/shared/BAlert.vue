<template>
  <ion-alert
    :is-open="isOpen"
    :header="header"
    :buttons="buttons"
  />
</template>

<script setup lang="ts">
import { IonAlert } from '@ionic/vue'
import type { IAlertButton } from '@/presentation/components/shared/types.ts'

defineProps<{
  header: string,
  isOpen: boolean,
  buttons: IAlertButton[]
}>()
</script>
