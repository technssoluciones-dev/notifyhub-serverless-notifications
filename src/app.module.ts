import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? 'notifyhub',
      password: process.env.DB_PASSWORD ?? 'notifyhub',
      database: process.env.DB_NAME ?? 'notifyhub',
      autoLoadModels: true,
      synchronize: false, // las migraciones de sequelize-cli manejan el esquema
      logging: false,
    }),
    NotificationsModule,
  ],
})
export class AppModule {}
