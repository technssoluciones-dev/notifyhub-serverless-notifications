export type NotificationChannel = 'email' | 'webhook';
export type NotificationStatus = 'pending' | 'queued' | 'delivered' | 'failed' | 'retrying';
export interface NotificationRequestProps {
    id: string;
    tenantId: string;
    channel: NotificationChannel;
    recipient: string;
    templateId: string;
    payload: Record<string, unknown>;
    status: NotificationStatus;
    attempts: number;
    createdAt: Date;
}
export declare class NotificationRequest {
    private props;
    private constructor();
    static create(input: {
        tenantId: string;
        channel: NotificationChannel;
        recipient: string;
        templateId: string;
        payload: Record<string, unknown>;
    }): NotificationRequest;
    static restore(props: NotificationRequestProps): NotificationRequest;
    markQueued(): void;
    markDelivered(): void;
    markFailed(): void;
    toProps(): NotificationRequestProps;
    get id(): string;
    get tenantId(): string;
    get status(): NotificationStatus;
}
