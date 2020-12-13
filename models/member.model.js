module.exports = (sequelize, DataTypes) => {
    sequelize.define('member', {
        firstName: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        profileImage: {
            type: DataTypes.TEXT,
        },
    })
}
