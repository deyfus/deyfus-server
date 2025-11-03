// src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from './core/prisma/prisma.module';
import { JwtGlobalModule } from './utils/jwt';
import { AuthModule } from './modules/auth/auth.module';
import { BranchModule } from './modules/branch/branch.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { ProductModule } from './modules/product/product.module';
import { ProductDetailModule } from './modules/product-detail/product-detail.module';

@Module({
  imports: [
    PrismaModule,
    JwtGlobalModule,
    AuthModule,
    BranchModule,
    InventoryModule,
    ProductModule,
    ProductDetailModule
  ],
})
export class AppModule {}
