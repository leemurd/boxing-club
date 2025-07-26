// src/presentation/stores/tagStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserId } from '@/presentation/utils/getUserId'
import { getUC } from '@/infrastructure/di/resolver'
import { TYPES } from '@/infrastructure/di/types'
import type { Tag } from '@/domain/entities/Tag'
import { DEFAULT_TAGS } from '@/domain/constants/defaultTags'
import type { GetTagsUseCase } from '@/application/useCases/tag/GetTagsUseCase'
import type { CreateTagUseCase } from '@/application/useCases/tag/CreateTagUseCase'
import type { GetTagByIdUseCase } from '@/application/useCases/tag/GetTagByIdUseCase'
import type { UpdateTagUseCase } from '@/application/useCases/tag/UpdateTagUseCase'
import type { DeleteTagUseCase } from '@/application/useCases/tag/DeleteTagUseCase'
import { withLoading } from '@/presentation/utils/withLoading'

export const useTagStore = defineStore('tag', () => {
  const list = ref<Tag[]>([])

  const load = withLoading(async () => {
    const userId = await getUserId()
    if (!userId) return

    const getTagsUC = getUC<GetTagsUseCase>(TYPES.GetTagsUseCase)
    const existing = await getTagsUC.execute(userId)

    for (const def of DEFAULT_TAGS) {
      if (!existing.some((t) => t.id === def.id)) {
        const createUC = getUC<CreateTagUseCase>(TYPES.CreateTagUseCase)
        await createUC.execute(userId, def)
      }
    }

    list.value = await getTagsUC.execute(userId)
  })

  const getById = withLoading(async (id: string): Promise<Tag | null> => {
    const userId = await getUserId()
    if (!userId) return null
    const uc = getUC<GetTagByIdUseCase>(TYPES.GetTagByIdUseCase)
    return await uc.execute(userId, id)
  })

  const add = withLoading(async (name: string) => {
    const userId = await getUserId()
    if (!userId) return
    const createUC = getUC<CreateTagUseCase>(TYPES.CreateTagUseCase)
    const tag = await createUC.execute(userId, {
      id: '',
      name
    })
    list.value.push(tag)
  })

  const rename = withLoading(async (tag: Tag) => {
    const userId = await getUserId()
    if (!userId) return
    const updateUC = getUC<UpdateTagUseCase>(TYPES.UpdateTagUseCase)
    await updateUC.execute(userId, tag)
    const idx = list.value.findIndex((t) => t.id === tag.id)
    if (idx !== -1) list.value[idx] = tag
  })

  const remove = withLoading(async (id: string) => {
    const userId = await getUserId()
    if (!userId) return
    const deleteUC = getUC<DeleteTagUseCase>(TYPES.DeleteTagUseCase)
    await deleteUC.execute(userId, id)
    list.value = list.value.filter((t) => t.id !== id)
  })

  return {
    list,
    load,
    getById,
    add,
    rename,
    remove
  }
})
