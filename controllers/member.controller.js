const { models } = require('../models')

module.exports = {
    create: async function (ctx) {
        const newMember = await models.member.create(ctx.request.body)
        ctx.body = {
            id: newMember.id,
        }
    },
    getMany: async function (ctx) {
        ctx.body = await models.member.findAll()
    },
    getById: async function (ctx) {
        const member = await models.member.findByPk(ctx.params.id)
        ctx.assert(member, 404, `member ${ctx.params.id} does not exist`)
        ctx.body = member
    },
    delete: async function (ctx) {
        await models.member.destroy({
            where: {
                id: ctx.params.id,
            },
        })
        ctx.status = 204
    },
    createSession: async function (ctx) {
        ctx.body = await models.session.create({ memberId: ctx.params.id })
    },
    getSessions: async function (ctx) {
        const member = await models.member.findByPk(ctx.params.id)
        ctx.assert(member, 404, `member ${ctx.params.id} does not exist`)
        ctx.body = await member.getSessions()
    },
}
