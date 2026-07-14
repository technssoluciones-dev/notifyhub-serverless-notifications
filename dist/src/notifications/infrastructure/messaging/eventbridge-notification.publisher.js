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
var EventBridgeNotificationPublisher_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBridgeNotificationPublisher = void 0;
const client_eventbridge_1 = require("@aws-sdk/client-eventbridge");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let EventBridgeNotificationPublisher = EventBridgeNotificationPublisher_1 = class EventBridgeNotificationPublisher {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(EventBridgeNotificationPublisher_1.name);
        this.client = new client_eventbridge_1.EventBridgeClient({
            region: this.config.get('AWS_REGION', 'us-east-1'),
        });
        this.eventBusName = this.config.get('EVENT_BUS_NAME', 'notifyhub-bus');
    }
    async publishNotificationRequested(request) {
        const props = request.toProps();
        const command = new client_eventbridge_1.PutEventsCommand({
            Entries: [
                {
                    Source: 'notifyhub.notifications',
                    DetailType: 'NotificationRequested',
                    EventBusName: this.eventBusName,
                    Detail: JSON.stringify({
                        notificationId: props.id,
                        tenantId: props.tenantId,
                        channel: props.channel,
                        recipient: props.recipient,
                        templateId: props.templateId,
                        payload: props.payload,
                    }),
                },
            ],
        });
        const result = await this.client.send(command);
        if (result.FailedEntryCount && result.FailedEntryCount > 0) {
            this.logger.error(`Fallo al publicar evento para notificacion ${props.id}`);
            throw new Error('No se pudo publicar el evento en EventBridge');
        }
    }
};
exports.EventBridgeNotificationPublisher = EventBridgeNotificationPublisher;
exports.EventBridgeNotificationPublisher = EventBridgeNotificationPublisher = EventBridgeNotificationPublisher_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EventBridgeNotificationPublisher);
//# sourceMappingURL=eventbridge-notification.publisher.js.map