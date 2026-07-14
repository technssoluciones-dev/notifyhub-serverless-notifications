"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRequest = void 0;
class NotificationRequest {
    constructor(props) {
        this.props = props;
    }
    static create(input) {
        if (!input.recipient || input.recipient.trim().length === 0) {
            throw new Error('recipient es requerido');
        }
        if (!input.templateId) {
            throw new Error('templateId es requerido');
        }
        return new NotificationRequest({
            id: crypto.randomUUID(),
            tenantId: input.tenantId,
            channel: input.channel,
            recipient: input.recipient,
            templateId: input.templateId,
            payload: input.payload ?? {},
            status: 'pending',
            attempts: 0,
            createdAt: new Date(),
        });
    }
    static restore(props) {
        return new NotificationRequest(props);
    }
    markQueued() {
        if (this.props.status !== 'pending') {
            throw new Error(`No se puede pasar a queued desde el estado ${this.props.status}`);
        }
        this.props.status = 'queued';
    }
    markDelivered() {
        this.props.status = 'delivered';
    }
    markFailed() {
        this.props.attempts += 1;
        this.props.status = this.props.attempts >= 3 ? 'failed' : 'retrying';
    }
    toProps() {
        return { ...this.props };
    }
    get id() {
        return this.props.id;
    }
    get tenantId() {
        return this.props.tenantId;
    }
    get status() {
        return this.props.status;
    }
}
exports.NotificationRequest = NotificationRequest;
//# sourceMappingURL=notification-request.entity.js.map