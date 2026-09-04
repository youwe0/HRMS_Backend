import { test } from "node:test";
import assert from "node:assert/strict";
import { hashPassword, comparePassword } from "../../../src/shared/utils/password.js";

test("hashPassword produces a salted hash and comparePassword matches it", async () => {
  const plain = "SuperSecret123!";
  const hash = await hashPassword(plain);
  assert.notEqual(hash, plain);
  assert.ok(await comparePassword(plain, hash));
});

test("comparePassword rejects an incorrect password", async () => {
  const hash = await hashPassword("CorrectHorse99");
  assert.equal(await comparePassword("WrongHorse99", hash), false);
});

test("same password hashes differently each time (salt)", async () => {
  const hashA = await hashPassword("SamePass123");
  const hashB = await hashPassword("SamePass123");
  assert.notEqual(hashA, hashB);
});
