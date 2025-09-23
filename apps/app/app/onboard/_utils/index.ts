import type { User } from 'better-auth/types';

type ExtendedUser = User & {
  username: string;
  firstName: string;
  lastName: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export const isProfileComplete = (user: ExtendedUser) => {
  if (!user.username) {
    return false;
  }

  if (!user.firstName || user.firstName.trim() === '') {
    return false;
  }

  if (user.updatedAt && user.createdAt) {
    const updatedAt = new Date(user.updatedAt);
    const createdAt = new Date(user.createdAt);

    return updatedAt.getTime() > createdAt.getTime() + 1000;
  }

  return false;
};

// Helper to get first and last name from Better Auth user
export const getUserNames = (user: ExtendedUser) => {
  if (!user.firstName || !user.lastName) {
    return { firstName: '', lastName: '' };
  }

  const firstName = user.firstName || '';
  const lastName = user.lastName || '';

  return { firstName, lastName };
};

export const formatUserData = (formData: {
  firstName?: string;
  lastName?: string;
  [key: string]: string | undefined;
}) => {
  const name =
    formData.firstName && formData.lastName
      ? `${formData.firstName} ${formData.lastName}`
      : undefined;

  return {
    ...formData,
    name,
  };
};
