import { useToast } from '@/hooks/use-toast'
import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, ...props }) => {
        const variant = props.variant === 'error' ? 'destructive' : props.variant
        return (
          <Toast key={id} {...{ ...props, variant }}>
            {props.title && <ToastTitle>{props.title}</ToastTitle>}
            {props.description && (
              <ToastDescription>{props.description}</ToastDescription>
            )}
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
