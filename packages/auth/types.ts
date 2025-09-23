// Extend Better Auth types with our additional fields
declare module 'better-auth/types' {
  interface User {
    firstName: string;
    lastName: string;
    username: string;
    role: string;
    bio: string;
    deletedAt: string;
    banReason: string;
    userProfileStep: string;
    createdAt: Date;
    updatedAt: Date;
  }
}