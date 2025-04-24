import { Controller, Get, Query, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('products')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async findProducts(
    @Query('q') q?: string,
    @Query('brand') brand?: string,
    @Query('category') category?: string,
    @Query('nutriscore') nutriscore?: string,
    @Query('minKcal') minKcal?: string,
    @Query('maxKcal') maxKcal?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.appService.queryProducts({
      q,
      brand,
      category,
      nutriscore,
      minKcal,
      maxKcal,
      page,
      pageSize,
    });
  }

  @Get(':code')
  async findByCode(@Param('code') code: string) {
    return this.appService.findByCode(code);
  }
}
