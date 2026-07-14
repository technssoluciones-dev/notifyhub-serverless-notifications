# NotifyHub

Plataforma serverless de notificaciones multi-canal y multi-tenant, construida con **NestJS** siguiendo **arquitectura hexagonal** (Ports & Adapters).

Diseñada para desplegarse sobre **AWS Lambda**, con **EventBridge** para mensajería asíncrona entre servicios y **SQS** para el procesamiento de notificaciones en segundo plano. Actualmente en desarrollo local, con la infraestructura preparada para despliegue serverless en AWS.

---

## 📐 Arquitectura

El proyecto sigue arquitectura hexagonal, separando el dominio de negocio de los detalles de infraestructura (framework, base de datos, mensajería). Esto permite testear la lógica de negocio sin dependencias externas y facilita cambiar de proveedor (ej. de EventBridge a otro broker) sin tocar el dominio.

```
┌─────────────────────────────────────────────────────────┐
│                     interface (adapters)                 │
│   HTTP Controllers · DTOs · Validación de entrada         │
└───────────────────────┬───────────────────────────────────┘
                         │
┌───────────────────────▼───────────────────────────────────┐
│                     application (casos de uso)             │
│   SendNotificationUseCase · GetNotificationStatusUseCase   │
└───────────────────────┬───────────────────────────────────┘
                         │
┌───────────────────────▼───────────────────────────────────┐
│                     domain (núcleo)                        │
│   NotificationRequest (entidad) · Ports (interfaces)        │
└───────────────────────┬───────────────────────────────────┘
                         │
┌───────────────────────▼───────────────────────────────────┐
│                  infrastructure (adapters)                 │
│   EventBridge Publisher · Sequelize Repository              │
└─────────────────────────────────────────────────────────────┘
```

### Estructura de carpetas

```
notifyhub-serverless-notifications/
├── config/
│   └── config.js                     # Config de Sequelize CLI (migraciones)
├── docker-compose.yml                # Entorno local (DB, etc.)
├── nest-cli.json
├── package.json
├── tsconfig.json
└── src/
    ├── main.ts                       # Bootstrap NestJS (modo servidor local)
    ├── app.module.ts
    ├── lambda/
    │   ├── http/
    │   │   └── api.handler.ts        # Entry point Lambda (API Gateway)
    │   └── worker/
    │       └── notification-worker.handler.ts  # Entry point Lambda (SQS)
    ├── shared/
    │   └── decorators/
    │       └── tenant-id.decorator.ts # Extrae el tenant del request
    └── notifications/
        ├── notifications.module.ts
        ├── domain/
        │   ├── notification-request.entity.ts
        │   ├── notification-request.entity.spec.ts
        │   └── ports.ts               # Interfaces (contratos) del dominio
        ├── application/
        │   ├── tokens.ts              # Tokens de inyección de dependencias
        │   └── use-cases/
        │       ├── send-notification.use-case.ts
        │       └── get-notification-status.use-case.ts
        ├── infrastructure/
        │   ├── messaging/
        │   │   └── eventbridge-notification.publisher.ts
        │   └── persistence/
        │       ├── notification-request.model.ts
        │       └── sequelize-notification.repository.ts
        └── interface/
            ├── dto/
            │   └── create-notification.dto.ts
            └── http/
                └── notifications.controller.ts
```

---

## 🚀 Stack técnico

| Capa | Tecnología |
|---|---|
| Framework | NestJS |
| Lenguaje | TypeScript |
| Persistencia | Sequelize (PostgreSQL) |
| Mensajería | AWS EventBridge |
| Procesamiento asíncrono | AWS SQS + Lambda Worker |
| Cómputo | AWS Lambda (API Gateway + Worker) |
| Multi-tenancy | Header/decorator de `tenant-id` |
| Testing | Jest (unit + e2e) |

---

## ⚙️ Instalación y uso local

### Requisitos previos
- Node.js 18+
- Docker (para levantar la base de datos local)
- GitHub CLI (opcional, para gestión del repo)

### Pasos

```powershell
# 1. Clonar el repositorio
git clone https://github.com/technssoluciones-dev/notifyhub-serverless-notifications.git
cd notifyhub-serverless-notifications

# 2. Instalar dependencias
npm install

# 3. Levantar servicios locales (DB, etc.)
docker-compose up -d

# 4. Correr migraciones
npx sequelize-cli db:migrate

# 5. Levantar el servidor en modo desarrollo
npm run start:dev
```

La API quedará disponible en `http://localhost:3000` (ajustar puerto según `main.ts`).

---

## 🧪 Testing

```powershell
# Tests unitarios
npm test

# Tests end-to-end
npm run test:e2e

# Build de producción
npm run build
```

---

## 📡 Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/notifications` | Crea y encola una nueva notificación multi-canal |
| `GET` | `/notifications/:id` | Consulta el estado de una notificación |

Todas las peticiones requieren un identificador de tenant (`tenant-id`) para aislamiento multi-tenant.

### Ejemplo de request

```http
POST /notifications
Content-Type: application/json
x-tenant-id: tenant-123

{
  "channel": "email",
  "recipient": "usuario@ejemplo.com",
  "message": "Tu pedido fue confirmado"
}
```

---

## ☁️ Despliegue en AWS (diseño)

El proyecto está preparado —pero aún no desplegado— para correr como arquitectura 100% serverless:

```
API Gateway → Lambda (api.handler) → EventBridge → SQS → Lambda (notification-worker.handler) → Canal de salida (email/SMS/push)
                     │
                     ▼
               RDS / Aurora (Sequelize)
```

- **`api.handler.ts`**: recibe requests HTTP vía API Gateway, delega al `NotificationsModule`.
- **EventBridge**: publica el evento de "notificación solicitada" de forma desacoplada.
- **SQS + `notification-worker.handler.ts`**: procesa el envío real de forma asíncrona, con reintentos automáticos.

Próximos pasos para despliegue: definir plantilla de infraestructura (SAM/CDK/Serverless Framework), configurar variables de entorno por ambiente, y conectar RDS/Aurora en la VPC correspondiente.

---

## 📄 Licencia

Este proyecto es de uso personal/portafolio bajo [technssoluciones-dev](https://github.com/technssoluciones-dev).
