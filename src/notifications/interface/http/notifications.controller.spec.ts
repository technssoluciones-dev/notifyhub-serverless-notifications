import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { SendNotificationUseCase } from '../../application/use-cases/send-notification.use-case';
import { GetNotificationStatusUseCase } from '../../application/use-cases/get-notification-status.use-case';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let sendNotification: jest.Mocked<SendNotificationUseCase>;
  let getStatus: jest.Mocked<GetNotificationStatusUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: SendNotificationUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetNotificationStatusUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get(NotificationsController);
    sendNotification = module.get(SendNotificationUseCase);
    getStatus = module.get(GetNotificationStatusUseCase);
  });

  it('delega la creacion en SendNotificationUseCase inyectando el tenantId', async () => {
    sendNotification.execute.mockResolvedValue({
      notificationId: 'notif-1',
      status: 'queued',
    });

    const result = await controller.create('tenant-1', {
      channel: 'email',
      recipient: 'cliente@empresa.com',
      templateId: 'tpl-1',
      payload: {},
    });

    expect(sendNotification.execute).toHaveBeenCalledWith({
      tenantId: 'tenant-1',
      channel: 'email',
      recipient: 'cliente@empresa.com',
      templateId: 'tpl-1',
      payload: {},
    });
    expect(result.status).toBe('queued');
  });

  it('delega la consulta de estado en GetNotificationStatusUseCase', async () => {
    getStatus.execute.mockResolvedValue({
      notificationId: 'notif-1',
      status: 'delivered',
      attempts: 1,
    });

    const result = await controller.findStatus('notif-1');

    expect(getStatus.execute).toHaveBeenCalledWith('notif-1');
    expect(result.status).toBe('delivered');
  });
});
