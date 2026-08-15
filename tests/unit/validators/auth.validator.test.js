import { test } from "node:test";
import assert from "node:assert/strict";
import { authValidators } from "../../../src/validators/index.js";

test("registerSchema accepts a valid payload", () => {
  const { error } = authValidators.registerSchema.validate({
    name: "Jane Doe",
    email: "jane@example.com",
    password: "Password123",
  });
  assert.equal(error, undefined);
});

test("registerSchema rejects an invalid email", () => {
  const { error } = authValidators.registerSchema.validate({
    name: "Jane Doe",
    email: "not-an-email",
    password: "Password123",
  });
  assert.ok(error);
});

test("registerSchema rejects a short password", () => {
  const { error } = authValidators.registerSchema.validate({
    name: "Jane Doe",
    email: "jane@example.com",
    password: "short",
  });
  assert.ok(error);
});

test("loginSchema requires a password", () => {
  const { error } = authValidators.loginSchema.validate({
    email: "jane@example.com",
  });
  assert.ok(error);
});

test("changePasswordSchema requires confirmPassword to match newPassword", () => {
  const { error } = authValidators.changePasswordSchema.validate({
    currentPassword: "OldPass123",
    newPassword: "NewPass123",
    confirmPassword: "Different123",
  });
  assert.ok(error);
});
