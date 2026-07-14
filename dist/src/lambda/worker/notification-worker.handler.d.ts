import { Context, SQSBatchResponse, SQSEvent } from 'aws-lambda';
export declare const handler: (event: SQSEvent, _context: Context) => Promise<SQSBatchResponse>;
