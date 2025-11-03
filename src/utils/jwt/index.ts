// src/utils/jwt/index.ts
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import type { JwtModuleOptions } from '@nestjs/jwt';
import type { StringValue } from 'ms';

const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES as StringValue,
  },
};

@Global()
@Module({
  imports: [JwtModule.register(jwtConfig)],
  exports: [JwtModule],
})
export class JwtGlobalModule {}
