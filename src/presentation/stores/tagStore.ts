// src/presentation/stores/tagStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserId } from '@/presentation/utils/getUserId'
import { getUC } from '@/infrastructure/di/resolver'
import { TYPES } from '@/infrastructure/di/types'
import type { Tag } from '@/domain/entities/Tag'
import { DEFAULT_TAGS } from '@/domain/constants/defaultTags'
import type { GetTagsUseCase } from '@/application/useCases/tag/GetTagsUseCase.ts'
import type { CreateTagUseCase } from '@/application/useCases/tag/CreateTagUseCase.ts'
import type { GetTagByIdUseCase } from '@/application/useCases/tag/GetTagByIdUseCase.ts'
import type { UpdateTagUseCase } from '@/application/useCases/tag/UpdateTagUseCase.ts'
import type { DeleteTagUseCase } from '@/application/useCases/tag/DeleteTagUseCase.ts'

export const useTagStore = defineStore('tag', () => {
  const list = ref<Tag[]>([])

  async function load() {
    const userId = await getUserId()

    // init defaults to db
    const existing: Tag[] = await getUC<GetTagsUseCase>(TYPES.GetTagsUseCase).execute(userId)

    for (const def of DEFAULT_TAGS) {
      if (!existing.some((t) => t.id === def.id)) {
        await getUC<CreateTagUseCase>(TYPES.CreateTagUseCase).execute(userId, def)
      }
    }

    // load all from db
    list.value = await getUC<GetTagsUseCase>(TYPES.GetTagsUseCase).execute(userId)
  }

  async function getById(id: string): Promise<Tag | null> {
    const userId = await getUserId()
    return getUC<GetTagByIdUseCase>(TYPES.GetTagByIdUseCase).execute(userId, id)
  }

  async function add(name: string) {
    const userId = await getUserId()
    const tag = await getUC<CreateTagUseCase>(TYPES.CreateTagUseCase).execute(userId, {
      id: '',
      name
    })
    list.value.push(tag)
  }

  async function rename(tag: Tag) {
    const userId = await getUserId()
    await getUC<UpdateTagUseCase>(TYPES.UpdateTagUseCase).execute(userId, tag)
    const i = list.value.findIndex((t) => t.id === tag.id)
    if (i !== -1) list.value[i] = tag
  }

  async function remove(id: string) {
    const userId = await getUserId()
    await getUC<DeleteTagUseCase>(TYPES.DeleteTagUseCase).execute(userId, id)
    list.value = list.value.filter((t) => t.id !== id)
  }

  return {
    list,
    load,
    getById,
    add,
    rename,
    remove
  }
})
