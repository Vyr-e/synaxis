import { getAuthMetadata } from '../../metadata-utils';
import ForgotPasswordPage from './_view/client';

export const metadata = getAuthMetadata('forgot-password');

export default function ForgotPasswordPageWrapper() {
  return <ForgotPasswordPage />;
}
