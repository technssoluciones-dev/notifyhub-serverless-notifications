"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const send_notification_use_case_1 = require("./send-notification.use-case");
describe('SendNotificationUseCase', () => {
    let repository;
    let publisher;
    let useCase;
    const input = {
        tenantId: 'tenant-1',
        channel: 'email',
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
        useCase = new send_notification_use_case_1.SendNotificationUseCase(repository, publisher);
    });
    it('guarda la notificacion, la marca como queued y publica el evento', async () => {
        const result = await useCase.execute(input);
        expect(repository.save).toHaveBeenCalledTimes(2);
        expect(publisher.publishNotificationRequested).toHaveBeenCalledTimes(1);
        expect(result.status).toBe('queued');
        expect(result.notificationId).toBeDefined();
    });
    it('guarda primero en pending y luego en queued, en ese orden', async () => {
        const savedStatuses = [];
        repository.save.mockImplementation(async (req) => {
            savedStatuses.push(req.toProps().status);
        });
        await useCase.execute(input);
        expect(savedStatuses).toEqual(['pending', 'queued']);
    });
    it('propaga el error si el publisher falla, sin marcar como queued', async () => {
        publisher.publishNotificationRequested.mockRejectedValue(new Error('EventBridge no disponible'));
        await expect(useCase.execute(input)).rejects.toThrow('EventBridge no disponible');
        expect(repository.save).toHaveBeenCalledTimes(1);
    });
});
//# sourceMappingURL=send-notification.use-case.spec.js.map