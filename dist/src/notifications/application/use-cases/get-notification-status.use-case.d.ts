import { NotificationRepository } from '../../domain/ports';
export interface GetNotificationStatusOutput {
    notificationId: string;
    status: string;
    attempts: number;
}
export declare class GetNotificationStatusUseCase {
    private readonly repository;
    constructor(repository: NotificationRepository);
    execute(notificationId: string): Promise<GetNotificationStatusOutput>;
}
