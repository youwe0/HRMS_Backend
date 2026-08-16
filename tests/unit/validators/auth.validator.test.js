import { test } from "node:test";
import assert from "node:assert/strict";
import { authValidators } from "../../../src/validators/index.js";

test("registerSchema accepts a valid payload", () => {
  const { error } = authValidators.registerSchema.validate({
    userName: "jane.doe",
    password: "Password123",
  });
  assert.equal(error, undefined);
});

test("registerSchema requires a username", () => {
  const { error } = authValidators.registerSchema.validate({
    password: "Password123",
  });
  assert.ok(error);
});

test("registerSchema rejects a short password", () => {
  const { error } = authValidators.registerSchema.validate({
    userName: "jane.doe",
    password: "short",
  });
  assert.ok(error);
});

test("loginSchema requires a password", () => {
  const { error } = authValidators.loginSchema.validate({
    userName: "jane.doe",
  });
  assert.ok(error);
});
