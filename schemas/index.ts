import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const RegisterSchema = z
  .object({
    name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must include uppercase, lowercase, and number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const ResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must include uppercase, lowercase, and number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const CreateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters"),

  email: z
    .string()
    .email("Invalid email address")
    .max(150, "Email must be at most 150 characters"),

  role: z.enum(["admin", "customer"], {
    errorMap: () => ({ message: "Role must be either admin or customer" }),
  }),

  phone: z
    .string()
    .min(6, { message: "Phone number must be at least 6 characters long" })
    .max(20, { message: "Phone number must be at most 20 characters long" })
    .regex(/^\+\d{6,}$/, {
      message:
        "phone must be a valid international number with country code (e.g., +970597762451)",
    })
    .optional()
    .nullable(),

  address: z
    .string()
    .min(6, "Address must be at least 6 characters long")
    .max(255, "Address must be at most 255 characters long")
    .optional()
    .nullable(),

  birth_date: z
    .union([z.date(), z.string()])
    .optional()
    .nullable()
    .refine(
      (date) => {
        if (!date) return true; // Allow null values if needed
        if (typeof date === "string") {
          return new Date(date) < new Date();
        }
        return date < new Date();
      },
      {
        message: "Date of birth can't be today or in the future",
      }
    ),

  gender: z
    .enum(["male", "female"], {
      errorMap: () => ({ message: "Gender must be either male or female" }),
    })
    .optional(),
});

const imageUrlPattern = /\.(jpg|jpeg|png|svg|webp)$/i;

export const CategorySchema = z.object({
  name: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name must be at most 50 characters"),

  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug must be at most 50 characters"),

  image: z
    .union([
      z.string().refine(
        (value) => {
          // For empty strings, consider them valid (as image is optional)
          if (!value) return true;

          // Check if it's a URL
          if (value.startsWith("http")) {
            try {
              new URL(value);
              return imageUrlPattern.test(value);
            } catch {
              return false;
            }
          }

          // Check if it's a base64 image from file upload
          return value.startsWith("data:image/");
        },
        {
          message: "Please provide a valid image URL or file",
        }
      ),
      z.literal(""),
      z.null(),
    ])
    .optional()
    .nullable(),
});
export const BrandSchema = z.object({
  name: z
    .string()
    .min(3, "Brand name must be at least 3 characters")
    .max(50, "Brand name must be at most 50 characters"),

  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug must be at most 50 characters"),

  image: z
    .union([
      z.string().refine(
        (value) => {
          // For empty strings, consider them valid (as image is optional)
          if (!value) return true;

          // Check if it's a URL
          if (value.startsWith("http")) {
            try {
              new URL(value);
              return imageUrlPattern.test(value);
            } catch {
              return false;
            }
          }

          // Check if it's a base64 image from file upload
          return value.startsWith("data:image/");
        },
        {
          message: "Please provide a valid image URL or file",
        }
      ),
      z.literal(""),
      z.null(),
    ])
    .optional()
    .nullable(),
});

export const CouponSchema = z.object({
  code: z
    .string()
    .min(3, "Coupon name must be at least 3 characters")
    .max(50, "Coupon name must be at most 50 characters"),

  discount: z.coerce.number().min(0, "Discount must not be less than 0"),

  expirationDate: z.union([z.date(), z.string()]).refine(
    (date) => {
      if (typeof date === "string") {
        return new Date(date) > new Date();
      }
      return date > new Date();
    },
    {
      message: "Date of expiration can't be today or in the past",
    }
  ),

  type: z.enum(["percentage", "fixed"], {
    errorMap: () => ({ message: "Type must be either percentage or fixed" }),
  }),

  maxUsage: z.coerce.number().min(1, "Max Usage must not be less than 1"),
});

export const SubCategorySchema = z.object({
  name: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name must be at most 50 characters"),

  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug must be at most 50 characters"),

  categoryId: z.number({
    required_error: "Please select a category",
    invalid_type_error: "Category Id must be a number",
  }),
});
