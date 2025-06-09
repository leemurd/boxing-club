// src/application/services/progressCalculators.ts
import type { TrainingRecord } from '@/domain/entities/TrainingRecord'
import type { ExerciseCategory } from '@/domain/entities/Exercise'
import type { ProgressEntity } from '@/presentation/constants/progress/types'
import { getShortDate } from '@/presentation/utils/dateTime.ts'
import { TimeRange } from '@/presentation/components/shared/types.ts'

type Acc = { reps: number; minutes: number; sets: number }

export function calcDailyTotals(recs: TrainingRecord[]): ProgressEntity<string>[] {
  const map: Record<string, Acc> = {}
  recs.forEach((r) => {
    const day = getShortDate(new Date(r.timestamp))
    if (!map[day])
      map[day] = {
        reps: 0,
        minutes: 0,
        sets: 0
      }
    if (r.measurement === 'repetitions') map[day].reps += r.amount
    else map[day].minutes += r.amount / 60
    map[day].sets += 1
  })
  return Object.entries(map).map(([name, acc]) => ({
    name,
    reps: acc.reps,
    minutes: acc.minutes,
    sets: acc.sets
  }))
}

export function calcByCategory(recs: TrainingRecord[]): ProgressEntity<ExerciseCategory>[] {
  const map: Record<ExerciseCategory, Acc> = {} as any
  recs.forEach((r) => {
    if (!map[r.category])
      map[r.category] = {
        reps: 0,
        minutes: 0,
        sets: 0
      }
    if (r.measurement === 'repetitions') map[r.category].reps += r.amount
    else map[r.category].minutes += r.amount / 60
    map[r.category].sets += 1
  })
  return Object.entries(map).map(([name, acc]) => ({
    name: name as ExerciseCategory,
    reps: acc.reps,
    minutes: acc.minutes,
    sets: acc.sets
  }))
}

export function calcByTag(recs: TrainingRecord[]): ProgressEntity<string>[] {
  const map: Record<string, Acc> = {}
  recs.forEach((r) => {
    r.tagIds.forEach((t) => {
      if (!map[t])
        map[t] = {
          reps: 0,
          minutes: 0,
          sets: 0
        }
      if (r.measurement === 'repetitions') map[t].reps += r.amount
      else map[t].minutes += r.amount / 60
      map[t].sets += 1
    })
  })
  return Object.entries(map).map(([name, acc]) => ({
    name,
    reps: acc.reps,
    minutes: acc.minutes,
    sets: acc.sets
  }))
}

export function calcByExercise(recs: TrainingRecord[]): ProgressEntity<string>[] {
  const map: Record<string, Acc> = {}
  recs.forEach((r) => {
    const key = r.exerciseId
    if (!map[key])
      map[key] = {
        reps: 0,
        minutes: 0,
        sets: 0
      }
    if (r.measurement === 'repetitions') map[key].reps += r.amount
    else map[key].minutes += r.amount / 60
    map[key].sets += 1
  })
  return Object.entries(map).map(([name, acc]) => ({
    name,
    reps: acc.reps,
    minutes: acc.minutes,
    sets: acc.sets
  }))
}

export function calcByCombo(recs: TrainingRecord[]): ProgressEntity<string>[] {
  const map: Record<string, Acc> = {}
  recs.forEach((r) => {
    if (!r.comboId) return
    const key = r.comboId
    if (!map[key])
      map[key] = {
        reps: 0,
        minutes: 0,
        sets: 0
      }
    if (r.measurement === 'repetitions') map[key].reps += r.amount
    else map[key].minutes += r.amount / 60
    map[key].sets += 1
  })
  return Object.entries(map).map(([name, acc]) => ({
    name,
    reps: acc.reps,
    minutes: acc.minutes,
    sets: acc.sets
  }))
}

export function computeDateRange(periodType: TimeRange, cursor: Date) {
  const to = new Date(cursor)
  let from: Date

  switch (periodType) {
    case TimeRange.DAY:
      from = new Date(to)
      from.setHours(0, 0, 0, 0)
      to.setHours(23, 59, 59, 999)
      break
    case TimeRange.WEEK:
      from = new Date(to)
      from.setDate(to.getDate() - 6)
      from.setHours(0, 0, 0, 0)
      to.setHours(23, 59, 59, 999)
      break
    case TimeRange.MONTH:
      from = new Date(to)
      from.setDate(to.getDate() - 29)
      from.setHours(0, 0, 0, 0)
      to.setHours(23, 59, 59, 999)
      break
    case TimeRange.ALL:
    default:
      from = new Date(0)
      to.setHours(23, 59, 59, 999)
  }

  return {
    from,
    to
  }
}
