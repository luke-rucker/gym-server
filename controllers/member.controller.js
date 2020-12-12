const { models } = require('../models')
const { Member } = models

module.exports = {
    create: async function (ctx) {
        const newMember = await Member.create(ctx.request.body)
        ctx.body = {
            id: newMember.id,
        }
    },
    getMany: async function (ctx) {
        ctx.body = await Member.findAll()
    },
    getById: async function (ctx) {
        const member = await Member.findByPk(ctx.params.id)
        if (!member) {
            ctx.throw(404, `member ${ctx.params.id} does not exist`)
        } else {
            ctx.body = member
        }
    },
    delete: async function (ctx) {
        await Member.destroy({
            where: {
                id: ctx.params.id,
            },
        })
        ctx.status = 204
    },
}
