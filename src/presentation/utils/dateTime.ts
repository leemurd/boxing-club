export function getShortDate(d: Date): string {
  return d.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short'
  })
}

export const getShortDateWithTime = (d: Date) =>
  d.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h12'
  })
