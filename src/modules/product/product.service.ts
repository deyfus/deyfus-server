// src/modules/product/product.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from '../../core/types';
import { PrismaModelMap, dbFields } from '../../core/types/models';

type CreateProductDto = {
  name: string;
  description?: string | null;
  image_urls?: string[];
  category?: string | null;
  brand?: string | null;
  inventory_id: string;
};

type UpdateProductDto = Partial<CreateProductDto>;

@Injectable()
export class ProductService {
  private readonly model = PrismaModelMap.product;
  private readonly invModel = PrismaModelMap.inventory;
  private readonly f = dbFields.product;
  private readonly fi = dbFields.inventory;

  constructor(private readonly repo: Repository) {}

  list() {
    return this.repo.findMany(this.model, {
      include: {
        inventory: { include: { branch: true } },
      },
    });
  }

  async findByInventory(inventory_id: string) {
    return this.repo.findMany(this.model, {
      where: { [this.f.inventory_id]: inventory_id },
      include: { inventory: { include: { branch: true } } },
    });
  }

  async findByBranch(branch_id: string) {
    return this.repo.findMany(this.model, {
      where: { inventory: { [this.fi.branch_id]: branch_id } },
      include: { inventory: { include: { branch: true } } },
    });
  }

  async create(data: CreateProductDto) {
    const inv = await this.repo.findUnique(this.invModel, {
      where: { [this.fi.id]: data.inventory_id },
      select: { [this.fi.id]: true },
    });
    if (!inv) {
      throw new NotFoundException(
        `Inventario con ID ${data.inventory_id} no encontrado`,
      );
    }

    return this.repo.create(this.model, {
      data: {
        [this.f.name]: data.name,
        [this.f.description]: data.description ?? null,
        [this.f.image_urls]: data.image_urls ?? [],
        [this.f.category]: data.category ?? null,
        [this.f.brand]: data.brand ?? null,
        [this.f.inventory_id]: data.inventory_id,
      },
      include: { inventory: { include: { branch: true } } },
    });
  }

  async update(id: string, data: UpdateProductDto) {
    const exists = await this.repo.findUnique(this.model, {
      where: { [this.f.id]: id },
      select: { [this.f.id]: true },
    });
    if (!exists)
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);

    if (data.inventory_id) {
      const inv = await this.repo.findUnique(this.invModel, {
        where: { [this.fi.id]: data.inventory_id },
        select: { [this.fi.id]: true },
      });
      if (!inv) {
        throw new NotFoundException(
          `Inventario con ID ${data.inventory_id} no encontrado`,
        );
      }
    }

    return this.repo.update(this.model, {
      where: { [this.f.id]: id },
      data: {
        ...(data.name !== undefined ? { [this.f.name]: data.name } : {}),
        ...(data.description !== undefined
          ? { [this.f.description]: data.description }
          : {}),
        ...(data.image_urls !== undefined
          ? { [this.f.image_urls]: data.image_urls }
          : {}),
        ...(data.category !== undefined
          ? { [this.f.category]: data.category }
          : {}),
        ...(data.brand !== undefined ? { [this.f.brand]: data.brand } : {}),
        ...(data.inventory_id !== undefined
          ? { [this.f.inventory_id]: data.inventory_id }
          : {}),
      },
      include: { inventory: { include: { branch: true } } },
    });
  }

  async remove(id: string) {
    const exists = await this.repo.findUnique(this.model, {
      where: { [this.f.id]: id },
      select: { [this.f.id]: true },
    });
    if (!exists)
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);

    return this.repo.remove(this.model, { where: { [this.f.id]: id } });
  }
}
