import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  NOTIFICATION_EVENT_PUBLISHER,
  NOTIFICATION_REPOSITORY,
} from './application/tokens';
import { GetNotificationStatusUseCase } from './application/use-cases/get-notification-status.use-case';
import { SendNotificationUseCase } from './application/use-cases/send-notification.use-case';
import { EventBridgeNotificationPublisher } from './infrastructure/messaging/eventbridge-notification.publisher';
import { NotificationRequestModel } from './infrastructure/persistence/notification-request.model';
import { SequelizeNotificationRepository } from './infrastructure/persistence/sequelize-notification.repository';
import { NotificationsController } from './interface/http/notifications.controller';

@Module({
  imports: [SequelizeModule.forFeature([NotificationRequestModel])],
  controllers: [NotificationsController],
  providers: [
    SendNotificationUseCase,
    GetNotificationStatusUseCase,
    { provide: NOTIFICATION_REPOSITORY, useClass: SequelizeNotificationRepository },
    {
      provide: NOTIFICATION_EVENT_PUBLISHER,
      useClass: EventBridgeNotificationPublisher,
    },
  ],
})
export class NotificationsModule {}
