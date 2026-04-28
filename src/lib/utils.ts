/**
 * Utility functions for Engineer OS
 */

/**
 * Serializes Prisma objects by converting Dates to strings via JSON round-trip.
 * Useful for passing data from Server Actions/Components to Client Components.
 */
export function serialize(obj: any) {
  if (!obj) return obj;
  return JSON.parse(JSON.stringify(obj));
}
