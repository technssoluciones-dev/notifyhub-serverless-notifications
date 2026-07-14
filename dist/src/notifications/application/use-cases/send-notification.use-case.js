"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendNotificationUseCase = void 0;
const common_1 = require("@nestjs/common");
const notification_request_entity_1 = require("../../domain/notification-request.entity");
const tokens_1 = require("../tokens");
let SendNotificationUseCase = class SendNotificationUseCase {
    constructor(repository, publisher) {
        this.repository = repository;
        this.publisher = publisher;
    }
    async execute(input) {
        const request = notification_request_entity_1.NotificationRequest.create(input);
        await this.repository.save(request);
        request.markQueued();
        await this.publisher.publishNotificationRequested(request);
        await this.repository.save(request);
        return { notificationId: request.id, status: request.status };
    }
};
exports.SendNotificationUseCase = SendNotificationUseCase;
exports.SendNotificationUseCase = SendNotificationUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(tokens_1.NOTIFICATION_REPOSITORY)),
    __param(1, (0, common_1.Inject)(tokens_1.NOTIFICATION_EVENT_PUBLISHER)),
    __metadata("design:paramtypes", [Object, Object])
], SendNotificationUseCase);
//# sourceMappingURL=send-notification.use-case.js.map