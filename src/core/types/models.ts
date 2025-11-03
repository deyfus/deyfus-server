// src/core/types/models.ts
import { PrismaClient } from '@prisma/client';

export type PrismaModelName = keyof Omit<
  PrismaClient,
  | '$connect'
  | '$disconnect'
  | '$on'
  | '$transaction'
  | '$use'
  | '$executeRaw'
  | '$executeRawUnsafe'
  | '$queryRaw'
  | '$queryRawUnsafe'
>;

export const PrismaModelMap: Record<string, PrismaModelName> = {
  user: 'users',
  branch: 'branches',
  inventory: 'inventories',
  product: 'products',
  product_detail: 'product_details',
} as const;

export const userFields = {
  id: 'id',
  first_name: 'first_name',
  last_name: 'last_name',
  email: 'email',
  password_hash: 'password_hash',
  role: 'role',
  created_at: 'created_at',
  updated_at: 'updated_at',
} as const;

export const branchFields = {
  id: 'id',
  name: 'name',
  description: 'description',
  address: 'address',
  photos: 'photos',
  created_at: 'created_at',
} as const;

export const inventoryFields = {
  id: 'id',
  name: 'name',
  address: 'address',
  description: 'description',
  branch_id: 'branch_id',
  created_at: 'created_at',
} as const;

export const productFields = {
  id: 'id',
  name: 'name',
  description: 'description',
  image_urls: 'image_urls',
  category: 'category',
  brand: 'brand',
  inventory_id: 'inventory_id',
  branch_id: 'branch_id',
  created_at: 'created_at',
} as const;

export const productDetailFields = {
  id: 'id',
  size: 'size',
  color: 'color',
  gender: 'gender',
  template: 'template',
  heel_type: 'heel_type',
  product_id: 'product_id',
} as const;

export const dbFields = {
  user: userFields,
  branch: branchFields,
  inventory: inventoryFields,
  product: productFields,
  product_detail: productDetailFields,
} as const;

export type DbModels = keyof typeof dbFields;
export type UserField = keyof typeof userFields;
