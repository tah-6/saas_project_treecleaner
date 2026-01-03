const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Subscription = sequelize.define('Subscription', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    serviceName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        defaultValue: 'OTHER'
    },
    billingDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    billingFrequency: {
        type: DataTypes.STRING,
        defaultValue: 'MONTHLY'
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true
    }
});

module.exports = Subscription;
