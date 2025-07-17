// src/domain/entities/ComboCategory.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { type ComboCategory } from '@/domain/entities/ComboCategory'

describe.each([
  {
    id: 'categoryId',
    name: 'categoryName'
  }
])('ComboCategory entity', ({ id, name }) => {
  let cat: ComboCategory

  beforeEach(() => {
    cat = {
      id,
      name
    }
  })

  it(`initializes with the provided id: [${id}] and name: [${name}]`, () => {
    expect(cat.id).toBe(id)
    expect(cat.name).toBe(name)
  })

  it('fields are strings', () => {
    expect(typeof cat.id).toBe('string')
    expect(typeof cat.name).toBe('string')
  })
})
