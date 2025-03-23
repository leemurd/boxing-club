export type ButtonColor = 'primary' | 'secondary' | 'blue' | 'green' | 'dark' | 'red' | 'light'
export type ButtonSize = 'small' | 'medium' | 'large'
export const BtnSizeMap: Record<ButtonSize, string> = {
  small: 'sm',
  medium: '',
  large: 'lg'
}

export enum TimeRange {
  TODAY = 'today',
  WEEK = 'week',
  MONTH = 'month',
  ALL = 'all'
}
