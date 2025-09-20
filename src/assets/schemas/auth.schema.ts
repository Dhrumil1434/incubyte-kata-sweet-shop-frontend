import { z } from 'zod';

// User type schema (matches backend login response exactly)
export const userTypeRecordSchema = z.object({
  userTypeId: z.number().int().positive(),
  typeName: z.string().nullable(),
  description: z.string().nullable(),
  is_active: z.boolean().nullable(),
});

// Login request schema - matches backend loginSchema
export const userLoginSchemaDto = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Registration request schema - matches backend registerSchema
export const userRegisterSchemaDto = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be 255 characters or fewer'),
  email: z.string().email('Please provide a valid email address').max(255, 'Email must be 255 characters or fewer'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be 128 characters or fewer')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
      'Password must contain uppercase, lowercase, number, and special character'
    ),
  role: z.enum(['customer', 'admin']).default('customer'),
});

// User data schema for login response - matches backend userResponseSchema
export const loginUserDataSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['customer', 'admin']),
  is_active: z.boolean().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// Tokens schema (both access and refresh tokens for frontend)
export const loginTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

// Login response schema - matches backend response structure
export const loginResponseSchema = z.object({
  user: loginUserDataSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
});

// Registration response schema - matches backend userResponseSchema
export const registerResponseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['customer', 'admin']),
  is_active: z.boolean().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// Refresh token response schema (only access token in response)
export const refreshTokenResponseSchema = z.object({
  accessToken: z.string(),
});

// API Response schemas - matches backend ApiResponse structure
export const loginApiResponseSchema = z
  .object({
    statusCode: z.number().int(),
    data: loginResponseSchema,
    message: z.string(),
    success: z.boolean(),
  })
  .strict();

export const refreshTokenApiResponseSchema = z
  .object({
    statusCode: z.number().int(),
    data: refreshTokenResponseSchema,
    message: z.string(),
    success: z.boolean(),
  })
  .strict();

export const logoutApiResponseSchema = z
  .object({
    statusCode: z.number().int(),
    data: z.null(),
    message: z.string(),
    success: z.boolean(),
  })
  .strict();

export const registerApiResponseSchema = z
  .object({
    statusCode: z.number().int(),
    data: registerResponseSchema,
    message: z.string(),
    success: z.boolean(),
  })
  .strict();

// Infer the TypeScript types
export type UserLoginDto = z.infer<typeof userLoginSchemaDto>;
export type UserRegisterDto = z.infer<typeof userRegisterSchemaDto>;
export type LoginUserData = z.infer<typeof loginUserDataSchema>;
export type RegisterUserData = z.infer<typeof registerResponseSchema>;
export type LoginTokens = z.infer<typeof loginTokensSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;
export type LoginApiResponse = z.infer<typeof loginApiResponseSchema>;
export type RegisterApiResponse = z.infer<typeof registerApiResponseSchema>;
