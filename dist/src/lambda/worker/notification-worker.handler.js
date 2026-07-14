"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const ddbClient = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({ region: process.env.AWS_REGION ?? 'us-east-1' }));
const STATUS_TABLE = process.env.STATUS_TABLE_NAME ?? 'notifyhub-status';
const handler = async (event, _context) => {
    const batchItemFailures = [];
    for (const record of event.Records) {
        try {
            const detail = JSON.parse(record.body);
            await deliver(detail);
            await updateStatus(detail.notificationId, 'delivered');
        }
        catch (error) {
            console.error(`Error procesando mensaje ${record.messageId}`, error);
            try {
                const detail = JSON.parse(record.body);
                await updateStatus(detail.notificationId, 'retrying');
            }
            catch {
            }
            batchItemFailures.push({ itemIdentifier: record.messageId });
        }
    }
    return { batchItemFailures };
};
exports.handler = handler;
async function deliver(detail) {
    if (detail.channel === 'email') {
        console.log(`Enviando email a ${detail.recipient}`);
        return;
    }
    if (detail.channel === 'webhook') {
        console.log(`Enviando webhook a ${detail.recipient}`);
        return;
    }
    throw new Error(`Canal no soportado: ${detail.channel}`);
}
async function updateStatus(notificationId, status) {
    await ddbClient.send(new lib_dynamodb_1.UpdateCommand({
        TableName: STATUS_TABLE,
        Key: { notificationId },
        UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: {
            ':status': status,
            ':updatedAt': new Date().toISOString(),
        },
    }));
}
//# sourceMappingURL=notification-worker.handler.js.map