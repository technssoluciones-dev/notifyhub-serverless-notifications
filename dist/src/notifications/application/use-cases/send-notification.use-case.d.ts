import { NotificationChannel } from '../../domain/notification-request.entity';
import { NotificationEventPublisher, NotificationRepository } from '../../domain/ports';
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
export declare class SendNotificationUseCase {
    private readonly repository;
    private readonly publisher;
    constructor(repository: NotificationRepository, publisher: NotificationEventPublisher);
    execute(input: SendNotificationInput): Promise<SendNotificationOutput>;
}
