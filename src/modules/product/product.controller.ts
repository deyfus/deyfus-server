import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Get()
  list() {
    return this.service.list();
  }

  @Get('inventory/:inventory_id')
  findByInventory(@Param('inventory_id') inventory_id: string) {
    return this.service.findByInventory(inventory_id);
  }

  @Get('branch/:branch_id')
  findByBranch(@Param('branch_id') branch_id: string) {
    return this.service.findByBranch(branch_id);
  }

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
