import { Model } from 'sequelize-typescript';
export declare class NotificationRequestModel extends Model {
    id: string;
    tenantId: string;
    channel: string;
    recipient: string;
    templateId: string;
    payload: Record<string, unknown>;
    status: string;
    attempts: number;
    createdAt: Date;
}
