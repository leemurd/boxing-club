<!-- src/presentation/components/modals/TagSelectorModal.vue -->
<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-button
          color="medium"
          @click="cancel"
        >Cancel</ion-button>
      </ion-buttons>
      <ion-title>Select tags</ion-title>
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
      :items="tagStore.list"
      option-label="name"
      disabled-item="isAutomatic"
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
import { useTagStore }     from '@/presentation/stores/tagStore'

const props = defineProps<{
  selected: any[]
}>()

const tagStore = useTagStore()
const selectedLocal = toRef<any[]>(props.selected)

onMounted(async () => {
  await tagStore.load()
})

const cancel = () => modalController.dismiss(null, 'cancel')
const confirm = () => modalController.dismiss(selectedLocal.value, 'confirm')
</script>
