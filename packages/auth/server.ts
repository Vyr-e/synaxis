import { drizzle, schema } from '@repo/database';
import { resend } from '@repo/email';
import { env } from '@repo/env';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { magicLink } from 'better-auth/plugins';

const auth = betterAuth({
  database: drizzleAdapter(drizzle, {
    provider: 'pg',
    schema: {
      ...schema,
      users: schema.users,
      accounts: schema.accounts,
      sessions: schema.sessions,
      verifications: schema.verifications,
    },
    usePlural: true,
  }),
  socialProviders: {
    google: {
      clientId: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ newEmail, url }) => {
        await resend.emails.send({
          from: env.RESEND_FROM,
          to: newEmail,
          subject: 'Verify email change',
          text: `Click here to verify your email change: ${url}`,
        });
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await resend.emails.send({
          from: env.RESEND_FROM,
          to: user.email,
          subject: 'Verify account deletion',
          text: `Click here to confirm account deletion: ${url}`,
        });
      },
    },
  },
  plugins: [
    nextCookies(),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await resend.emails.send({
          from: env.RESEND_FROM,
          to: email,
          subject: 'Your login link',
          text: `Click here to login: ${url}`,
        });
      },
    }),
  ],
});

export { auth };
