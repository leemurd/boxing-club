export interface DropdownItem {
  label: string
  value: any
  onClick?: () => void
  // disabled?: boolean
}

export const comboRandomItems: DropdownItem[] = [
  {
    label: `3 moves`,
    value: 3
  },
  {
    label: '4 moves',
    value: 4
  },
  {
    label: `5 moves`,
    value: 5
  },
  {
    label: `6 moves`,
    value: 6
  },
  {
    label: `7 moves`,
    value: 7
  },
  {
    label: '8 moves',
    value: 8
  }
]
