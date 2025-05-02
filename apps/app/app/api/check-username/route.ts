import { drizzle } from '@repo/database';
import { users } from '@repo/database/models/users';
import { eq, or } from 'drizzle-orm';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json(
      { available: false, error: 'Username is required' },
      { status: 400 }
    );
  }

  try {
    const existingUser = await drizzle.query.users.findFirst({
      where: or(
        eq(users.username, username),
        eq(users.displayUsername, username)
      ),
    });

    return NextResponse.json({
      available: !existingUser,
    });
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: ?
    console.error('Error checking username:', error);
    return NextResponse.json(
      { available: false, error: 'Failed to check username' },
      { status: 500 }
    );
  }
}
