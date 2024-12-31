import bcrypt from "bcryptjs";
import { compareString, hashString } from "./bcrypt.core";

// Mock the bcryptjs functions
jest.mock("bcryptjs");

describe("Bcrypt Service", () => {
  describe("compareString", () => {
    it("should return true for matching passwords", async () => {
      const password = "testpassword";
      const hash = "hashedpassword"; // This would be a hash created from the actual password

      (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Mocking bcrypt.compare to return true

      const result = await compareString(password, hash);

      expect(result).toBe(true); // Expect that the result is true
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash); // Expect that bcrypt.compare was called with the correct parameters
    });

    it("should return false for non-matching passwords", async () => {
      const password = "testpassword";
      const hash = "hashedpassword";

      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Mocking bcrypt.compare to return false

      const result = await compareString(password, hash);

      expect(result).toBe(false); // Expect that the result is false
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash); // Expect that bcrypt.compare was called with the correct parameters
    });
  });

  describe("hashString", () => {
    it("should return a hashed password", async () => {
      const password = "testpassword";
      const hashedPassword = "hashedpassword";

      // Use hash instead of hashSync for async handling
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword); // Mocking bcrypt.hash to return a hashed password

      const result = await hashString(password);

      expect(result).toBe(hashedPassword); // Expect that the result is the hashed password
      expect(bcrypt.hash).toHaveBeenCalledWith(password, expect.any(Number)); // Expect that bcrypt.hash was called with the correct parameters
    });
  });
});
