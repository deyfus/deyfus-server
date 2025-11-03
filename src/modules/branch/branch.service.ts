// src/modules/branch/branch.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from '../../core/types';
import { PrismaModelMap, dbFields } from '../../core/types/models';

type CreateBranchDto = {
  name: string;
  address: string;
  description?: string | null;
  photos?: string[];
};

type UpdateBranchDto = Partial<CreateBranchDto>;

@Injectable()
export class BranchService {
  private readonly model = PrismaModelMap.branch;
  private readonly f = dbFields.branch;

  constructor(private readonly repo: Repository) {}

  list() {
    return this.repo.findMany(this.model);
  }

  async get(id: string) {
    const branch = await this.repo.findUnique(this.model, {
      where: { [this.f.id]: id },
    });
    if (!branch) {
      throw new NotFoundException(`Sucursal con ID ${id} no encontrada`);
    }
    return branch;
  }

  create(data: CreateBranchDto) {
    return this.repo.create(this.model, {
      data: {
        [this.f.name]: data.name,
        [this.f.address]: data.address,
        [this.f.description]: data.description ?? null,
        [this.f.photos]: data.photos ?? [],
      },
    });
  }

  async update(id: string, data: UpdateBranchDto) {
    await this.get(id);

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
        ...(data.photos !== undefined ? { [this.f.photos]: data.photos } : {}),
      },
    });
  }

  async remove(id: string) {
    await this.get(id);
    return this.repo.remove(this.model, { where: { [this.f.id]: id } });
  }
}
