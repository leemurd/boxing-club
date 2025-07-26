import { alertController } from '@ionic/vue'

type AlertButtonOverlayHandler = boolean | void | { [key: string]: any }

interface AlertButton {
  text: string
  role?: 'cancel' | 'destructive' | string
  handler?: (value: any) => AlertButtonOverlayHandler | Promise<AlertButtonOverlayHandler>
}

interface AlertOptions {
  header?: string
  subHeader?: string
  message?: string
  buttons?: (AlertButton | string)[]
  backdropDismiss?: boolean
}

type AlertHeaders = Pick<AlertOptions, 'header' | 'subHeader'>

export const useAlerts = async (btn: AlertButton[] | AlertButton, headers: AlertHeaders) => {
  return await alertController.create({
    ...headers,
    buttons: [...(Array.isArray(btn) ? btn : [btn])],
    backdropDismiss: true
  })
}

export const useDeleteAlerts = async (
  id: string,
  callback: (_id: string) => Promise<void>,
  headers: AlertHeaders = { header: 'Confirm Delete?' }
) => {
  if (!id) return

  const alert = await useAlerts(
    [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Alert canceled')
        }
      },
      {
        text: 'Delete',
        role: 'confirm',
        handler: async () => {
          await callback(id)
        }
      }
    ],
    headers
  )

  return await alert.present()
}

export const useConfirmAlerts = async (
  callback: () => Promise<void>,
  headers: AlertHeaders = { header: 'Confirm?' }
) => {
  const alert = await useAlerts(
    [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Alert canceled')
        }
      },
      {
        text: 'Confirm',
        role: 'confirm',
        handler: async () => {
          await callback()
        }
      }
    ],
    headers
  )

  return await alert.present()
}
