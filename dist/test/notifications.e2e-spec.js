"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("../src/app.module");
const tokens_1 = require("../src/notifications/application/tokens");
describe('Notifications (e2e)', () => {
    let app;
    const fakePublisher = {
        publishNotificationRequested: jest.fn().mockResolvedValue(undefined),
    };
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        })
            .overrideProvider(tokens_1.NOTIFICATION_EVENT_PUBLISHER)
            .useValue(fakePublisher)
            .compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    it('POST /notifications crea una notificacion y devuelve estado queued', async () => {
        const response = await (0, supertest_1.default)(app.getHttpServer())
            .post('/notifications')
            .set('x-tenant-id', 'tenant-e2e')
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
        await (0, supertest_1.default)(app.getHttpServer())
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
        await (0, supertest_1.default)(app.getHttpServer())
            .get('/notifications/00000000-0000-0000-0000-000000000000')
            .expect(404);
    });
});
//# sourceMappingURL=notifications.e2e-spec.js.map