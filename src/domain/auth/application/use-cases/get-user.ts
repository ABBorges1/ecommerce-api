import { UseCase } from '@/core/types/use-case';
import { User } from '../../enterprise/entities/user';
import { UsersRepository } from '../gateways/repositories/user-repository';
import { Logger } from '@/shared/logger';
import { EntityNotFoundError } from '@/core/errors/commom/entity-not-found-error';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Injectable } from '@nestjs/common';

export type GetUserRequest = {
  userId: string;
};

export type GetUserResponse = User;

@Injectable()
export class GetUserUseCase
  implements UseCase<GetUserRequest, GetUserResponse>
{
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly logger: Logger,
  ) {}

  async execute(request: GetUserRequest): Promise<GetUserResponse> {
    this.logger.log(
      GetUserUseCase.name,
      `Buscando usuário com ${JSON.stringify(request, null, 2)}`,
    );

    const user = await this.userRepository.findById(
      new UniqueEntityID(request.userId),
    );

    if (!user) {
      this.logger.warn(
        GetUserUseCase.name,
        `Usuário com parametros ${JSON.stringify(request, null, 2)} não encontrado`,
      );
      throw new EntityNotFoundError('Usuário', request.userId);
    }

    return user;
  }
}
