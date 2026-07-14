import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetNotificationStatusUseCase } from '../../application/use-cases/get-notification-status.use-case';
import { SendNotificationUseCase } from '../../application/use-cases/send-notification.use-case';
import { TenantId } from '../../../shared/decorators/tenant-id.decorator';
import { CreateNotificationDto } from '../dto/create-notification.dto';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly sendNotification: SendNotificationUseCase,
    private readonly getStatus: GetNotificationStatusUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Encola una notificacion para ser enviada por el canal indicado',
  })
  async create(
    @TenantId() tenantId: string,
    @Body() dto: CreateNotificationDto,
  ) {
    return this.sendNotification.execute({ tenantId, ...dto });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consulta el estado de una notificacion' })
  async findStatus(@Param('id') id: string) {
    return this.getStatus.execute(id);
  }
}
