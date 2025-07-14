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
import { type BetterAuthOptions, betterAuth } from 'better-auth';
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

const regex = /^[a-zA-Z0-9_.#]{3,30}$/;

const authConfig: BetterAuthOptions = {
  database: drizzleAdapter(drizzle, {
    provider: 'pg',
    schema: {
      ...schema,
      users: schema.users,
      accounts: schema.accounts,
      sessions: schema.sessions,
      verifications: schema.verifications,
      organization: schema.brands,
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
      mapProfileToUser(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          firstName: profile.given_name,
          lastName: profile.family_name,
          image: profile.picture,
          username: profile.email.split('@')[0],
          emailVerified: profile.email_verified,
        };
      },
    },
    facebook: {
      clientId: env.FACEBOOK_ID,
      clientSecret: env.FACEBOOK_SECRET,
      mapProfileToUser(profile) {
        const [firstName, ...lastName] = profile.name.split(' ');
        return {
          id: profile.id,
          email: profile.email,
          firstName,
          lastName: lastName.join(' '),
          image: profile.picture?.data?.url,
          username: profile.email.split('@')[0],
          emailVerified: profile.email_verified,
        };
      },
    },
    twitter: {
      clientId: env.X_ID,
      clientSecret: env.X_SECRET,
      mapProfileToUser: (profile) => {
        const nameParts = profile.data.name?.split(' ') || ['', ''];
        return {
          id: profile.data.id,
          email: profile.data.email,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          image: profile.data.profile_image_url,
          username: profile.data.username || profile.data.email?.split('@')[0],
          emailVerified: !!profile.data.email,
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
    autoSignInAfterVerification: true,
    expiresIn: 15 * 60,
    sendVerificationEmail: async ({ user, url }) => {
      try {
        await resend.emails.send({
          from: env.RESEND_FROM,
          to: [user.email],
          subject: 'Verify your email',
          react: (
            <>
              {VerificationTemplate({
                name:
                  (user as unknown as { firstName: string }).firstName ||
                  'there',
                verificationLink: url,
              })}
            </>
          ),
        });
      } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
      }
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 15 * 60,
    autoSignIn: true,
    maxPasswordLength: 18,
    minPasswordLength: 8,
    revokeSessionsOnPasswordReset: true,

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
      name: 'name',
      image: 'image',
      emailVerified: 'emailVerified',
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
        required: false,
        defaultValue: '',
      },
      lastName: {
        type: 'string',
        required: false,
        defaultValue: '',
      },
      role: {
        type: 'string',
        required: true,
        defaultValue: 'user',
        input: false,
      },
      bio: {
        type: 'string',
        required: false,
        defaultValue: '',
        input: false,
      },
      deletedAt: {
        type: 'string',
        required: false,
        defaultValue: '',
        input: false,
      },
      banReason: {
        type: 'string',
        required: false,
        defaultValue: '',
        input: false,
      },
      userProfileStep: {
        type: 'string',
        required: true,
        defaultValue: 'signup',
        input: false,
      },
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ newEmail, url }) => {
        try {
          await resend.emails.send({
            from: env.RESEND_FROM,
            to: newEmail,
            subject: 'Verify email change',
            react: <>{ChangeEmailTemplate({ changeLink: url })}</>,
          });
        } catch (error) {
          console.error('Error sending verification email:', error);
          throw error;
        }
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
          userProfileStep: userProfile.userProfileStep,
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
            profileStep: user.userProfileStep,
          };
        },
      },
    }),
    nextCookies(),
    username({
      usernameValidator: (username) => {
        return regex.test(username);
      },
    }),
    admin({
      defaultRole: 'user',
      adminRole: ['admin', 'brand'],
      defaultBanReason: 'You are not authorized to access this resource',
      defaultBanExpiresIn: 30 * 60,
    }),
    organization({
      creatorRole: 'brand',
      memberRole: ['user', 'brand', 'admin'],
      schema: {
        organization: {
          fields: {
            name: 'name',
            slug: 'slug',
            logo: 'logo',
            createdAt: 'createdAt',
            metadata: 'metadata',
          },
        },
      },
      allowUserToCreateOrganization: async (user: { id: string }) => {
        const userProfile = await getUserProfileById(user.id);
        if (!userProfile) {
          return false;
        }
        const isAllowed =
          userProfile.role === schema.USER_ROLES.BRAND_OWNER ||
          userProfile.role === schema.USER_ROLES.ADMIN;
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
      sendInvitationEmail: async (data) => {
        const { id, email, organization, inviter } = data;
        // TODO: Implement multi-tenant invitation URLs.
        // The final URL structure should be: `https://{brand_slug}.synaxis.community/invites/{invitation_id}`
        // This will require DNS configuration for wildcard subdomains and middleware in Next.js to handle them.
        // The current URL is a temporary placeholder.
        const inviteLink = `${env.NEXT_PUBLIC_APP_URL}/auth/invite?user_id=${id}&brand_id=${organization.id}&brand_slug=${organization.slug}&created_at=${new Date().toISOString()}`;

        await resend.emails.send({
          from: env.RESEND_FROM,
          to: email,
          subject: 'Invitation to join organization',
          react: (
            <InviteTemplate
              name={organization.name}
              inviter={
                (inviter.user as unknown as { firstName: string }).firstName
              }
              inviteLink={inviteLink}
            />
          ),
        });
      },
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        // biome-ignore lint/suspicious/useAwait: we only need it to be async
        before: async (user, _ctx) => {
          const [firstName, ...lastNameParts] = user.name.split(' ');

          return {
            data: {
              ...user,
              firstName: firstName ?? '',
              lastName: lastNameParts.join(' '),
            },
          };
        },
      },
    },
  },
};

const auth = betterAuth(authConfig);
export { auth };
export type Auth = typeof auth;
