import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryColumn()
  code: string;

  @Column()
  product_name: string;

  @Column({ nullable: true })
  brands: string;

  @Column({ nullable: true })
  categories: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ nullable: true })
  nutrition_grade_fr: string;

  @Column({ nullable: true })
  ingredients_text: string;

  @Column({ nullable: true })
  labels: string;

  @Column({ nullable: true })
  packaging: string;

  @Column('real', { nullable: true })
  energy_kcal: number;

  @Column('real', { nullable: true })
  fat: number;

  @Column('real', { nullable: true })
  saturated_fat: number;

  @Column('real', { nullable: true })
  carbohydrates: number;

  @Column('real', { nullable: true })
  sugars: number;

  @Column('real', { nullable: true })
  fiber: number;

  @Column('real', { nullable: true })
  proteins: number;

  @Column('real', { nullable: true })
  sodium: number;
}
