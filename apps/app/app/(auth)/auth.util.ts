import { toast } from '@repo/design-system/components/ui/use-toast';
import { captureException } from '@sentry';
import type { UseFormReturn } from 'react-hook-form';

export const handleBackendError = (
  ctx: 'sign-up' | 'sign-in',
  form: UseFormReturn<{ email: string }>,
  error: Error & { status?: number }
) => {
  switch (error.status) {
    case 429:
      toast({
        variant: 'destructive',
        title: 'Rate Limited',
        description:
          error.message || 'Too many attempts. Please try again later.',
      });
      break;

    case 400:
      form.setError('email', {
        message: error.message,
      });
      break;

    case 403:
      toast({
        variant: 'destructive',
        title: 'Not Authorized',
        description:
          error.message || 'You are not authorized to perform this action.',
      });
      break;

    default: {
      captureException(error, {
        context: ctx === 'sign-up' ? 'sign-up-form' : 'sign-in-form',
        email: form.getValues('email'),
      });
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong. Please try again.',
      });
    }
  }
};
