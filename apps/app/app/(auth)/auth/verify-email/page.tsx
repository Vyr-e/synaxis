import { getAuthMetadata } from '../../metadata-utils';
import VerifyEmailPage from './_view/client';

export const metadata = getAuthMetadata('verify');

export default function VerifyEmailPageWrapper() {
  return <VerifyEmailPage />;
}
