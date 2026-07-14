"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const tokens_1 = require("./application/tokens");
const get_notification_status_use_case_1 = require("./application/use-cases/get-notification-status.use-case");
const send_notification_use_case_1 = require("./application/use-cases/send-notification.use-case");
const eventbridge_notification_publisher_1 = require("./infrastructure/messaging/eventbridge-notification.publisher");
const notification_request_model_1 = require("./infrastructure/persistence/notification-request.model");
const sequelize_notification_repository_1 = require("./infrastructure/persistence/sequelize-notification.repository");
const notifications_controller_1 = require("./interface/http/notifications.controller");
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([notification_request_model_1.NotificationRequestModel])],
        controllers: [notifications_controller_1.NotificationsController],
        providers: [
            send_notification_use_case_1.SendNotificationUseCase,
            get_notification_status_use_case_1.GetNotificationStatusUseCase,
            { provide: tokens_1.NOTIFICATION_REPOSITORY, useClass: sequelize_notification_repository_1.SequelizeNotificationRepository },
            {
                provide: tokens_1.NOTIFICATION_EVENT_PUBLISHER,
                useClass: eventbridge_notification_publisher_1.EventBridgeNotificationPublisher,
            },
        ],
    })
], NotificationsModule);
//# sourceMappingURL=notifications.module.js.map