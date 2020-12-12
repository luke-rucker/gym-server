const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(
    process.env.DATABASE_URL ||
        'postgres://postgres:password@localhost:5432/gym'
)

const modelDefiners = [require('./member.model')]

for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize, DataTypes)
}

if (process.env.NODE_ENV !== 'production') {
    sequelize.sync({ force: true })
}

module.exports = sequelize
