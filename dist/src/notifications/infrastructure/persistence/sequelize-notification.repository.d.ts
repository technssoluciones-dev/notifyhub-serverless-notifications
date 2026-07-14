import { NotificationRequest } from '../../domain/notification-request.entity';
import { NotificationRepository } from '../../domain/ports';
import { NotificationRequestModel } from './notification-request.model';
export declare class SequelizeNotificationRepository implements NotificationRepository {
    private readonly model;
    constructor(model: typeof NotificationRequestModel);
    save(request: NotificationRequest): Promise<void>;
    findById(id: string): Promise<NotificationRequest | null>;
}
