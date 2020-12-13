const { models } = require('sequelize')

module.exports = {
    getMany: async function (ctx) {
        ctx.body = await models.session.getMany()
    },
    delete: async function (ctx) {
        await models.session.destroy({
            where: {
                id: ctx.params.id,
            },
        })
        ctx.status = 204
    },
}
