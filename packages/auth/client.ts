import { usernameClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

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
} = createAuthClient({
  plugins: [usernameClient()],
});
