import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Category } from '@/domain/entities/Category'
import { GetCategoriesUseCase } from '@/application/useCases/category/GetCategoriesUseCase.ts'
import { CreateCategoryUseCase } from '@/application/useCases/category/CreateCategoryUseCase.ts'
import { UpdateCategoryUseCase } from '@/application/useCases/category/UpdateCategoryUseCase.ts'
import { DeleteCategoryUseCase } from '@/application/useCases/category/DeleteCategoryUseCase.ts'
import { useComboStore } from '@/presentation/stores/comboStore.ts'
import { useAuthStore } from '@/presentation/stores/authStore.ts'
import { getUserId } from '@/presentation/utils/getUserId'

export const useCategoryStore = defineStore('category', () => {
  const authStore = useAuthStore()
  const list = ref<Category[]>([])
  const comboStore = useComboStore()

  async function load() {
    const userId = await getUserId()
    list.value = await GetCategoriesUseCase.execute(userId)
  }

  async function add(name: string) {
    const userId = authStore.currentUser!.id
    const cat = await CreateCategoryUseCase.execute(userId, name)
    list.value.push(cat)
  }

  async function rename(category: Category) {
    const userId = authStore.currentUser!.id
    await UpdateCategoryUseCase.execute(userId, category)
    const idx = list.value.findIndex((c) => c.id === category.id)
    if (idx >= 0) list.value[idx] = category
  }

  async function remove(id: string) {
    const userId = authStore.currentUser!.id
    await DeleteCategoryUseCase.execute(userId, id)
    list.value = list.value.filter((c) => c.id !== id)
    await comboStore.removeDeletedCategories()
  }

  return {
    list,
    load,
    add,
    rename,
    remove
  }
})
