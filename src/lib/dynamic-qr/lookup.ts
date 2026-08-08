/**
 * Placeholder abstraction for the future dynamic QR system described in the
 * architecture doc. `/r/[shortCode]` is reserved as the redirect namespace,
 * but no backend/database is wired up yet — every lookup returns null.
 *
 * Replace this implementation once a secure backend exists. Callers should
 * not need to change: they already treat a null result as "not found."
 */
export interface DynamicDestination {
  shortCode: string;
  destinationUrl: string;
  enabled: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- signature kept stable for the future backend-backed implementation
export async function resolveShortCode(shortCode: string): Promise<DynamicDestination | null> {
  return null;
}
