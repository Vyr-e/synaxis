'use server';

import type { FormData } from '@/store/use-onboarding-store';
import { auth } from '@repo/auth/server';
import { drizzle } from '@repo/database';
import { USER_ROLES, brands, users } from '@repo/database/models';
import { captureException } from '@sentry/nextjs';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export async function completeOnboarding(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  try {
    if (formData.accountType === 'user') {
      await drizzle
        .update(users)
        .set({
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          bio: formData.bio,
          image: formData.profilePictureUrl,
          location: formData.location,
          instagram: formData.instagram,
          twitter: formData.twitter,
          facebook: formData.facebook,
          linkedin: formData.linkedin,
          website: formData.website,
          isProfilePublic: formData.isProfilePublic,
          showLocation: formData.showLocation,
          allowMessages: formData.allowMessages,
          interests: formData.interests,
          bannerColor: formData.bannerColor,
          selectedAvatarIndex: formData.selectedAvatarIndex,
          useGeneratedAvatar: formData.useGeneratedAvatar,
          role: USER_ROLES.USER,
          updatedAt: new Date(),
        })
        .where(eq(users.id, session.user.id));
    } else if (formData.accountType === 'brand') {
      await drizzle.transaction(async (tx) => {
        const [brand] = await tx
          .insert(brands)
          .values({
            name: formData.brandName,
            slug: formData.slug,
            description: formData.brandDescription,
            logo: formData.logo,
            website: formData.website,
            ownerId: session.user.id,
          })
          .returning();

        await tx
          .update(users)
          .set({
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.username,
            brandId: brand.id,
            role: USER_ROLES.BRAND_OWNER,
            updatedAt: new Date(),
          })
          .where(eq(users.id, session.user.id));
      });
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
