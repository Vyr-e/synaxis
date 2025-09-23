import { drizzle, schema , eq } from '@repo/database';
import type { User } from '@repo/database/types';


/**
 * Fetches the full user profile from the database using Drizzle.
 * @param userId - The ID of the user to fetch.
 * @returns The user profile object or null if not found.
 */
export async function getUserProfileById(userId: string): Promise<User | null> {
  if (!userId) {
    return null;
  }

  try {
    const userProfile = await drizzle.query.users.findFirst({
      where: eq(schema.users.id, userId),
    });

    return userProfile ?? null;
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Dev Logging
    console.error('Error fetching user profile by ID:', error);
    return null;
  }
}
