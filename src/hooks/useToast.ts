import { useToastStore, ToastVariant } from '../store/toastStore';

export function useToast() {
  const show = useToastStore((s) => s.show);
  const dismiss = useToastStore((s) => s.dismiss);

  return {
    show,
    dismiss,
    success: (title: string, description?: string) =>
      show({ title, description, variant: 'success' as ToastVariant }),
    error: (title: string, description?: string) =>
      show({ title, description, variant: 'error' as ToastVariant, durationMs: 5000 }),
    info: (title: string, description?: string) =>
      show({ title, description, variant: 'info' as ToastVariant }),
  };
}


