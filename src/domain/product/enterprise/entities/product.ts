import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NullOrUndefined } from '@/core/types/deep-partial';
import { Category } from './category';
import { Administrator } from './administrator';

export type ProductProps = {
  name: string;
  createdBy: Administrator;
  price: number;
} & Partial<{
  description?: string;
  isShown?: boolean;
  subCategory?: NullOrUndefined<Category>;
  image?: string;
  updatedBy?: NullOrUndefined<Administrator>;
}>;

export class Product extends Entity<ProductProps> {
  public static create(props: ProductProps, createdAt?: Date) {
    return new Product(props, undefined, createdAt);
  }

  public static restore(
    props: ProductProps,
    id: UniqueEntityID,
    createdAt: Date,
    updatedAt?: Date,
  ) {
    return new Product(props, id, createdAt, updatedAt);
  }

  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get description() {
    return this.props.description!;
  }

  set description(description: string) {
    this.props.description = description;
  }

  get price() {
    return this.props.price;
  }

  set price(price: number) {
    this.props.price = price;
  }

  get isShown(): boolean {
    return !!this.props.isShown;
  }

  set isShown(isShown: boolean) {
    this.props.isShown = isShown;
  }

  get subCategory() {
    return this.props.subCategory!;
  }

  set subCategory(subCategory: NullOrUndefined<Category>) {
    this.props.subCategory = subCategory;
  }

  get image() {
    return this.props.image;
  }

  set image(image) {
    this.props.image = image;
  }

  get createdBy() {
    return this.props.createdBy;
  }

  get updatedBy() {
    return this.props.updatedBy!;
  }

  set updatedBy(updatedBy: Administrator) {
    this.props.updatedBy = updatedBy;
  }

  get category() {
    return this.props.subCategory!.rootCategory;
  }
}
