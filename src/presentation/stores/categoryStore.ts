// src/presentation/stores/categoryStore.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { TYPES } from '@/infrastructure/di/types'
import type { Category } from '@/domain/entities/Category'
import { useComboStore } from '@/presentation/stores/comboStore'
import { getUserId } from '@/presentation/utils/getUserId'

import type { GetCategoriesUseCase } from '@/application/useCases/category/GetCategoriesUseCase'
import type { CreateCategoryUseCase } from '@/application/useCases/category/CreateCategoryUseCase'
import type { UpdateCategoryUseCase } from '@/application/useCases/category/UpdateCategoryUseCase'
import type { DeleteCategoryUseCase } from '@/application/useCases/category/DeleteCategoryUseCase'
import type { GetCategoryByIdUseCase } from '@/application/useCases/category/GetCategoryByIdUseCase.ts'
import { useToast } from 'vue-toastification'
import { getUC } from '@/infrastructure/di/resolver.ts'
import type { Combination } from '@/domain/entities/Combination.ts'

const toast = useToast()

export const useCategoryStore = defineStore('category', () => {
  const list = ref<Category[]>([])
  const comboStore = useComboStore()

  // Получаем экземпляры use-case’ов из DI-контейнера
  const getCategoriesUC = getUC<GetCategoriesUseCase>(TYPES.GetCategoriesUseCase)
  const createCategoryUC = getUC<CreateCategoryUseCase>(TYPES.CreateCategoryUseCase)
  const updateCategoryUC = getUC<UpdateCategoryUseCase>(TYPES.UpdateCategoryUseCase)
  const deleteCategoryUC = getUC<DeleteCategoryUseCase>(TYPES.DeleteCategoryUseCase)
  const getCategoryByIdUC = getUC<GetCategoryByIdUseCase>(TYPES.GetCategoryByIdUseCase)

  /** Загружает все категории текущего пользователя */
  async function load() {
    const userId = await getUserId()
    list.value = await getCategoriesUC.execute(userId)
  }

  /** Создаёт новую категорию и добавляет её в список */
  async function add(name: string) {
    const userId = await getUserId()
    const cat = await createCategoryUC.execute(userId, name)
    list.value.push(cat)
    toast.info('Category has been created')
  }

  /** Переименовывает категорию */
  async function update(category: Category) {
    const userId = await getUserId()
    await updateCategoryUC.execute(userId, category)
    const idx = list.value.findIndex((c) => c.id === category.id)
    if (idx >= 0) list.value[idx] = category
    else return
    toast.info('Category updated')
  }

  /** Удаляет категорию, очищает её у комбо и из списка */
  async function remove(id: string) {
    const userId = await getUserId()
    await deleteCategoryUC.execute(userId, id)
    list.value = list.value.filter((c) => c.id !== id)
    // Обновляем комбо, убирая удалённый id из их categoryIds
    if (comboStore.removeDeletedCategories) {
      await comboStore.removeDeletedCategories()
    }
    toast.info('Category has been removed')
  }

  async function getById(categoryId: string) {
    const userId = await getUserId()
    const res = await getCategoryByIdUC.execute(userId, categoryId)
    return res
  }

  const getCombosByCategoryId = (categoryId: string): Combination[] => {
    return comboStore.combos.filter((c) => c.categoryIds.includes(categoryId))
  }

  return {
    list,
    load,
    add,
    update,
    remove,
    getById,
    getCombosByCategoryId
  }
})
