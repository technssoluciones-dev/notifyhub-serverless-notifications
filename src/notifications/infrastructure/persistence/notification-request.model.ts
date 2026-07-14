import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'notification_requests', timestamps: false })
export class NotificationRequestModel extends Model {
  @PrimaryKey
  @Column(DataType.UUID)
  id!: string;

  @Column({ field: 'tenant_id', type: DataType.UUID, allowNull: false })
  tenantId!: string;

  @Column({ type: DataType.STRING(20), allowNull: false })
  channel!: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  recipient!: string;

  @Column({ field: 'template_id', type: DataType.UUID, allowNull: false })
  templateId!: string;

  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: {} })
  payload!: Record<string, unknown>;

  @Column({ type: DataType.STRING(20), allowNull: false })
  status!: string;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
  attempts!: number;

  @Column({ field: 'created_at', type: DataType.DATE, allowNull: false })
  createdAt!: Date;
}
