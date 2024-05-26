import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { EntityNotFoundError } from '@/core/errors/commom/entity-not-found-error';
import { EventManager, Events } from '@/core/types/events';
import { UseCase } from '@/core/types/use-case';
import { Logger } from '@/shared/logger';
import {
  CreatedBy,
  CreatedByProps,
} from '../../enterprise/entities/created-by';
import { CategoriesRepository } from '../gateways/repositories/categories-repository';
import { ProductsRepository } from '../gateways/repositories/products-repository';
import { File } from '../gateways/storage/file';
import { StorageGateway } from '../gateways/storage/storage-gateway';

export type UpdateProductRequest = {
  id: string;
  updatedBy: CreatedByProps;
} & Partial<{
  name: string;
  description: string;
  price: number;
  isShown: boolean;
  subCategoryId?: string;
  image?: File;
}>;

export type UpdateProductResponse = void;

export class UpdateProductUseCase
  implements UseCase<UpdateProductRequest, UpdateProductResponse>
{
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly storageGateway: StorageGateway,
    private readonly logger: Logger,
    private readonly eventManager: EventManager,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async execute(request: UpdateProductRequest): Promise<UpdateProductResponse> {
    try {
      const {
        id,
        image: newImage,
        subCategoryId: newSubCategoryId,
        ...restOfRequest
      } = request;

      this.logger.log(
        UpdateProductUseCase.name,
        `Updating product ${request.id} ${request.name}`,
      );

      this.logger.debug(
        UpdateProductUseCase.name,
        `Update product ${request.id} ${request.name}: ${JSON.stringify(
          {
            ...request,
            image: '***',
          },
          null,
          2,
        )}`,
      );

      const product = await this.productsRepository.findById(
        new UniqueEntityID(id),
      );

      if (!product) {
        throw new EntityNotFoundError('Produto', request.id);
      }

      if (newSubCategoryId) {
        this.logger.log(
          UpdateProductUseCase.name,
          `Updating product ${request.id} ${request.name} with new subcategory ${newSubCategoryId}`,
        );
        const newCategory = await this.categoriesRepository.findById(
          new UniqueEntityID(request.subCategoryId),
        );

        if (!newCategory) {
          this.logger.log(
            UpdateProductUseCase.name,
            `Product ${request.id} ${request.name} updated with new subcategory ${newSubCategoryId}`,
          );
          throw new EntityNotFoundError('Categoria', request.subCategoryId);
        }

        product.subCategory = newCategory;

        this.logger.log(
          UpdateProductUseCase.name,
          `Product ${request.id} ${request.name} updated with new subcategory ${newSubCategoryId}`,
        );
      }

      if (newImage) {
        this.logger.log(
          UpdateProductUseCase.name,
          `Updating product ${request.id} ${request.name} with new image`,
        );
        const { url: newImageUrl } = await this.storageGateway.upload(newImage);
        const oldImageUrl = product.image;

        if (oldImageUrl) {
          this.logger.log(
            UpdateProductUseCase.name,
            `Deleting old image of product ${request.id} - ${request.name} `,
          );
          await this.storageGateway.delete(oldImageUrl);
        }

        product.image = newImageUrl;

        this.logger.log(
          UpdateProductUseCase.name,
          `Product ${request.id} ${request.name} updated with new image`,
        );
      }

      product.updatedBy = CreatedBy.restore(
        request.updatedBy,
        request.updatedBy.id,
      );

      Object.assign(product, restOfRequest);

      await this.productsRepository.save(product);

      await this.eventManager.publish(Events.PRODUCT_UPDATED, product);

      this.logger.log(
        UpdateProductUseCase.name,
        `Product ${request.id} ${request.name} updated with ${JSON.stringify(restOfRequest, null, 2)}`,
      );
    } catch (error: any) {
      this.logger.error(
        UpdateProductUseCase.name,
        `Error updating product ${request.id} - ${request.name}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
