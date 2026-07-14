"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantId = void 0;
const common_1 = require("@nestjs/common");
exports.TenantId = (0, common_1.createParamDecorator)((_data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const claimTenant = request.apiGateway?.event?.requestContext?.authorizer?.jwt?.claims?.tenant_id;
    const headerTenant = request.header('x-tenant-id');
    const tenantId = claimTenant ?? headerTenant;
    if (!tenantId) {
        throw new common_1.UnauthorizedException('tenantId no encontrado en la solicitud');
    }
    return tenantId;
});
//# sourceMappingURL=tenant-id.decorator.js.map