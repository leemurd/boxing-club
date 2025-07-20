<template>
  <ion-list>
    <ion-item
      v-for="(item, index) in localArray"
      :key="index"
    >
      <b-checkbox
        v-model="item.checked"
        :disabled="disabledItem && item[disabledItem]"
      >
        {{ optionLabel ? item[optionLabel] : item }}
      </b-checkbox>
    </ion-item>
  </ion-list>
</template>

<script setup lang="ts">
import BCheckbox from '@/presentation/components/shared/BCheckbox.vue'
import { computed, ref, watch } from 'vue'
import { IonList, IonItem } from '@ionic/vue'

const props = withDefaults(defineProps<{
  items: any[],
  modelValue: any[],
  optionLabel?: string
  optionId?: string
  disabledItem?: string
}>(), {})

const emit = defineEmits<{
  (e: 'update:model-value', value: any[]): void,
}>()

const localArray = ref<any[]>(props.items.map((item) => ({
  ...item,
  checked: props.modelValue.includes(item.id)
})))

const checkedVals = computed(
  () => localArray.value.filter((item) => item.checked).map((item) => item.id)
)

watch(() => checkedVals.value, (val) => {
  emit('update:model-value', val)
}, {
  deep: true
})
</script>
