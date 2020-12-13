function applyExtraSetup(sequelize) {
    const { member, session } = sequelize.models

    member.hasMany(session, { onDelete: 'CASCADE' })
    session.belongsTo(member)
}

module.exports = { applyExtraSetup }
