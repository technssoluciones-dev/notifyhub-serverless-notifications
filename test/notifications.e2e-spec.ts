import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { NOTIFICATION_EVENT_PUBLISHER } from '../src/notifications/application/tokens';

/**
 * Requiere Postgres corriendo (docker-compose up -d) porque AppModule
 * se conecta a la base real. El publisher de EventBridge se reemplaza
 * por un mock para no depender de credenciales de AWS en los tests.
 */
describe('Notifications (e2e)', () => {
  let app: INestApplication;
  const fakePublisher = {
    publishNotificationRequested: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(NOTIFICATION_EVENT_PUBLISHER)
      .useValue(fakePublisher)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /notifications crea una notificacion y devuelve estado queued', async () => {
    const response = await request(app.getHttpServer())
      .post('/notifications')
      .set('x-tenant-id', '11111111-1111-4111-8111-111111111111')
      .send({
        channel: 'email',
        recipient: 'cliente@empresa.com',
        templateId: 'a3f1e2b0-1234-4a5b-9c3d-000000000001',
        payload: { orderId: '999' },
      })
      .expect(201);

    expect(response.body.status).toBe('queued');
    expect(response.body.notificationId).toBeDefined();
    expect(fakePublisher.publishNotificationRequested).toHaveBeenCalled();
  });

  it('POST /notifications sin x-tenant-id devuelve 401', async () => {
    await request(app.getHttpServer())
      .post('/notifications')
      .send({
        channel: 'email',
        recipient: 'cliente@empresa.com',
        templateId: 'a3f1e2b0-1234-4a5b-9c3d-000000000001',
        payload: {},
      })
      .expect(401);
  });

  it('GET /notifications/:id devuelve 404 si no existe', async () => {
    await request(app.getHttpServer())
      .get('/notifications/00000000-0000-0000-0000-000000000000')
      .expect(404);
  });
});
