import { IAltchaChallenge } from './student-portal.model';

/** SHA-256 of a text, in hex (Web Crypto). */
export async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}

/** Numbers hashed per step: the browser stays responsive between steps. */
const BATCH = 500;

/**
 * Solves an ALTCHA challenge (proof of work): finds n <= maxnumber such that SHA-256(salt + n) = challenge, and returns
 * the base 64 payload expected by the back-end. About maxnumber / 2 hashes on average (a second or two).
 *
 * @param onProgress called with the share (0 to 1) of the numbers already tried
 * @throws Error when no number solves the challenge
 */
export async function solveAltcha(
  challenge: IAltchaChallenge,
  onProgress?: (share: number) => void,
  digest: (text: string) => Promise<string> = sha256Hex,
): Promise<string> {
  for (let start = 0; start <= challenge.maxnumber; start += BATCH) {
    const end = Math.min(start + BATCH - 1, challenge.maxnumber);
    const numbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    const hashes = await Promise.all(numbers.map(n => digest(challenge.salt + n)));
    const found = hashes.indexOf(challenge.challenge);
    if (found >= 0) {
      onProgress?.(1);
      return altchaPayload(challenge, numbers[found]);
    }
    onProgress?.((end + 1) / (challenge.maxnumber + 1));
  }
  throw new Error('ALTCHA challenge without solution');
}

export function altchaPayload(challenge: IAltchaChallenge, number: number): string {
  return btoa(
    JSON.stringify({
      algorithm: challenge.algorithm,
      challenge: challenge.challenge,
      number,
      salt: challenge.salt,
      signature: challenge.signature,
    }),
  );
}
