import { GetNotificationStatusUseCase } from '../../application/use-cases/get-notification-status.use-case';
import { SendNotificationUseCase } from '../../application/use-cases/send-notification.use-case';
import { CreateNotificationDto } from '../dto/create-notification.dto';
export declare class NotificationsController {
    private readonly sendNotification;
    private readonly getStatus;
    constructor(sendNotification: SendNotificationUseCase, getStatus: GetNotificationStatusUseCase);
    create(tenantId: string, dto: CreateNotificationDto): Promise<import("../../application/use-cases/send-notification.use-case").SendNotificationOutput>;
    findStatus(id: string): Promise<import("../../application/use-cases/get-notification-status.use-case").GetNotificationStatusOutput>;
}
