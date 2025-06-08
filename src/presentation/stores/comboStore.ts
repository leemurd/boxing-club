// src/presentation/stores/comboStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TYPES } from '@/infrastructure/di/types'
import type { Combination } from '@/domain/entities/Combination'
import { useAuthStore } from './authStore'
import { GetCombinationsUseCase } from '@/application/useCases/combination/GetCombinationsUseCase.ts'
import { SaveCombinationUseCase } from '@/application/useCases/combination/SaveCombinationUseCase.ts'
import { DeleteCombinationUseCase } from '@/application/useCases/combination/DeleteCombinationUseCase.ts'
import { useCategoryStore } from '@/presentation/stores/categoryStore.ts'
import type { UpdateCombinationUseCase } from '@/application/useCases/combination/UpdateCombinationUseCase.ts'
import { getUserId } from '@/presentation/utils/getUserId.ts'
import { getUC } from '@/infrastructure/di/resolver.ts'
import { GetCombinationByIdUseCase } from '@/application/useCases/combination/GetCombinationByIdUseCase.ts'

export const useComboStore = defineStore('combo', () => {
  const combos = ref<Combination[]>([])
  const authStore = useAuthStore()
  const categoryStore = useCategoryStore()

  async function removeDeletedCategories() {
    const userId = authStore.currentUser!.id
    await categoryStore.load()

    for (const comboItem of combos.value) {
      const filtered = comboItem.categoryIds.filter((id) => categoryStore.list.some((cat) => cat.id === id))
      if (filtered.length !== comboItem.categoryIds.length) {
        comboItem.categoryIds = filtered
        const updateUC = getUC<UpdateCombinationUseCase>(TYPES.UpdateCombinationUseCase)
        await updateUC.execute(userId, comboItem)
      }
    }

    await load()
  }

  async function load() {
    const userId = await getUserId()
    combos.value = await getUC<GetCombinationsUseCase>(TYPES.GetCombinationsUseCase).execute(userId)
  }

  async function save(combo: Combination) {
    const userId = await getUserId()
    await getUC<SaveCombinationUseCase>(TYPES.SaveCombinationUseCase).execute(userId, combo)
    await load()
  }

  async function remove(comboId: string) {
    const userId = await getUserId()
    await getUC<DeleteCombinationUseCase>(TYPES.DeleteCombinationUseCase).execute(userId, comboId)
    await load()
  }

  const getCombinationById = async (comboId: string): Promise<Combination | null> => {
    const userId = await getUserId()
    return await getUC<GetCombinationByIdUseCase>(TYPES.GetCombinationByIdUseCase).execute(userId, comboId)
    // return combos.value.find((item) => item.id == comboId)
  }

  return {
    combos,
    load,
    save,
    remove,
    removeDeletedCategories,
    getCombinationById
  }
})
