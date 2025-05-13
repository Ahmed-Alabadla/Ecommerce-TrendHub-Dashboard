import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
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

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

export const useImageUpload = () => {
  const uploadImage = async (file: File): Promise<string> => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`Max image size is 1MB.`, {
        duration: 3000,
      });
      return "";
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target?.result) {
          // Simulate network delay
          setTimeout(() => {
            // Ensure the result is a string (data URL)
            if (e.target && e.target.result) {
              resolve(e.target.result as string);
            }
          }, 500);
        } else {
          reject(new Error("No result from file reading"));
        }
      };

      reader.onerror = () => {
        toast.error("Upload failed", {
          description: "Failed to upload image. Please try again.",
          duration: 3000,
        });
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(file);
    });
  };

  const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
    try {
      const uploads = await Promise.all(files.map((file) => uploadImage(file)));
      return uploads.filter((url): url is string => !!url); // Filter out any undefined values
    } catch {
      toast.error("Upload failed", {
        description: "Failed to upload one or more images",
        duration: 3000,
      });
      return [];
    }
  };

  return {
    uploadImage,
    uploadMultipleImages,
  };
};

export function formatFileSize(bytes?: number) {
  if (!bytes) return "0 B";
  const k = 1024;
  const dm = 2;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
