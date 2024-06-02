import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ShowcaseCategory } from './showcase-category';

export type ShowCaseProductProps = {
  name: string;
  description?: string;
  price: number;
  image?: string;
  category?: ShowcaseCategory;
  createdAt: Date;
  updatedAt?: Date;
};

export class ShowcaseProduct extends Entity<ShowCaseProductProps> {
  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get price(): number {
    return this.props.price;
  }

  get image(): string | undefined {
    return this.props.image;
  }

  get category(): ShowcaseCategory | undefined {
    return this.props.category;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  static create(
    props: ShowCaseProductProps,
    id?: UniqueEntityID,
    createdAt?: Date,
    updatedAt?: Date,
  ): ShowcaseProduct {
    return new ShowcaseProduct({ ...props }, id, createdAt, updatedAt);
  }

  static restore(
    props: ShowCaseProductProps,
    id: UniqueEntityID,
    createdAt: Date,
    updatedAt?: Date,
  ): ShowcaseProduct {
    return new ShowcaseProduct({ ...props }, id, createdAt, updatedAt);
  }
}
