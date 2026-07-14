import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  NotificationChannel,
  NotificationRequest,
  NotificationStatus,
} from '../../domain/notification-request.entity';
import { NotificationRepository } from '../../domain/ports';
import { NotificationRequestModel } from './notification-request.model';

@Injectable()
export class SequelizeNotificationRepository
  implements NotificationRepository
{
  constructor(
    @InjectModel(NotificationRequestModel)
    private readonly model: typeof NotificationRequestModel,
  ) {}

  async save(request: NotificationRequest): Promise<void> {
    const props = request.toProps();
    await this.model.upsert({
      id: props.id,
      tenantId: props.tenantId,
      channel: props.channel,
      recipient: props.recipient,
      templateId: props.templateId,
      payload: props.payload,
      status: props.status,
      attempts: props.attempts,
      createdAt: props.createdAt,
    });
  }

  async findById(id: string): Promise<NotificationRequest | null> {
    const row = await this.model.findByPk(id);
    if (!row) return null;

    return NotificationRequest.restore({
      id: row.id,
      tenantId: row.tenantId,
      channel: row.channel as NotificationChannel,
      recipient: row.recipient,
      templateId: row.templateId,
      payload: row.payload,
      status: row.status as NotificationStatus,
      attempts: row.attempts,
      createdAt: row.createdAt,
    });
  }
}
