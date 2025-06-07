// buttons
export type ButtonColor = 'primary' | 'secondary' | 'blue' | 'green' | 'dark' | 'red' | 'light' | 'warning' | 'info' | 'link'
export type ButtonSize = 'small' | 'medium' | 'large'
export const BtnSizeMap: Record<ButtonSize, string> = {
  small: 'sm',
  medium: '',
  large: 'lg'
}

// time, date
export enum TimeRange {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  ALL = 'all'
}
