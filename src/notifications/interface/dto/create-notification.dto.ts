import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsObject,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ example: 'email', enum: ['email', 'webhook'] })
  @IsIn(['email', 'webhook'])
  channel!: 'email' | 'webhook';

  @ApiProperty({ example: 'cliente@empresa.com' })
  @IsString()
  @IsNotEmpty()
  recipient!: string;

  @ApiProperty({ example: 'a3f1e2b0-1234-4a5b-9c3d-000000000001' })
  @IsUUID()
  templateId!: string;

  @ApiProperty({
    example: { orderId: '12345', total: 49990 },
    description: 'Variables dinamicas que se inyectan en la plantilla',
  })
  @IsObject()
  payload!: Record<string, unknown>;
}
