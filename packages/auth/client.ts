import {
  inferAdditionalFields,
  usernameClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import type { auth } from './server';

const authClient = createAuthClient({
  plugins: [usernameClient(), inferAdditionalFields<typeof auth>()],
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
  changeEmail,
  unlinkAccount,
  changePassword,
  deleteUser,
  linkSocial,
  verifyEmail,
  resetPassword,
  forgetPassword,
  updateUser,
  revokeSession,
  sendVerificationEmail,
  revokeOtherSessions,
  revokeSessions,
  listAccounts,
  listSessions,
} = authClient;
