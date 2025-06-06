import { getAuthMetadata } from '../../metadata-utils';
import VerifiedPage from './_view/client';

export const metadata = getAuthMetadata('verified');

export default function VerifiedPageWrapper() {
  return <VerifiedPage />;
}
