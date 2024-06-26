import { EventManager, Events } from '@/core/types/events';
import { Logger } from '@/shared/logger';
import { Injectable } from '@nestjs/common';
import { User } from '../../enterprise/entities/user';
import { GenerateConfirmationTokenUseCase } from '../use-cases/generate-confirmation-token';
import { Role } from '../../enterprise/entities/enums/role';

@Injectable()
export class OnUserCreated {
  constructor(
    private readonly events: EventManager,
    private readonly logger: Logger,
    private readonly generateConfirmationToken: GenerateConfirmationTokenUseCase,
  ) {
    this.logger.log(OnUserCreated.name, 'subscribing to user created event');
    this.events.subscribe(Events.USER_CREATED, (...args) =>
      this.handle(...args),
    );

    this.logger.log(
      OnUserCreated.name,
      `Subscribed to ${Events.USER_CREATED} event.`,
    );
  }

  async handle(user: User): Promise<void> {
    try {
      const isNormalUser = [Role.USER].includes(user.role);

      if (!isNormalUser) return;

      this.logger.log(
        OnUserCreated.name,
        `Generated confirmation token for user [${user.id.toString()}] ${user.email.value}`,
      );

      const confirmationToken = await this.generateConfirmationToken.execute({
        userId: user.id.toString(),
      });

      this.logger.log(
        OnUserCreated.name,
        `Confirmation token ${confirmationToken.id.toString()} generated for user [${user.id.toString()}] ${user.email.value}`,
      );

      await this.events.publish(
        Events.CONFIRMATION_TOKEN_CREATED,
        confirmationToken,
      );

      this.logger.log(
        OnUserCreated.name,
        `Confirmation token ${confirmationToken.id.toString()} published for user [${user.id.toString()}] ${user.email.value}`,
      );
    } catch (error: any) {
      this.logger.error(
        OnUserCreated.name,
        `Error generating confirmation token for user [${user.id.toString()}] ${user.email.value}: ${error.message}`,
        error.stack,
      );
    }
  }
}
