import { SendNotificationUseCase } from './send-notification.use-case';
import {
  NotificationEventPublisher,
  NotificationRepository,
} from '../../domain/ports';

describe('SendNotificationUseCase', () => {
  let repository: jest.Mocked<NotificationRepository>;
  let publisher: jest.Mocked<NotificationEventPublisher>;
  let useCase: SendNotificationUseCase;

  const input = {
    tenantId: 'tenant-1',
    channel: 'email' as const,
    recipient: 'cliente@empresa.com',
    templateId: 'a3f1e2b0-1234-4a5b-9c3d-000000000001',
    payload: { orderId: '123' },
  };

  beforeEach(() => {
    repository = {
      save: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn(),
    };
    publisher = {
      publishNotificationRequested: jest.fn().mockResolvedValue(undefined),
    };
    useCase = new SendNotificationUseCase(repository, publisher);
  });

  it('guarda la notificacion, la marca como queued y publica el evento', async () => {
    const result = await useCase.execute(input);

    expect(repository.save).toHaveBeenCalledTimes(2);
    expect(publisher.publishNotificationRequested).toHaveBeenCalledTimes(1);
    expect(result.status).toBe('queued');
    expect(result.notificationId).toBeDefined();
  });

  it('guarda primero en pending y luego en queued, en ese orden', async () => {
    const savedStatuses: string[] = [];
    repository.save.mockImplementation(async (req) => {
      savedStatuses.push(req.toProps().status);
    });

    await useCase.execute(input);

    expect(savedStatuses).toEqual(['pending', 'queued']);
  });

  it('propaga el error si el publisher falla, sin marcar como queued', async () => {
    publisher.publishNotificationRequested.mockRejectedValue(
      new Error('EventBridge no disponible'),
    );

    await expect(useCase.execute(input)).rejects.toThrow(
      'EventBridge no disponible',
    );
    // Solo se alcanzo a guardar el estado pending inicial
    expect(repository.save).toHaveBeenCalledTimes(1);
  });
});
