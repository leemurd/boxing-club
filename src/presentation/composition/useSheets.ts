import { actionSheetController } from '@ionic/vue'

export interface ActionSheetButton<T = any> {
  text?: string
  role?: 'cancel' | 'destructive' | 'selected' | string
  icon?: string
  cssClass?: string | string[]
  id?: string
  htmlAttributes?: { [key: string]: any }
  handler?: () => boolean | void | Promise<boolean | void>
  data?: T
}

interface ActionSheetOptions {
  header?: string
  subHeader?: string
  cssClass?: string | string[]
  buttons: (ActionSheetButton | string)[]
  backdropDismiss?: boolean
  translucent?: boolean
  animated?: boolean
  keyboardClose?: boolean
  id?: string
  htmlAttributes?: { [key: string]: any }
  present: () => Promise<void>
}

type ActionSheetHeaders = Pick<ActionSheetOptions, 'header' | 'subHeader'>

export const useSheets = async (
  btns: ActionSheetButton[] | ActionSheetButton,
  headers?: ActionSheetHeaders
): Promise<ActionSheetOptions> => {
  return await actionSheetController.create({
    ...headers,
    buttons: [
      ...(Array.isArray(btns) ? btns : [btns]),
      {
        text: 'Cancel',
        role: 'cancel',
        data: {
          action: 'cancel'
        }
      }
    ]
  })
}

export const useDeleteSheets = async (
  id: string,
  callback: (_id: string) => Promise<void>,
  headers: ActionSheetHeaders = { header: 'Confirm Delete?' }
) => {
  if (!id) return

  const sheet = await useSheets(
    {
      text: 'Delete',
      role: 'destructive',
      data: {
        action: 'delete'
      },
      async handler() {
        await callback(id)
      }
    },
    headers
  )
  return await sheet.present()
}
