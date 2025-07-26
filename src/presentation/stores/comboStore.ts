// src/presentation/stores/comboStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TYPES } from '@/infrastructure/di/types'
import type { Combination } from '@/domain/entities/Combination'
import { useAuthStore } from './authStore'
import { useCategoryStore } from '@/presentation/stores/categoryStore'
import { getUserId } from '@/presentation/utils/getUserId'
import { getUC } from '@/infrastructure/di/resolver'
import type { GetCombinationsUseCase } from '@/application/useCases/combination/GetCombinationsUseCase'
import type { CreateCombinationUseCase } from '@/application/useCases/combination/CreateCombinationUseCase'
import type { UpdateCombinationUseCase } from '@/application/useCases/combination/UpdateCombinationUseCase'
import type { DeleteCombinationUseCase } from '@/application/useCases/combination/DeleteCombinationUseCase'
import type { GetCombinationByIdUseCase } from '@/application/useCases/combination/GetCombinationByIdUseCase'
import { withLoading } from '@/presentation/utils/withLoading'

export const useComboStore = defineStore('combo', () => {
  const combos = ref<Combination[]>([])
  const authStore = useAuthStore()
  const categoryStore = useCategoryStore()

  const removeDeletedCategories = withLoading(async () => {
    const userId = authStore.currentUser!.id
    await categoryStore.load()

    for (const comboItem of combos.value) {
      const filtered = comboItem.categoryIds.filter((id) =>
        categoryStore.list.some((cat) => cat.id === id)
      )
      if (filtered.length !== comboItem.categoryIds.length) {
        comboItem.categoryIds = filtered
        const updateUC = getUC<UpdateCombinationUseCase>(TYPES.UpdateCombinationUseCase)
        await updateUC.execute(userId, comboItem)
      }
    }

    await load()
  })

  const load = withLoading(async () => {
    const userId = await getUserId()
    const getUCase = getUC<GetCombinationsUseCase>(TYPES.GetCombinationsUseCase)
    combos.value = await getUCase.execute(userId)
  })

  const save = withLoading(async (combo: Combination) => {
    const userId = await getUserId()
    const createUC = getUC<CreateCombinationUseCase>(TYPES.CreateCombinationUseCase)
    await createUC.execute(userId, combo)
    await load()
  })

  const update = withLoading(async (combo: Combination) => {
    const userId = await getUserId()
    const updateUC = getUC<UpdateCombinationUseCase>(TYPES.UpdateCombinationUseCase)
    await updateUC.execute(userId, combo)
    await load()
  })

  const remove = withLoading(async (comboId: string) => {
    const userId = await getUserId()
    const deleteUC = getUC<DeleteCombinationUseCase>(TYPES.DeleteCombinationUseCase)
    await deleteUC.execute(userId, comboId)
    await load()
  })

  const getCombinationById = withLoading(async (comboId: string): Promise<Combination | null> => {
    const userId = await getUserId()
    const getByIdUC = getUC<GetCombinationByIdUseCase>(TYPES.GetCombinationByIdUseCase)
    return await getByIdUC.execute(userId, comboId)
  })

  return {
    combos,
    load,
    save,
    update,
    remove,
    removeDeletedCategories,
    getCombinationById
  }
})
