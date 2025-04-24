import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Between, Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async findByCode(code: string) {
    return this.productRepo.findOne({ where: { code } });
  }

  async queryProducts(params: {
    q?: string;
    brand?: string;
    category?: string;
    nutriscore?: string;
    minKcal?: string;
    maxKcal?: string;
    page?: string;
    pageSize?: string;
  }) {
    const where: any = {};

    if (params.q) where.product_name = Like(`%${params.q}%`);
    if (params.brand) where.brands = Like(`%${params.brand}%`);
    if (params.category) where.categories = Like(`%${params.category}%`);
    if (params.nutriscore) where.nutrition_grade_fr = params.nutriscore;
    if (params.minKcal || params.maxKcal) {
      where.energy_kcal = Between(
        params.minKcal ? Number(params.minKcal) : 0,
        params.maxKcal ? Number(params.maxKcal) : 10000,
      );
    }

    const page = Math.max(1, Number(params.page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(params.pageSize) || 20));
    const skip = (page - 1) * pageSize;

    const [data, total] = await this.productRepo.findAndCount({
      where,
      take: pageSize,
      skip,
    });

    return {
      total,
      page,
      pageSize,
      data,
    };
  }
}
