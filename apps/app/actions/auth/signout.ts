'use server';
import { signOut } from '@repo/auth/client';

export async function signOutAction() {
  try {
    await signOut();
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
