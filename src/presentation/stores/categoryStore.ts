// src/presentation/stores/categoryStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TYPES } from '@/infrastructure/di/types'
import type { ComboCategory } from '@/domain/entities/ComboCategory.ts'
import { useComboStore } from '@/presentation/stores/comboStore'
import { getUserId } from '@/presentation/utils/getUserId'

import type { GetCategoriesUseCase } from '@/application/useCases/category/GetCategoriesUseCase'
import type { CreateCategoryUseCase } from '@/application/useCases/category/CreateCategoryUseCase'
import type { UpdateCategoryUseCase } from '@/application/useCases/category/UpdateCategoryUseCase'
import type { DeleteCategoryUseCase } from '@/application/useCases/category/DeleteCategoryUseCase'
import type { GetCategoryByIdUseCase } from '@/application/useCases/category/GetCategoryByIdUseCase'
import { useToast } from 'vue-toastification'
import { getUC } from '@/infrastructure/di/resolver.ts'
import type { Combination } from '@/domain/entities/Combination.ts'
import { DEFAULT_CATEGORIES } from '@/domain/constants/defaultCategories.ts'

const toast = useToast()

export const useCategoryStore = defineStore('category', () => {
  const list = ref<ComboCategory[]>([])
  const comboStore = useComboStore()

  const getCategoriesUC = getUC<GetCategoriesUseCase>(TYPES.GetCategoriesUseCase)
  const createCategoryUC = getUC<CreateCategoryUseCase>(TYPES.CreateCategoryUseCase)
  const updateCategoryUC = getUC<UpdateCategoryUseCase>(TYPES.UpdateCategoryUseCase)
  const deleteCategoryUC = getUC<DeleteCategoryUseCase>(TYPES.DeleteCategoryUseCase)
  const getCategoryByIdUC = getUC<GetCategoryByIdUseCase>(TYPES.GetCategoryByIdUseCase)

  async function load() {
    const userId = await getUserId()

    // init defaults to db
    const existing: ComboCategory[] = await getCategoriesUC.execute(userId)
    for (const def of DEFAULT_CATEGORIES) {
      if (!existing.some((t) => t.id === def.id)) {
        await createCategoryUC.execute(userId, def)
      }
    }

    list.value = await getCategoriesUC.execute(userId)
  }

  async function create(category: ComboCategory) {
    const userId = await getUserId()
    const cat = await createCategoryUC.execute(userId, category)
    list.value.push(cat)
    toast.info('Category has been created')
  }

  async function update(category: ComboCategory) {
    const userId = await getUserId()
    await updateCategoryUC.execute(userId, category)
    const idx = list.value.findIndex((c) => c.id === category.id)
    if (idx >= 0) list.value[idx] = category
    else return
    toast.info('Category updated')
  }

  async function remove(id: string) {
    const userId = await getUserId()
    await deleteCategoryUC.execute(userId, id)
    list.value = list.value.filter((c) => c.id !== id)
    if (comboStore.removeDeletedCategories) {
      await comboStore.removeDeletedCategories()
    }
    toast.info('Category has been removed')
  }

  async function getById(categoryId: string) {
    const userId = await getUserId()
    return await getCategoryByIdUC.execute(userId, categoryId)
  }

  const getCombosByCategoryId = (categoryId: string): Combination[] => {
    return comboStore.combos.filter((c) => c.categoryIds.includes(categoryId))
  }

  return {
    list,
    load,
    create,
    update,
    remove,
    getById,
    getCombosByCategoryId
  }
})
