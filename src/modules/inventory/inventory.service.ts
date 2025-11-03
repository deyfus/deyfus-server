// src/modules/inventory/inventory.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from '../../core/types';
import { PrismaModelMap, dbFields } from '../../core/types/models';

type CreateInventoryDto = {
  name: string;
  address: string;
  description?: string | null;
  branch_id: string;
};

type UpdateInventoryDto = Partial<CreateInventoryDto>;

@Injectable()
export class InventoryService {
  private readonly model = PrismaModelMap.inventory;
  private readonly branchModel = PrismaModelMap.branch;
  private readonly f = dbFields.inventory;
  private readonly fb = dbFields.branch;

  constructor(private readonly repo: Repository) {}

  list() {
    return this.repo.findMany(this.model, {
      include: { branch: true, products: true },
    });
  }

  async findByBranch(branch_id: string) {
    return this.repo.findMany(this.model, {
      where: { [this.f.branch_id]: branch_id },
      include: { branch: true, products: true },
    });
  }

  async create(data: CreateInventoryDto) {
    const branch = await this.repo.findUnique(this.branchModel, {
      where: { [this.fb.id]: data.branch_id },
      select: { [this.fb.id]: true },
    });
    if (!branch) {
      throw new NotFoundException(
        `Sucursal con ID ${data.branch_id} no encontrada`,
      );
    }

    return this.repo.create(this.model, {
      data: {
        [this.f.name]: data.name,
        [this.f.address]: data.address,
        [this.f.description]: data.description ?? null,
        [this.f.branch_id]: data.branch_id,
      },
      include: { branch: true, products: true },
    });
  }

  async update(id: string, data: UpdateInventoryDto) {
    const exists = await this.repo.findUnique(this.model, {
      where: { [this.f.id]: id },
      select: { [this.f.id]: true },
    });
    if (!exists)
      throw new NotFoundException(`Inventario con ID ${id} no encontrado`);

    if (data.branch_id) {
      const branch = await this.repo.findUnique(this.branchModel, {
        where: { [this.fb.id]: data.branch_id },
        select: { [this.fb.id]: true },
      });
      if (!branch) {
        throw new NotFoundException(
          `Sucursal con ID ${data.branch_id} no encontrada`,
        );
      }
    }

    return this.repo.update(this.model, {
      where: { [this.f.id]: id },
      data: {
        ...(data.name !== undefined ? { [this.f.name]: data.name } : {}),
        ...(data.address !== undefined
          ? { [this.f.address]: data.address }
          : {}),
        ...(data.description !== undefined
          ? { [this.f.description]: data.description }
          : {}),
        ...(data.branch_id !== undefined
          ? { [this.f.branch_id]: data.branch_id }
          : {}),
      },
      include: { branch: true, products: true },
    });
  }

  async remove(id: string) {
    const exists = await this.repo.findUnique(this.model, {
      where: { [this.f.id]: id },
      select: { [this.f.id]: true },
    });
    if (!exists)
      throw new NotFoundException(`Inventario con ID ${id} no encontrado`);

    return this.repo.remove(this.model, { where: { [this.f.id]: id } });
  }
}
