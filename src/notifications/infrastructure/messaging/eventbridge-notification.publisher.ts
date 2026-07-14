import {
  EventBridgeClient,
  PutEventsCommand,
} from '@aws-sdk/client-eventbridge';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationRequest } from '../../domain/notification-request.entity';
import { NotificationEventPublisher } from '../../domain/ports';

@Injectable()
export class EventBridgeNotificationPublisher
  implements NotificationEventPublisher
{
  private readonly logger = new Logger(EventBridgeNotificationPublisher.name);
  private readonly client: EventBridgeClient;
  private readonly eventBusName: string;

  constructor(private readonly config: ConfigService) {
    this.client = new EventBridgeClient({
      region: this.config.get<string>('AWS_REGION', 'us-east-1'),
    });
    this.eventBusName = this.config.get<string>(
      'EVENT_BUS_NAME',
      'notifyhub-bus',
    );
  }

  async publishNotificationRequested(
    request: NotificationRequest,
  ): Promise<void> {
    const props = request.toProps();

    const command = new PutEventsCommand({
      Entries: [
        {
          Source: 'notifyhub.notifications',
          DetailType: 'NotificationRequested',
          EventBusName: this.eventBusName,
          Detail: JSON.stringify({
            notificationId: props.id,
            tenantId: props.tenantId,
            channel: props.channel,
            recipient: props.recipient,
            templateId: props.templateId,
            payload: props.payload,
          }),
        },
      ],
    });

    const result = await this.client.send(command);

    if (result.FailedEntryCount && result.FailedEntryCount > 0) {
      this.logger.error(
        `Fallo al publicar evento para notificacion ${props.id}`,
      );
      throw new Error('No se pudo publicar el evento en EventBridge');
    }
  }
}
