const { Sequelize, DataTypes } = require('sequelize')
const { applyExtraSetup } = require('./extra-setup')

const sequelize = new Sequelize(
    process.env.DATABASE_URL ||
        'postgres://postgres:password@localhost:5432/gym'
)

const modelDefiners = [require('./member.model'), require('./session.model')]

// Define all models according to their files
for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize, DataTypes)
}

// Only sync when not in production
if (process.env.NODE_ENV !== 'production') {
    sequelize.sync({ force: true })
}

// Execute any extra setup after the models are defined, such as adding associations
applyExtraSetup(sequelize)

module.exports = sequelize
