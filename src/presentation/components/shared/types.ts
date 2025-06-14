// buttons
// Типы поддерживаемых цветов и размеров Ionic
export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'light'
  | 'medium'
  | 'dark'
  | 'tertiary'
  | 'warning'
  | 'info'
export type ButtonSize = 'small' | 'default' | 'large'
// export type ButtonLocalSize = 'small' | 'medium' | 'large'

// export const BtnSizeMap: Record<string, ButtonSize> = {
//   small: 'small',
//   medium: 'default',
//   large: 'large'
// }

// export const BtnLocalSizeMap: Record<ButtonLocalSize, ButtonSize> = {
//   small: 'small',
//   medium: 'default',
//   large: 'large'
// }

// time, date
export enum TimeRange {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  ALL = 'all'
}
