// src/core/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Repository } from '../types/';

@Global()
@Module({
  providers: [PrismaService, Repository],
  exports: [PrismaService, Repository],
})
export class PrismaModule {}
