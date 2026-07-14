'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notification_requests', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      tenant_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      channel: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      recipient: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      template_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      payload: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      attempts: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Indices utiles para las consultas mas frecuentes
    await queryInterface.addIndex('notification_requests', ['tenant_id']);
    await queryInterface.addIndex('notification_requests', ['status']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('notification_requests');
  },
};
