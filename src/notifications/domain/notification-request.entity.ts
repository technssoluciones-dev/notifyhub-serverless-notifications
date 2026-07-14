export type NotificationChannel = 'email' | 'webhook';

export type NotificationStatus =
  | 'pending'
  | 'queued'
  | 'delivered'
  | 'failed'
  | 'retrying';

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

/**
 * Entidad de dominio pura. No conoce Sequelize, AWS SDK ni HTTP.
 * Las reglas de negocio sobre transiciones de estado viven aca,
 * no en el controller ni en el repositorio.
 */
export class NotificationRequest {
  private constructor(private props: NotificationRequestProps) {}

  static create(input: {
    tenantId: string;
    channel: NotificationChannel;
    recipient: string;
    templateId: string;
    payload: Record<string, unknown>;
  }): NotificationRequest {
    if (!input.recipient || input.recipient.trim().length === 0) {
      throw new Error('recipient es requerido');
    }
    if (!input.templateId) {
      throw new Error('templateId es requerido');
    }

    return new NotificationRequest({
      id: crypto.randomUUID(),
      tenantId: input.tenantId,
      channel: input.channel,
      recipient: input.recipient,
      templateId: input.templateId,
      payload: input.payload ?? {},
      status: 'pending',
      attempts: 0,
      createdAt: new Date(),
    });
  }

  static restore(props: NotificationRequestProps): NotificationRequest {
    return new NotificationRequest(props);
  }

  markQueued(): void {
    if (this.props.status !== 'pending') {
      throw new Error(
        `No se puede pasar a queued desde el estado ${this.props.status}`,
      );
    }
    this.props.status = 'queued';
  }

  markDelivered(): void {
    this.props.status = 'delivered';
  }

  markFailed(): void {
    this.props.attempts += 1;
    this.props.status = this.props.attempts >= 3 ? 'failed' : 'retrying';
  }

  toProps(): NotificationRequestProps {
    return { ...this.props };
  }

  get id(): string {
    return this.props.id;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get status(): NotificationStatus {
    return this.props.status;
  }
}
