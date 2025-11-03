//src/core/types/repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class Repository {
  constructor(private readonly prisma: PrismaService) {}

  private getDelegate<T extends keyof PrismaClient, M extends PrismaClient[T]>(
    model: T,
  ): M {
    const delegate = this.prisma[model] as M;
    if (!delegate) throw new Error(`Delegate ${String(model)} no encontrado`);
    return delegate;
  }

  async create<
    T extends keyof PrismaClient,
    M extends PrismaClient[T] & { create: (args: any) => any },
  >(model: T, args: Parameters<M['create']>[0]) {
    return this.getDelegate<T, M>(model).create(args);
  }

  async findUnique<
    T extends keyof PrismaClient,
    M extends PrismaClient[T] & { findUnique: (args: any) => any },
  >(model: T, args: Parameters<M['findUnique']>[0]) {
    return this.getDelegate<T, M>(model).findUnique(args);
  }

  async findMany<
    T extends keyof PrismaClient,
    M extends PrismaClient[T] & { findMany: (args?: any) => any },
  >(model: T, args?: Parameters<M['findMany']>[0]) {
    return this.getDelegate<T, M>(model).findMany(args);
  }

  async update<
    T extends keyof PrismaClient,
    M extends PrismaClient[T] & { update: (args: any) => any },
  >(model: T, args: Parameters<M['update']>[0]) {
    return this.getDelegate<T, M>(model).update(args);
  }

  async remove<
    T extends keyof PrismaClient,
    M extends PrismaClient[T] & { delete: (args: any) => any },
  >(model: T, args: Parameters<M['delete']>[0]) {
    return this.getDelegate<T, M>(model).delete(args);
  }

  async count<
    T extends keyof PrismaClient,
    M extends PrismaClient[T] & { count: (args?: any) => any },
  >(model: T, args?: Parameters<M['count']>[0]) {
    return this.getDelegate<T, M>(model).count(args);
  }
}
