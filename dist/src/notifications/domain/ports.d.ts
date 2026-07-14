import { NotificationRequest } from './notification-request.entity';
export interface NotificationRepository {
    save(request: NotificationRequest): Promise<void>;
    findById(id: string): Promise<NotificationRequest | null>;
}
export interface NotificationEventPublisher {
    publishNotificationRequested(request: NotificationRequest): Promise<void>;
}
export interface NotificationStatusStore {
    setStatus(notificationId: string, status: string): Promise<void>;
    getStatus(notificationId: string): Promise<string | null>;
}
