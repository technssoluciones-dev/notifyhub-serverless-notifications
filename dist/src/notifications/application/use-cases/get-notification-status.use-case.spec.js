"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const get_notification_status_use_case_1 = require("./get-notification-status.use-case");
const notification_request_entity_1 = require("../../domain/notification-request.entity");
describe('GetNotificationStatusUseCase', () => {
    let repository;
    let useCase;
    beforeEach(() => {
        repository = {
            save: jest.fn(),
            findById: jest.fn(),
        };
        useCase = new get_notification_status_use_case_1.GetNotificationStatusUseCase(repository);
    });
    it('retorna el estado y los intentos de una notificacion existente', async () => {
        const request = notification_request_entity_1.NotificationRequest.restore({
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
        await expect(useCase.execute('no-existe')).rejects.toThrow(common_1.NotFoundException);
    });
});
//# sourceMappingURL=get-notification-status.use-case.spec.js.map