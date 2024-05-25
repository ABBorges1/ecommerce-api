import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Category } from './category';

export type ProductProps = {
  name: string;
  description?: string;
  price: number;
  isShown?: boolean;
  subCategory?: Category;
  image?: string;
};

export class Product extends Entity<ProductProps> {
  public static create(props: ProductProps) {
    return new Product(props);
  }

  public static restore(props: ProductProps, id: UniqueEntityID) {
    return new Product(props, id);
  }

  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  get price() {
    return this.props.price;
  }

  get isShown() {
    return this.props.isShown;
  }

  get subCategory() {
    return this.props.subCategory;
  }

  get image() {
    return this.props.image;
  }
}
