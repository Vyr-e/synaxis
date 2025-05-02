import { drizzle, schema } from '@repo/database';
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
import { nextCookies } from 'better-auth/next-js';
import {
  admin,
  customSession,
  jwt,
  organization,
  username,
} from 'better-auth/plugins';
import { getUserProfileById } from './user';

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

  advanced: {
    cookiePrefix: 'synaxis',
    cookies: {
      session_token: {
        name: 'synaxis_session_token',
        attributes: {
          httpOnly: true,
          secure: env.NODE_ENV === 'production',
        },
      },
    },
    defaultCookieAttributes: {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
    },
    useSecureCookies: env.NODE_ENV === 'production',

    database: {
      generateId: false,
    },
  },

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

  emailVerification: {
    sendOnSignUp: true,
    sendOnChangeEmail: true,
    sendOnDeleteAccount: true,
    autoSignInAfterVerification: true,
    expiresIn: 15 * 60,
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: env.RESEND_FROM,
        to: [user.email],
        subject: 'Verify your email',
        react: (
          <>
            {VerificationTemplate({
              name:
                (user as unknown as { firstName: string }).firstName || 'there',
              verificationLink: url,
            })}
          </>
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
        react: <>{ResetPasswordTemplate({ resetLink: url })}</>,
      });
    },
  },
  user: {
    fields: {
      email: 'email',
      firstName: 'firstName',
      username: 'username',
      displayUsername: 'display_username',
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
          react: <>{ChangeEmailTemplate({ changeLink: url })}</>,
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
              name={
                (user as unknown as { firstName: string }).firstName || 'there'
              }
              deleteLink={url}
            />
          ),
        });
      },
    },
    organization: {
      //@ts-ignore
      sendInvitationEmail: async (data: {
        id: string;
        email: string;
        organization: { id: string; name: string; slug: string };
        inviter: { user: { firstName: string } };
      }) => {
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
              inviter={inviter.user.firstName}
              inviteLink={inviteLink}
            />
          ),
        });
      },
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const userProfile = await getUserProfileById(user.id);

      if (!userProfile) {
        return {
          user,
          session,
        };
      }

      return {
        user: {
          id: userProfile.id,
          banned: userProfile.banned,
          bannedReason: userProfile.banReason,
          banExpires: userProfile.banExpires,
          email: userProfile.email,
          name: `${userProfile.firstName} ${userProfile.lastName}`,
          username: userProfile.username,
          role: userProfile.role,
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          image: userProfile.image,
          emailVerified: userProfile.emailVerified,
          createdAt: userProfile.createdAt,
          updatedAt: userProfile.updatedAt,
        },
        session,
      };
    }),
    jwt({
      jwt: {
        audience: env.NEXT_PUBLIC_APP_URL,
        issuer: env.NEXT_PUBLIC_APP_URL,
        expirationTime: '1h',
        definePayload: ({ user }) => {
          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            image: user.image,
            username: user.username,
            emailVerified: user.emailVerified,
          };
        },
      },
    }),
    nextCookies(),
    username(),
    admin({
      defaultRole: 'user',
      adminRole: ['admin', 'brand'],
      defaultBanReason: 'You are not authorized to access this resource',
      defaultBanExpiresIn: 30 * 60,
    }),
    organization({
      creatorRole: 'brand',
      memberRole: ['user', 'brand', 'admin'],
      allowUserToCreateOrganization: async (user: { id: string }) => {
        const userProfile = await getUserProfileById(user.id);
        if (!userProfile) {
          return false;
        }
        const isAllowed =
          userProfile.role === 'brand' || userProfile.role === 'admin';
        return isAllowed;
      },
      allowUserToJoinOrganization: async (user: { id: string }) => {
        const userProfile = await getUserProfileById(user.id);
        if (!userProfile) {
          return false;
        }
        const isAllowed = !!userProfile.role;
        return isAllowed;
      },
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        // biome-ignore lint/suspicious/useAwait: we only need it to be async
        before: async (user, _ctx) => {
          return {
            data: {
              ...user,
              firstName: user.name.split(' ')[0],
              lastName: user.name.split(' ')[1],
            },
          };
        },
      },
    },
  },
});
export { auth };
