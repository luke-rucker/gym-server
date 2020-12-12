module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Member', {
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
