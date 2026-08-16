//  Domain-specific formatter: converts a User document
//  into the safe public response shape (never leaks the hash).

export const formatUserResponse = (user) => {
  if (!user) return null;
  return {
    id: user.userId || user.UserId,
    userName: user.userName || user.UserName,
    createdAt: user.createdAt || user.Created_at,
    createdBy: user.createdBy || user.Created_by,
    isActive: user.isActive ?? user.Is_active,
  };
};
