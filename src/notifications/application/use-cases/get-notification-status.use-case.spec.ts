import { NotFoundException } from '@nestjs/common';
import { GetNotificationStatusUseCase } from './get-notification-status.use-case';
import { NotificationRepository } from '../../domain/ports';
import { NotificationRequest } from '../../domain/notification-request.entity';

describe('GetNotificationStatusUseCase', () => {
  let repository: jest.Mocked<NotificationRepository>;
  let useCase: GetNotificationStatusUseCase;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findById: jest.fn(),
    };
    useCase = new GetNotificationStatusUseCase(repository);
  });

  it('retorna el estado y los intentos de una notificacion existente', async () => {
    const request = NotificationRequest.restore({
      id: 'notif-1',
      tenantId: 'tenant-1',
      channel: 'email',
      recipient: 'cliente@empresa.com',
      templateId: 'tpl-1',
      payload: {},
      status: 'delivered',
      attempts: 1,
      createdAt: new Date('2026-01-01'),
    });
    repository.findById.mockResolvedValue(request);

    const result = await useCase.execute('notif-1');

    expect(result).toEqual({
      notificationId: 'notif-1',
      status: 'delivered',
      attempts: 1,
    });
  });

  it('lanza NotFoundException si la notificacion no existe', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute('no-existe')).rejects.toThrow(
      NotFoundException,
    );
  });
});
