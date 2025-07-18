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

// time, date
export enum TimeRange {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  ALL = 'all'
}

export interface IAlertButton {
  text: string
  role?: 'cancel' | 'destructive' | 'confirm' | string
  cssClass?: string | string[]
  id?: string
  htmlAttributes?: { [key: string]: any }
  handler?: (value: any) => any
}
