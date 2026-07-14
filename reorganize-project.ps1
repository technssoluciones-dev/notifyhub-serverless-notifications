<#
.SYNOPSIS
    Reordena el proyecto NotifyHub (NestJS) desde una estructura plana
    hacia una arquitectura hexagonal (domain/application/infrastructure/interface).

.DESCRIPTION
    Ejecutar este script DESDE LA RAIZ del proyecto, donde hoy estan todos
    los archivos .ts / .js / .json / .yml sueltos.

    El script:
      1. Crea la estructura de carpetas destino.
      2. Mueve cada archivo a su carpeta correspondiente usando `git mv`
         si el repo tiene git inicializado (preserva el historial),
         o `Move-Item` si no.
      3. No modifica ningun import: las rutas relativas de cada archivo
         ya estan escritas asumiendo esta estructura de carpetas.

.NOTES
    Revisa el resultado con `git status` antes de hacer commit.
#>

$ErrorActionPreference = "Stop"

function Move-ProjectFile {
    param(
        [string]$Source,
        [string]$Destination
    )

    if (-not (Test-Path $Source)) {
        Write-Warning "No encontrado (se omite): $Source"
        return
    }

    $destDir = Split-Path $Destination -Parent
    if ($destDir -and -not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }

    $isGitRepo = Test-Path ".git"
    if ($isGitRepo) {
        git mv --force $Source $Destination
    } else {
        Move-Item -Path $Source -Destination $Destination -Force
    }

    Write-Host "OK: $Source -> $Destination"
}

# --- Carpetas base ---
$dirs = @(
    "config",
    "src",
    "src/lambda/http",
    "src/lambda/worker",
    "src/shared/decorators",
    "src/notifications/domain",
    "src/notifications/application/use-cases",
    "src/notifications/infrastructure/messaging",
    "src/notifications/infrastructure/persistence",
    "src/notifications/interface/dto",
    "src/notifications/interface/http"
)
foreach ($d in $dirs) {
    if (-not (Test-Path $d)) {
        New-Item -ItemType Directory -Path $d -Force | Out-Null
    }
}

# --- Archivos raiz del proyecto (se quedan en la raiz) ---
# docker-compose.yml, nest-cli.json, package.json, tsconfig.json ya estan en la raiz, no se mueven.

# --- config/ ---
Move-ProjectFile "config.js" "config/config.js"

# --- src/ (entry point) ---
Move-ProjectFile "main.ts" "src/main.ts"
Move-ProjectFile "app.module.ts" "src/app.module.ts"

# --- src/lambda/ ---
Move-ProjectFile "api.handler.ts" "src/lambda/http/api.handler.ts"
Move-ProjectFile "notification-worker.handler.ts" "src/lambda/worker/notification-worker.handler.ts"

# --- src/shared/ ---
Move-ProjectFile "tenant-id.decorator.ts" "src/shared/decorators/tenant-id.decorator.ts"

# --- src/notifications/ (modulo) ---
Move-ProjectFile "notifications.module.ts" "src/notifications/notifications.module.ts"

# domain
Move-ProjectFile "notification-request.entity.ts" "src/notifications/domain/notification-request.entity.ts"
Move-ProjectFile "notification-request.entity.spec.ts" "src/notifications/domain/notification-request.entity.spec.ts"
Move-ProjectFile "ports.ts" "src/notifications/domain/ports.ts"

# application
Move-ProjectFile "tokens.ts" "src/notifications/application/tokens.ts"
Move-ProjectFile "send-notification.use-case.ts" "src/notifications/application/use-cases/send-notification.use-case.ts"
Move-ProjectFile "get-notification-status.use-case.ts" "src/notifications/application/use-cases/get-notification-status.use-case.ts"

# infrastructure
Move-ProjectFile "eventbridge-notification.publisher.ts" "src/notifications/infrastructure/messaging/eventbridge-notification.publisher.ts"
Move-ProjectFile "notification-request.model.ts" "src/notifications/infrastructure/persistence/notification-request.model.ts"
Move-ProjectFile "sequelize-notification.repository.ts" "src/notifications/infrastructure/persistence/sequelize-notification.repository.ts"

# interface
Move-ProjectFile "create-notification.dto.ts" "src/notifications/interface/dto/create-notification.dto.ts"
Move-ProjectFile "notifications.controller.ts" "src/notifications/interface/http/notifications.controller.ts"

Write-Host ""
Write-Host "Reorganizacion completa. Verifica con 'git status' y luego corre:"
Write-Host "  npm run build"
Write-Host "  npm test"
