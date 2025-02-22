import { drizzle, schema } from '@repo/database';
import type { User } from '@repo/database/types';
import { resend } from '@repo/email';
import {
  ChangeEmailTemplate,
  DeleteAccountTemplate,
  InviteTemplate,
  ResetPasswordTemplate,
  VerificationTemplate,
} from '@repo/email/templates';
import { env } from '@repo/env';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createAuthMiddleware } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';
import { admin, organization, username } from 'better-auth/plugins';

const auth = betterAuth({
  database: drizzleAdapter(drizzle, {
    provider: 'pg',
    schema: {
      ...schema,
      users: schema.users,
      accounts: schema.accounts,
      sessions: schema.sessions,
      verifications: schema.verifications,
      organization: schema.organizations,
      invitation: schema.invitations,
    },
    usePlural: true,
  }),

  socialProviders: {
    google: {
      clientId: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
      profile(profile: {
        sub: string;
        email: string;
        given_name: string;
        family_name: string;
        picture: string;
        username: string;
      }) {
        return {
          id: profile.sub,
          email: profile.email,
          firstName: profile.given_name,
          lastName: profile.family_name,
          image: profile.picture,
          username: profile.username || profile.email.split('@')[0],
        };
      },
    },
    facebook: {
      clientId: env.FACEBOOK_ID,
      clientSecret: env.FACEBOOK_SECRET,
      profile(profile: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        picture: { data: { url: string } };
        username: string;
      }) {
        return {
          id: profile.id,
          email: profile.email,
          firstName: profile.first_name,
          lastName: profile.last_name,
          image: profile.picture?.data?.url,
          username: profile.username || profile.email.split('@')[0],
        };
      },
    },
    twitter: {
      clientId: env.X_ID,
      clientSecret: env.X_SECRET,
      profile(profile: {
        id: string;
        email: string;
        name: string;
        profile_image_url: string;
        username: string;
      }) {
        const nameParts = profile.name?.split(' ') || ['', ''];
        return {
          id: profile.id,
          email: profile.email,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          image: profile.profile_image_url,
          username: profile.username || profile.email.split('@')[0],
        };
      },
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google', 'facebook', 'twitter', 'email'],
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.includes('/sign-up')) {
        const newSession = await ctx.context.newSession;
        if (newSession) {
          await ctx.redirect('/auth/verify-email');
        }
      }
    }),
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnChangeEmail: true,
    sendOnDeleteAccount: true,
    expiresIn: 15 * 60,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: env.RESEND_FROM,
        to: user.email,
        subject: 'Verify your email',
        react: (
          <VerificationTemplate
            name={user.name?.split(' ')[0] || 'there'}
            verificationLink={url}
          />
        ),
      });
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 15 * 60,
    autoSignIn: true,
    maxPasswordLength: 18,
    minPasswordLength: 8,

    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: env.RESEND_FROM,
        to: user.email,
        subject: 'Reset your password',
        react: <ResetPasswordTemplate resetLink={url} />,
      });
    },
  },
  user: {
    fields: {
      email: 'email',
      firstName: 'firstName',
      username: 'username',
      lastName: 'lastName',
      role: 'role',
      image: 'image',
      emailVerified: 'emailVerified',
      bio: 'bio',
      deletedAt: 'deletedAt',
      banReason: 'banReason',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    additionalFields: {
      username: {
        type: 'string',
        required: true,
      },
      firstName: {
        type: 'string',
        required: true,
      },
      lastName: {
        type: 'string',
        required: true,
      },
      role: {
        type: 'string',
        required: true,
        defaultValue: 'user',
        input: false,
      },
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ newEmail, url }) => {
        await resend.emails.send({
          from: env.RESEND_FROM,
          to: newEmail,
          subject: 'Verify email change',
          react: <ChangeEmailTemplate changeLink={url} />,
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
          react: (
            <DeleteAccountTemplate
              name={user.name?.split(' ')[0] || 'there'}
              deleteLink={url}
            />
          ),
        });
      },
    },
    organization: {
      //@ts-ignore
      sendInvitationEmail: async (data) => {
        const { id, email, organization, inviter } = data;
        // TODO: Make a catch all route that captures and verifies these details before verifying a user has access to the correct invite info!
        const inviteLink = `${env.NEXT_PUBLIC_APP_URL}/auth/invite?user_id=${id}&brand_id=${organization.id}&brand_slug=${organization.slug}&created_at=${new Date().toISOString()}`;

        await resend.emails.send({
          from: env.RESEND_FROM,
          to: email,
          subject: 'Invitation to join organization',
          react: (
            <InviteTemplate
              name={organization.name}
              inviter={inviter.user.name}
              inviteLink={inviteLink}
            />
          ),
        });
      },
    },
  },
  plugins: [
    nextCookies(),
    username(),
    admin({
      defaultRole: 'user',
      adminRole: ['admin', 'brand'],
      defaultBanReason: 'You are not authorized to access this resource',
      defaultBanExpiresIn: 30 * 60, //30 min default
    }),
    organization({
      creatorRole: 'brand',
      memberRole: ['user', 'brand', 'admin'],
      allowUserToCreateOrganization: async (user) => {
        const typedUser = (await user) as unknown as User;
        const isAllowed =
          typedUser.role === 'brand' || typedUser.role === 'admin';
        return isAllowed;
      },
      // biome-ignore lint/suspicious/useAwait: <explanation>
      allowUserToJoinOrganization: async () => {
        return true;
      },
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const nameParts = (await user.name?.split(' ')) || ['', ''];
          return {
            data: {
              ...user,
              firstName: nameParts[0] || '',
              lastName: nameParts.slice(1).join(' ') || '',
            },
          };
        },
      },
    },
  },
});
export { auth };
