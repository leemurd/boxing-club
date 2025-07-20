<!-- src/presentation/components/modals/CategorySelectorModal.vue -->
<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button
          color="medium"
          @click="cancel"
        >Cancel</ion-button>
      </ion-buttons>
      <ion-title>Select category</ion-title>
      <ion-buttons slot="end">
        <ion-button
          :strong="true"
          @click="confirm"
        >Confirm</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <b-checkbox-list
      v-model="selectedLocal"
      :items="categoryStore.list"
      option-label="name"
    />
  </ion-content>
</template>

<script lang="ts" setup>
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  modalController
} from '@ionic/vue'
import { onMounted, toRef } from 'vue'
import BCheckboxList from '@/presentation/components/shared/BCheckboxList.vue'
import { useCategoryStore } from '@/presentation/stores/categoryStore.ts'

const props = defineProps<{
  selected: any[]
}>()

const categoryStore = useCategoryStore()
const selectedLocal = toRef<any[]>(props.selected)

onMounted(async () => {
  await categoryStore.load()
})

const cancel = () => modalController.dismiss(null, 'cancel')
const confirm = () => modalController.dismiss(selectedLocal.value, 'confirm')
</script>
