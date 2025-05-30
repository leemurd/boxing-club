import { TimeRange } from '@/presentation/components/shared/types.ts'

export const dateRangeItems = [
  {
    label: 'Day',
    value: TimeRange.TODAY
  },
  {
    label: '7 days',
    value: TimeRange.WEEK
  },
  {
    label: '30 days',
    value: TimeRange.MONTH
  },
  {
    label: 'All time',
    value: TimeRange.ALL
  }
]
