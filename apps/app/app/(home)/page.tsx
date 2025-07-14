import { SignOutButton } from '@/components/auth/signout';
import { cn } from '@repo/design-system/lib/utils';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1>Welcome</h1>
      <SignOutButton />
    </main>
  );
}
