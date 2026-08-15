/**
 * Domain-specific formatter: converts a User document
 * into the safe public response shape (never leaks the hash).
 */
export const formatUserResponse = (user) => {
  if (!user) return null;
  return {
    id: user._id || user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
