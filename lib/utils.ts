import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a random password with customizable options
 *
 * @param length - Length of the password (default: 12)
 * @param options - Configuration options for password generation
 * @returns Generated password string
 */
export function generateRandomPassword(
  length: number = 12,
  options: {
    includeUppercase?: boolean;
    includeLowercase?: boolean;
    includeNumbers?: boolean;
    includeSymbols?: boolean;
  } = {
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  }
): string {
  // Character sets
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  // Build available characters based on options
  let availableChars = "";
  if (options.includeLowercase) availableChars += lowercase;
  if (options.includeUppercase) availableChars += uppercase;
  if (options.includeNumbers) availableChars += numbers;
  if (options.includeSymbols) availableChars += symbols;

  // Throw error if no character sets are selected
  if (availableChars.length === 0) {
    throw new Error("At least one character set must be included");
  }

  // Generate password
  let password = "";
  interface ExtendedWindow extends Window {
    msCrypto?: Crypto;
  }
  const crypto =
    (window as ExtendedWindow).crypto || (window as ExtendedWindow).msCrypto; // For browser compatibility
  const values = new Uint32Array(length);

  if (crypto && crypto.getRandomValues) {
    crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
      password += availableChars[values[i] % availableChars.length];
    }
  } else {
    // Fallback for environments without crypto API
    for (let i = 0; i < length; i++) {
      password +=
        availableChars[Math.floor(Math.random() * availableChars.length)];
    }
  }

  return password;
}
