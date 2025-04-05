import { reactive } from 'vue'
import type { Component } from 'vue'
import { ModalKey } from '@/presentation/modals/modalKeys'
import { modalMap } from '@/presentation/modals/modalMap'

export interface ModalState {
  isOpen: boolean
  component: Component | null
  props: Record<string, any>
}

const modalState = reactive<ModalState>({
  isOpen: false,
  component: null,
  props: {}
})

export function openModalByKey(key: ModalKey, props: Record<string, any> = {}): void {
  const component = modalMap[key]
  if (component) {
    modalState.component = component
    modalState.props = props
    modalState.isOpen = true
  } else {
    console.error(`Modal with key "${key}" not found.`)
  }
}

export function closeModal(): void {
  modalState.isOpen = false
  modalState.component = null
  modalState.props = {}
}

export function useModalService() {
  return {
    modalState,
    openModalByKey,
    closeModal
  }
}
