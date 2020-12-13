const { Sequelize } = require('sequelize')

// TODO: Potentially add an index to optimize active session and contact tracing queries
module.exports = (sequelize, DataTypes) => {
    sequelize.define(
        'session',
        {
            start: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.NOW,
            },
            finish: {
                type: DataTypes.DATE,
            },
        },
        {
            timestamps: false,
        }
    )
}
