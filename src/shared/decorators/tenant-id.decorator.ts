import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * En produccion el tenantId viene de los claims del authorizer de Cognito
 * (API Gateway los inyecta en requestContext.authorizer.jwt.claims).
 * En local, se acepta el header x-tenant-id para facilitar el desarrollo.
 */
export const TenantId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const claimTenant = (
      request as unknown as {
        apiGateway?: {
          event?: {
            requestContext?: {
              authorizer?: { jwt?: { claims?: { tenant_id?: string } } };
            };
          };
        };
      }
    ).apiGateway?.event?.requestContext?.authorizer?.jwt?.claims?.tenant_id;

    const headerTenant = request.header('x-tenant-id');
    const tenantId = claimTenant ?? headerTenant;

    if (!tenantId) {
      throw new UnauthorizedException('tenantId no encontrado en la solicitud');
    }

    return tenantId;
  },
);
