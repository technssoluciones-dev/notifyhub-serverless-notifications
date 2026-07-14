require('dotenv').config();

const common = {
  username: process.env.DB_USER ?? 'notifyhub',
  password: process.env.DB_PASSWORD ?? 'notifyhub',
  database: process.env.DB_NAME ?? 'notifyhub',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  dialect: 'postgres',
};

module.exports = {
  development: common,
  test: { ...common, database: `${common.database}_test`, logging: false },
  production: { ...common, logging: false },
};
