import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';
import fs from 'fs';
import path from 'path';

if (!fs.existsSync(path.resolve('.env'))) {
  console.log('Không tìm thấy file .env');
  process.exit(1);
}

class ConfigSchema {
  @IsString()
  DATABASE_URL: string;
  @IsString()
  ACCESS_TOKEN_SECRET: string;
  @IsString()
  REFRESH_TOKEN_SECRET: string;
  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: string;
  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: string;
}

const configServer = plainToInstance(ConfigSchema, process.env, {
  enableImplicitConversion: true
});

const errors = validateSync(configServer);

if (errors.length > 0) {
  console.log('Không tìm thấy các biến môi trường');
  const errorArray = errors.map((error) => {
    return {
      property: error.property,
      constraints: error.constraints,
      value: error.value
    };
  });
  throw new Error(JSON.stringify(errorArray));
}

export const envConfig = configServer;
