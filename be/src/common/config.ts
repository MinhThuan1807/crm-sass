import z from 'zod';

import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables from .env file
config({
  path: '.env',
});

// Check if .env file exists
if (!fs.existsSync(path.resolve('.env'))) {
  console.log('Not found .env file!');
  process.exit(1);
}

const ConfigSchema = z.object({
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),

  FRONTEND_URL: z.string(),
  NODE_ENV: z.string(),
  PORT: z.string(),
  
  // SECRET_API_KEY: z.string(),
  // ADMIN_NAME: z.string(),
  // ADMIN_PASSWORD: z.string(),
  // ADMIN_EMAIL: z.string(),
  // ADMIN_PHONE: z.string(),
  // OTP_EXPIRES_IN: z.string(),
  // RESEND_API_KEY: z.string(),
});

// const configServer = plainToInstance(ConfigSchema, process.env);
const configServer = ConfigSchema.safeParse(process.env);

if (!configServer.success) {
  console.log('Invalid environment variables:');
  // throw configServer.error;
  console.log(configServer.error);
  process.exit(1);
}

// console.log(process.env)
// console.log(e);

const envConfig = configServer.data;

export default envConfig;
