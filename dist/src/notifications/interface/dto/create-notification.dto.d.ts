export declare class CreateNotificationDto {
    channel: 'email' | 'webhook';
    recipient: string;
    templateId: string;
    payload: Record<string, unknown>;
}
