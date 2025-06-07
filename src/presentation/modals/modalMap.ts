import { type Component, markRaw } from 'vue'
import ConfirmationModal from '@/presentation/components/modals/ConfirmationModal.vue'
import { ModalKey } from '@/presentation/modals/modalKeys.ts'
import BaseModal from '@/presentation/components/modals/BaseModal.vue'
import CategorySelectorModal from '@/presentation/components/modals/CategorySelectorModal.vue'
import BaseRenameModal from '@/presentation/components/modals/BaseRenameModal.vue'
import TagSelectorModal from '@/presentation/components/modals/TagSelectorModal.vue'
import ComboSelectorModal from '@/presentation/components/modals/ComboSelectorModal.vue'

export const modalMap: Record<ModalKey, Component> = {
  [ModalKey.BASE_MODAL]: markRaw(BaseModal),
  [ModalKey.CONFIRMATION]: markRaw(ConfirmationModal),
  [ModalKey.CATEGORY_SELECTOR]: markRaw(CategorySelectorModal),
  [ModalKey.BASE_RENAME]: markRaw(BaseRenameModal),
  [ModalKey.TAG_SELECTOR]: markRaw(TagSelectorModal),
  [ModalKey.COMBO_SELECTOR]: markRaw(ComboSelectorModal)
}
