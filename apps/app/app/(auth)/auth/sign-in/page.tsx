import { getAuthMetadata } from '../../metadata-utils';
import SignInPage from './_view/client';

export const metadata = getAuthMetadata('sign-in');

export default function SignInPageWrapper() {
  return <SignInPage />;
}
