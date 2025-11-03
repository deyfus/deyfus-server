import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ProductDetailService } from './product-detail.service';

@Controller('product-details')
export class ProductDetailController {
  constructor(private readonly service: ProductDetailService) {}

  @Get()
  list() {
    return this.service.list();
  }

  @Get('product/:product_id')
  findByProduct(@Param('product_id') product_id: string) {
    return this.service.findByProduct(product_id);
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
