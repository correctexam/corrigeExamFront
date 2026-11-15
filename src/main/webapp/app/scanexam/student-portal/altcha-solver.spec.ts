import { describe, expect, it } from '@jest/globals';
import { createHash } from 'crypto';

import { altchaPayload, solveAltcha } from './altcha-solver';
import { IAltchaChallenge } from './student-portal.model';

const sha256 = (text: string): Promise<string> => Promise.resolve(createHash('sha256').update(text).digest('hex'));

function challengeFor(number: number, maxnumber: number): IAltchaChallenge {
  const salt = 'abcdef?expires=1999999999';
  return {
    algorithm: 'SHA-256',
    challenge: createHash('sha256')
      .update(salt + number)
      .digest('hex'),
    maxnumber,
    salt,
    signature: 'sig',
  };
}

describe('ALTCHA solver', () => {
  it('finds the number and builds the payload the back-end reads', async () => {
    const challenge = challengeFor(1234, 2000);
    const shares: number[] = [];

    const payload = await solveAltcha(challenge, s => shares.push(s), sha256);

    expect(JSON.parse(atob(payload))).toEqual({
      algorithm: 'SHA-256',
      challenge: challenge.challenge,
      number: 1234,
      salt: challenge.salt,
      signature: 'sig',
    });
    expect(shares[shares.length - 1]).toBe(1);
    expect(shares.every((s, i) => i === 0 || s >= shares[i - 1])).toBe(true);
  });

  it('finds 0 and maxnumber (bounds included)', async () => {
    await expect(solveAltcha(challengeFor(0, 700), undefined, sha256)).resolves.toBe(altchaPayload(challengeFor(0, 700), 0));
    await expect(solveAltcha(challengeFor(700, 700), undefined, sha256)).resolves.toBe(altchaPayload(challengeFor(700, 700), 700));
  });

  it('fails when no number solves the challenge', async () => {
    const challenge = { ...challengeFor(900, 1000), maxnumber: 100 };
    await expect(solveAltcha(challenge, undefined, sha256)).rejects.toThrow('ALTCHA');
  });
});
