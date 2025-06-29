'use server';

import type { FormData } from '@/store/use-onboarding-store';
import { auth } from '@repo/auth/server';
import { drizzle } from '@repo/database';
import {
  USER_PROFILE_STEPS,
  USER_ROLES,
  brands,
  users,
  type users as usersTable,
} from '@repo/database/schema';
import { captureException } from '@sentry/nextjs';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

function buildUserUpdatePayload(formData: FormData) {
  const payload: Partial<typeof usersTable.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (formData.firstName) payload.firstName = formData.firstName;
  if (formData.lastName) payload.lastName = formData.lastName;
  if (formData.username) payload.username = formData.username;
  if (formData.bio) payload.bio = formData.bio;

  if (formData.generatedAvatarMetadata) {
    payload.image = formData.generatedAvatarMetadata;
  } else if (formData.profilePictureUrl) {
    payload.image = formData.profilePictureUrl;
  }

  if (formData.location) payload.location = formData.location;
  if (formData.instagram) payload.instagram = formData.instagram;
  if (formData.twitter) payload.twitter = formData.twitter;
  if (formData.facebook) payload.facebook = formData.facebook;
  if (formData.linkedin) payload.linkedin = formData.linkedin;
  if (formData.website) payload.website = formData.website;
  if (formData.isProfilePublic !== undefined)
    payload.isProfilePublic = formData.isProfilePublic;
  if (formData.showLocation !== undefined)
    payload.showLocation = formData.showLocation;
  if (formData.allowMessages !== undefined)
    payload.allowMessages = formData.allowMessages;
  if (formData.interests) payload.interests = formData.interests;
  if (formData.bannerColor) payload.bannerColor = formData.bannerColor;

  return payload;
}

async function handleUserOnboarding(
  userId: string,
  payload: Partial<typeof usersTable.$inferInsert>
) {
  await drizzle
    .update(users)
    .set({
      ...payload,
      role: USER_ROLES.USER,
      userProfileStep: USER_PROFILE_STEPS.COMPLETED,
    })
    .where(eq(users.id, userId));
}

async function handleBrandOnboarding(
  formData: FormData,
  userId: string,
  payload: Partial<typeof usersTable.$inferInsert>
) {
  // Type guard validation with proper string checking
  const brandName = formData.brandName?.trim();
  const slug = formData.slug?.trim();

  if (!brandName || !slug) {
    throw new Error('Brand name and slug are required for brand accounts.');
  }

  await drizzle.transaction(async (tx) => {
    const [brand] = await tx
      .insert(brands)
      .values({
        name: brandName, // Now guaranteed to be string
        slug: slug, // Now guaranteed to be string
        description: formData.brandDescription?.trim() || null,
        logo: formData.logo?.trim() || null,
        website: formData.website?.trim() || null,
        ownerId: userId,
      })
      .returning();

    if (!brand?.id) {
      throw new Error('Failed to create brand');
    }

    await tx
      .update(users)
      .set({
        ...payload,
        brandId: brand.id,
        role: USER_ROLES.BRAND_OWNER,
        userProfileStep: USER_PROFILE_STEPS.COMPLETED,
      })
      .where(eq(users.id, userId));
  });
}

export async function completeOnboarding(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  try {
    const userUpdatePayload = buildUserUpdatePayload(formData);

    if (formData.accountType === 'user') {
      await handleUserOnboarding(session.user.id, userUpdatePayload);
    } else if (formData.accountType === 'brand') {
      await handleBrandOnboarding(formData, session.user.id, userUpdatePayload);
    }

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    captureException(error, {
      tags: {
        action: 'completeOnboarding',
      },
    });
    throw new Error('Failed to complete onboarding');
  }
}

export async function skipOnboarding() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  try {
    // Get current user data to check if username exists
    const [currentUser] = await drizzle
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!currentUser) {
      throw new Error('User not found');
    }

    // Generate username if missing (same logic as sign-up)
    let username = currentUser.username;
    if (!username || username.startsWith('guest#')) {
      const randomHex = crypto.randomUUID().slice(0, 4);
      const discriminator = (Number.parseInt(randomHex, 16) % 9000) + 1000;
      username = `guest#${discriminator}`;
    }

    // Generate default avatar metadata based on user ID
    const defaultAvatarSeed = session.user.id.slice(0, 8);
    const defaultAvatarMetadata = `${username}${defaultAvatarSeed}_variant_marble_size_60_square_false`;

    // Update user with minimal guest profile
    await drizzle
      .update(users)
      .set({
        username: username,
        role: USER_ROLES.GUEST,
        userProfileStep: USER_PROFILE_STEPS.COMPLETED,
        image: currentUser.image || defaultAvatarMetadata,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    captureException(error, {
      tags: {
        action: 'skipOnboarding',
      },
    });
    throw new Error('Failed to skip onboarding');
  }
}
