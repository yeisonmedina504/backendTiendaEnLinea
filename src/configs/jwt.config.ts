import "dotenv/config";

export const jwtConfig = {
  secret: process.env.JWT_SECRET || "secret_key_default",
  expiresIn: Number(process.env.JWT_EXPIRES_IN) || 3600,
};
