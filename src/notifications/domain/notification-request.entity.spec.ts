import { NotificationRequest } from './notification-request.entity';

describe('NotificationRequest (domain)', () => {
  const validInput = {
    tenantId: 'tenant-1',
    channel: 'email' as const,
    recipient: 'cliente@empresa.com',
    templateId: 'a3f1e2b0-1234-4a5b-9c3d-000000000001',
    payload: { orderId: '123' },
  };

  it('crea la notificacion en estado pending con 0 intentos', () => {
    const request = NotificationRequest.create(validInput);

    expect(request.status).toBe('pending');
    expect(request.tenantId).toBe('tenant-1');
    expect(request.toProps().attempts).toBe(0);
    expect(request.id).toBeDefined();
  });

  it('lanza un error si el recipient esta vacio', () => {
    expect(() =>
      NotificationRequest.create({ ...validInput, recipient: '  ' }),
    ).toThrow('recipient es requerido');
  });

  it('lanza un error si falta templateId', () => {
    expect(() =>
      NotificationRequest.create({ ...validInput, templateId: '' }),
    ).toThrow('templateId es requerido');
  });

  it('transiciona de pending a queued correctamente', () => {
    const request = NotificationRequest.create(validInput);
    request.markQueued();
    expect(request.status).toBe('queued');
  });

  it('no permite pasar a queued si no esta en pending', () => {
    const request = NotificationRequest.create(validInput);
    request.markQueued();

    expect(() => request.markQueued()).toThrow(
      'No se puede pasar a queued desde el estado queued',
    );
  });

  it('marca como delivered', () => {
    const request = NotificationRequest.create(validInput);
    request.markQueued();
    request.markDelivered();
    expect(request.status).toBe('delivered');
  });

  it('pasa a retrying en los dos primeros fallos y a failed en el tercero', () => {
    const request = NotificationRequest.create(validInput);

    request.markFailed();
    expect(request.status).toBe('retrying');
    expect(request.toProps().attempts).toBe(1);

    request.markFailed();
    expect(request.status).toBe('retrying');
    expect(request.toProps().attempts).toBe(2);

    request.markFailed();
    expect(request.status).toBe('failed');
    expect(request.toProps().attempts).toBe(3);
  });

  it('restore reconstruye una entidad sin volver a validar invariantes de creacion', () => {
    const restored = NotificationRequest.restore({
      id: 'existing-id',
      tenantId: 'tenant-1',
      channel: 'webhook',
      recipient: 'https://tenant.com/webhook',
      templateId: 'tpl-1',
      payload: {},
      status: 'delivered',
      attempts: 1,
      createdAt: new Date('2026-01-01'),
    });

    expect(restored.id).toBe('existing-id');
    expect(restored.status).toBe('delivered');
  });
});
