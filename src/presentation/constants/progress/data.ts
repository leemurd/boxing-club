import { TimeRange } from '@/presentation/components/shared/types.ts'
import { ExerciseCategory } from '@/domain/entities/Exercise.ts'
import { DEFAULT_TAG_IDS } from '@/domain/constants/defaultTags.ts'

export const dateRangeItems = [
  {
    label: 'Day',
    value: TimeRange.DAY
  },
  {
    label: 'Week',
    value: TimeRange.WEEK
  },
  {
    label: 'Month',
    value: TimeRange.MONTH
  },
  {
    label: 'All',
    value: TimeRange.ALL
  }
]

export const categoryTagMap = {
  [ExerciseCategory.PHYSICS]: DEFAULT_TAG_IDS.PHYSICS,
  [ExerciseCategory.TECHNIQUE]: DEFAULT_TAG_IDS.TECHNIQUE,
  [ExerciseCategory.PRACTICE]: DEFAULT_TAG_IDS.PRACTICE
}
