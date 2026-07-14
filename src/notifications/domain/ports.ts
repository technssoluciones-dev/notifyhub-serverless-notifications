import { NotificationRequest } from './notification-request.entity';

/**
 * Puerto de persistencia. La aplicacion depende de esta interfaz,
 * no de Sequelize directamente (Dependency Inversion).
 */
export interface NotificationRepository {
  save(request: NotificationRequest): Promise<void>;
  findById(id: string): Promise<NotificationRequest | null>;
}

/**
 * Puerto de mensajeria. La implementacion real usa EventBridge (AWS SDK v3),
 * pero la aplicacion solo conoce esta forma.
 */
export interface NotificationEventPublisher {
  publishNotificationRequested(request: NotificationRequest): Promise<void>;
}

/**
 * Puerto de estado rapido (idempotencia). Implementado con DynamoDB.
 */
export interface NotificationStatusStore {
  setStatus(notificationId: string, status: string): Promise<void>;
  getStatus(notificationId: string): Promise<string | null>;
}
