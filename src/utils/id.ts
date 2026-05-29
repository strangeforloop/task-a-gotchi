let counter = 0;

/**
 * Collision-proof id generator. `Date.now()` alone repeats when ids are minted
 * in a tight synchronous loop (e.g. adding several habits at once during
 * onboarding), which produced duplicate React keys. Appending a monotonic
 * per-session counter guarantees uniqueness even within the same millisecond.
 */
export function uid(prefix: string): string {
  counter = (counter + 1) % 0xffffff;
  return `${prefix}-${Date.now().toString(36)}-${counter.toString(36)}`;
}
