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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRequestModel = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let NotificationRequestModel = class NotificationRequestModel extends sequelize_typescript_1.Model {
};
exports.NotificationRequestModel = NotificationRequestModel;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.UUID),
    __metadata("design:type", String)
], NotificationRequestModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ field: 'tenant_id', type: sequelize_typescript_1.DataType.UUID, allowNull: false }),
    __metadata("design:type", String)
], NotificationRequestModel.prototype, "tenantId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(20), allowNull: false }),
    __metadata("design:type", String)
], NotificationRequestModel.prototype, "channel", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: false }),
    __metadata("design:type", String)
], NotificationRequestModel.prototype, "recipient", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ field: 'template_id', type: sequelize_typescript_1.DataType.UUID, allowNull: false }),
    __metadata("design:type", String)
], NotificationRequestModel.prototype, "templateId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false, defaultValue: {} }),
    __metadata("design:type", Object)
], NotificationRequestModel.prototype, "payload", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(20), allowNull: false }),
    __metadata("design:type", String)
], NotificationRequestModel.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false, defaultValue: 0 }),
    __metadata("design:type", Number)
], NotificationRequestModel.prototype, "attempts", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ field: 'created_at', type: sequelize_typescript_1.DataType.DATE, allowNull: false }),
    __metadata("design:type", Date)
], NotificationRequestModel.prototype, "createdAt", void 0);
exports.NotificationRequestModel = NotificationRequestModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'notification_requests', timestamps: false })
], NotificationRequestModel);
//# sourceMappingURL=notification-request.model.js.map