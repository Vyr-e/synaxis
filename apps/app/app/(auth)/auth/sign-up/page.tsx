import { getAuthMetadata } from '../../metadata-utils';
import SignUpPage from './_view/client';

export const metadata = getAuthMetadata('sign-up');

export default function SignUpPageWrapper() {
  return <SignUpPage />;
}
