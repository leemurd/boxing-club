import { type Component, markRaw } from 'vue'
import ConfirmationModal from '@/presentation/components/modals/ConfirmationModal.vue'
import { ModalKey } from '@/presentation/modals/modalKeys.ts'
import BaseModal from '@/presentation/components/modals/BaseModal.vue'

export const modalMap: Record<ModalKey, Component> = {
  [ModalKey.BASE_MODAL]: markRaw(BaseModal),
  [ModalKey.CONFIRMATION]: markRaw(ConfirmationModal)
}
