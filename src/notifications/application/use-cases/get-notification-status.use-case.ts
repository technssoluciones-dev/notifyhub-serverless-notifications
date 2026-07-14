import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NotificationRepository } from '../../domain/ports';
import { NOTIFICATION_REPOSITORY } from '../tokens';

export interface GetNotificationStatusOutput {
  notificationId: string;
  status: string;
  attempts: number;
}

@Injectable()
export class GetNotificationStatusUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repository: NotificationRepository,
  ) {}

  async execute(notificationId: string): Promise<GetNotificationStatusOutput> {
    const request = await this.repository.findById(notificationId);

    if (!request) {
      throw new NotFoundException(
        `Notificacion ${notificationId} no encontrada`,
      );
    }

    const props = request.toProps();
    return {
      notificationId: props.id,
      status: props.status,
      attempts: props.attempts,
    };
  }
}
