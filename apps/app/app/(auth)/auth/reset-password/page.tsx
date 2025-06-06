import { getAuthMetadata } from '../../metadata-utils';
import ResetPasswordPage from './_view/client';

export const metadata = getAuthMetadata('reset-password');

export default function ResetPasswordPageWrapper() {
  return <ResetPasswordPage />;
}
