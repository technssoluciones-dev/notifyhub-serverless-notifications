import { ConfigService } from '@nestjs/config';
import { NotificationRequest } from '../../domain/notification-request.entity';
import { NotificationEventPublisher } from '../../domain/ports';
export declare class EventBridgeNotificationPublisher implements NotificationEventPublisher {
    private readonly config;
    private readonly logger;
    private readonly client;
    private readonly eventBusName;
    constructor(config: ConfigService);
    publishNotificationRequested(request: NotificationRequest): Promise<void>;
}
