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
exports.SequelizeNotificationRepository = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const notification_request_entity_1 = require("../../domain/notification-request.entity");
const notification_request_model_1 = require("./notification-request.model");
let SequelizeNotificationRepository = class SequelizeNotificationRepository {
    constructor(model) {
        this.model = model;
    }
    async save(request) {
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
    async findById(id) {
        const row = await this.model.findByPk(id);
        if (!row)
            return null;
        return notification_request_entity_1.NotificationRequest.restore({
            id: row.id,
            tenantId: row.tenantId,
            channel: row.channel,
            recipient: row.recipient,
            templateId: row.templateId,
            payload: row.payload,
            status: row.status,
            attempts: row.attempts,
            createdAt: row.createdAt,
        });
    }
};
exports.SequelizeNotificationRepository = SequelizeNotificationRepository;
exports.SequelizeNotificationRepository = SequelizeNotificationRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(notification_request_model_1.NotificationRequestModel)),
    __metadata("design:paramtypes", [Object])
], SequelizeNotificationRepository);
//# sourceMappingURL=sequelize-notification.repository.js.map