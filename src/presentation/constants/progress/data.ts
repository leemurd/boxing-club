import { TimeRange } from '@/presentation/components/shared/types.ts'

export const dateRangeItems = [
  {
    label: 'Today',
    value: TimeRange.TODAY
  },
  {
    label: 'Last 7 days',
    value: TimeRange.WEEK
  },
  {
    label: 'last 30 days',
    value: TimeRange.MONTH
  },
  {
    label: 'All time',
    value: TimeRange.ALL
  }
]
