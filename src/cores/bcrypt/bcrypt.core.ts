// src/cores/bcrypt/bcrypt.core.ts
import bcrypt from "bcryptjs";
import { environment } from "../../configs";

export const compareString = async (
  normalPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  const isMatched = await bcrypt.compare(normalPassword, hashedPassword);
  return isMatched;
};

export const hashString = async (string: string): Promise<string> => {
  const hashedString = await bcrypt.hash(
    string,
    environment.encryption.BCRYPT_SALT_ROUND
  );
  return hashedString;
};
