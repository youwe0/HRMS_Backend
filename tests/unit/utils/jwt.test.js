import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashRefreshToken,
} from '../../../src/utils/jwt.js';

const USER_ID = '507f1f77bcf86cd799439011';

test('access token round-trips the payload', () => {
  const token = signAccessToken({ sub: USER_ID, role: 'admin' });
  const payload = verifyAccessToken(token);
  assert.equal(payload.sub, USER_ID);
  assert.equal(payload.role, 'admin');
});

test('refresh token cannot be verified as an access token', () => {
  const refreshToken = signRefreshToken({ sub: USER_ID, role: 'admin' });
  assert.throws(() => verifyAccessToken(refreshToken));
});

test('refresh token round-trips with its own verifier', () => {
  const token = signRefreshToken({ sub: USER_ID, role: 'admin' });
  const payload = verifyRefreshToken(token);
  assert.equal(payload.sub, USER_ID);
});

test('hashRefreshToken is deterministic, 64 hex chars, not reversible', () => {
  const a = hashRefreshToken('some-token-value');
  const b = hashRefreshToken('some-token-value');
  assert.equal(a, b);
  assert.notEqual(a, 'some-token-value');
  assert.match(a, /^[0-9a-f]{64}$/);
});
