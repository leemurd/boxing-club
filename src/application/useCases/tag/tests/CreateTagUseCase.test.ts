// src/application/useCases/tag/tests/CreateTagUseCase.test.ts
import { describe, it, expect, vi } from 'vitest'
import type { Tag } from '@/domain/entities/Tag'
import type { ITagRepository } from '@/domain/repositories/ITagRepository'
import { CreateTagUseCase } from '@/application/useCases/tag/CreateTagUseCase'

describe('CreateTagUseCase', () => {
  const fakeUserId = 'user-123'

  it('должен вызвать repo.create и вернуть новый тег', async () => {
    const mockRepo: ITagRepository = {
      getAll: vi.fn(),
      getById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      create: vi.fn().mockResolvedValue({
        id: 't1',
        name: 'Test Tag',
        isAutomatic: false
      })
    }

    const useCase = new CreateTagUseCase(mockRepo)

    const inputTag: Tag = {
      id: '',
      name: 'Test Tag'
    }
    const result = await useCase.execute(fakeUserId, inputTag)

    expect(mockRepo.create).toHaveBeenCalledOnce()
    expect(mockRepo.create).toHaveBeenCalledWith(fakeUserId, inputTag)

    expect(result).toEqual({
      id: 't1',
      name: 'Test Tag',
      isAutomatic: false
    })
  })

  it('должен пробросить ошибку, если repo.create отклоняется', async () => {
    const err = new Error('fail')
    const mockRepo: ITagRepository = {
      getAll: vi.fn(),
      getById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      create: vi.fn().mockRejectedValue(err)
    }

    const useCase = new CreateTagUseCase(mockRepo)

    await expect(
      useCase.execute(fakeUserId, {
        id: '',
        name: 'x'
      })
    ).rejects.toThrow('fail')
  })
})
