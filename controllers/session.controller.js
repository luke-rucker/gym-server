const sequelize = require('../models')
const { models } = sequelize

module.exports = {
    getMany: async function (ctx) {
        ctx.body = await models.session.findAll()
    },
    delete: async function (ctx) {
        await models.session.destroy({
            where: {
                id: ctx.params.id,
            },
        })
        ctx.status = 204
    },
    finish: async function (ctx) {
        const session = await models.session.findByPk(ctx.params.id)
        ctx.assert(session, 404, 'Session does not exist')
        ctx.assert(!session.finish, 400, 'Session is already finished')
        await session.update({
            finish: sequelize.literal('CURRENT_TIMESTAMP'),
        })
        ctx.status = 204
    },
}
