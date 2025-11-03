// src/modules/product-detail/product-detail.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from '../../core/types';
import { PrismaModelMap, dbFields } from '../../core/types/models';

type CreateProductDetailDto = {
  size?: string | null;
  color?: string | null;
  gender?: string | null;
  template?: string | null;
  heel_type?: string | null;
  product_id: string;
};

type UpdateProductDetailDto = Partial<CreateProductDetailDto>;

@Injectable()
export class ProductDetailService {
  private readonly model = PrismaModelMap.product_detail;
  private readonly productModel = PrismaModelMap.product;
  private readonly f = dbFields.product_detail;
  private readonly fp = dbFields.product;

  constructor(private readonly repo: Repository) {}

  list() {
    return this.repo.findMany(this.model, {
      include: { product: true },
    });
  }

  async findByProduct(product_id: string) {
    return this.repo.findMany(this.model, {
      where: { [this.f.product_id]: product_id },
      include: { product: true },
    });
  }

  async get(id: string) {
    const detail = await this.repo.findUnique(this.model, {
      where: { [this.f.id]: id },
      include: { product: true },
    });
    if (!detail) {
      throw new NotFoundException(
        `Detalle de producto con ID ${id} no encontrado`,
      );
    }
    return detail;
  }

  async create(data: CreateProductDetailDto) {
    const product = await this.repo.findUnique(this.productModel, {
      where: { [this.fp.id]: data.product_id },
      select: { [this.fp.id]: true },
    });
    if (!product) {
      throw new NotFoundException(
        `Producto con ID ${data.product_id} no encontrado`,
      );
    }

    return this.repo.create(this.model, {
      data: {
        [this.f.size]: data.size ?? null,
        [this.f.color]: data.color ?? null,
        [this.f.gender]: data.gender ?? null,
        [this.f.template]: data.template ?? null,
        [this.f.heel_type]: data.heel_type ?? null,
        [this.f.product_id]: data.product_id,
      },
      include: { product: true },
    });
  }

  async update(id: string, data: UpdateProductDetailDto) {
    const exists = await this.repo.findUnique(this.model, {
      where: { [this.f.id]: id },
      select: { [this.f.id]: true },
    });
    if (!exists) {
      throw new NotFoundException(
        `Detalle de producto con ID ${id} no encontrado`,
      );
    }

    if (data.product_id) {
      const product = await this.repo.findUnique(this.productModel, {
        where: { [this.fp.id]: data.product_id },
        select: { [this.fp.id]: true },
      });
      if (!product) {
        throw new NotFoundException(
          `Producto con ID ${data.product_id} no encontrado`,
        );
      }
    }

    return this.repo.update(this.model, {
      where: { [this.f.id]: id },
      data: {
        ...(data.size !== undefined ? { [this.f.size]: data.size } : {}),
        ...(data.color !== undefined ? { [this.f.color]: data.color } : {}),
        ...(data.gender !== undefined ? { [this.f.gender]: data.gender } : {}),
        ...(data.template !== undefined
          ? { [this.f.template]: data.template }
          : {}),
        ...(data.heel_type !== undefined
          ? { [this.f.heel_type]: data.heel_type }
          : {}),
        ...(data.product_id !== undefined
          ? { [this.f.product_id]: data.product_id }
          : {}),
      },
      include: { product: true },
    });
  }

  async remove(id: string) {
    const exists = await this.repo.findUnique(this.model, {
      where: { [this.f.id]: id },
      select: { [this.f.id]: true },
    });
    if (!exists) {
      throw new NotFoundException(
        `Detalle de producto con ID ${id} no encontrado`,
      );
    }

    return this.repo.remove(this.model, { where: { [this.f.id]: id } });
  }
}
