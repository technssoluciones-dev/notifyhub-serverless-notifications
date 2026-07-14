import { Inject, Injectable } from '@nestjs/common';
import {
  NotificationChannel,
  NotificationRequest,
} from '../../domain/notification-request.entity';
import {
  NotificationEventPublisher,
  NotificationRepository,
} from '../../domain/ports';
import {
  NOTIFICATION_EVENT_PUBLISHER,
  NOTIFICATION_REPOSITORY,
} from '../tokens';

export interface SendNotificationInput {
  tenantId: string;
  channel: NotificationChannel;
  recipient: string;
  templateId: string;
  payload: Record<string, unknown>;
}

export interface SendNotificationOutput {
  notificationId: string;
  status: string;
}

@Injectable()
export class SendNotificationUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repository: NotificationRepository,
    @Inject(NOTIFICATION_EVENT_PUBLISHER)
    private readonly publisher: NotificationEventPublisher,
  ) {}

  async execute(
    input: SendNotificationInput,
  ): Promise<SendNotificationOutput> {
    const request = NotificationRequest.create(input);

    await this.repository.save(request);

    request.markQueued();
    await this.publisher.publishNotificationRequested(request);
    await this.repository.save(request);

    return { notificationId: request.id, status: request.status };
  }
}
