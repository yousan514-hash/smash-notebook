import { headers } from 'next/headers';

// DEV: allow x-user-id header for local testing
export function getUserIdOrThrow(): string {
  const hdrs = headers();
  const userId = hdrs.get('x-user-id') || process.env.DEV_USER_ID;
  if (!userId) {
    throw new Error('User not authenticated. Provide x-user-id header in dev.');
  }
  return userId;
}
