import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import {
  Context,
  SQSBatchItemFailure,
  SQSBatchResponse,
  SQSEvent,
} from 'aws-lambda';

const ddbClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: process.env.AWS_REGION ?? 'us-east-1' }),
);

const STATUS_TABLE = process.env.STATUS_TABLE_NAME ?? 'notifyhub-status';

interface NotificationDetail {
  notificationId: string;
  tenantId: string;
  channel: 'email' | 'webhook';
  recipient: string;
  templateId: string;
  payload: Record<string, unknown>;
}

/**
 * Cada mensaje de la cola representa una notificacion pendiente.
 *
 * Usamos "partial batch failure" (reportBatchItemFailures): si un mensaje
 * falla, solo ese mensaje vuelve a la cola para reintento; el resto del
 * batch se marca como procesado. Esto evita que un solo mensaje "malo"
 * bloquee o duplique el reprocesamiento de todo el batch, y requiere
 * habilitar `functionResponseTypes: [ReportBatchItemFailures]` en el
 * event source mapping de Terraform.
 */
export const handler = async (
  event: SQSEvent,
  _context: Context,
): Promise<SQSBatchResponse> => {
  const batchItemFailures: SQSBatchItemFailure[] = [];

  for (const record of event.Records) {
    try {
      const detail: NotificationDetail = JSON.parse(record.body);
      await deliver(detail);
      await updateStatus(detail.notificationId, 'delivered');
    } catch (error) {
      console.error(`Error procesando mensaje ${record.messageId}`, error);
      try {
        const detail: NotificationDetail = JSON.parse(record.body);
        await updateStatus(detail.notificationId, 'retrying');
      } catch {
        // si ni siquiera se puede parsear el body, no hay id que actualizar
      }
      batchItemFailures.push({ itemIdentifier: record.messageId });
    }
  }

  return { batchItemFailures };
};

async function deliver(detail: NotificationDetail): Promise<void> {
  if (detail.channel === 'email') {
    // Aqui iria la llamada real a SNS o a un proveedor de email transaccional.
    console.log(`Enviando email a ${detail.recipient}`);
    return;
  }

  if (detail.channel === 'webhook') {
    // Aqui iria un fetch/axios POST al endpoint del tenant con backoff.
    console.log(`Enviando webhook a ${detail.recipient}`);
    return;
  }

  throw new Error(`Canal no soportado: ${detail.channel}`);
}

async function updateStatus(
  notificationId: string,
  status: string,
): Promise<void> {
  await ddbClient.send(
    new UpdateCommand({
      TableName: STATUS_TABLE,
      Key: { notificationId },
      UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: {
        ':status': status,
        ':updatedAt': new Date().toISOString(),
      },
    }),
  );
}
