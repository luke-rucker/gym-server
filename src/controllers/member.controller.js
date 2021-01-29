const db = require('../db')

module.exports = {
    create: async function (ctx) {
        const newMember = await db.member.create({
            data: {
                ...ctx.request.body,
                createdBy: { connect: { id: ctx.state.user.id } },
            },
        })
        ctx.status = 201
        ctx.body = {
            id: newMember.id,
        }
    },
    getMany: async function (ctx) {
        ctx.body = await db.member.findMany()
    },
    getById: async function (ctx) {
        const member = await db.member.findUnique({
            where: { id: parseInt(ctx.params.memberId) },
        })
        ctx.assert(member, 404, 'Member does not exist.')
        ctx.body = member
    },
    delete: async function (ctx) {
        try {
            await db.member.delete({
                where: {
                    id: parseInt(ctx.params.memberId),
                },
            })
            ctx.status = 204
        } catch (err) {
            // Why Prisma :(
            if (err.meta.details.includes('RecordNotFound')) {
                ctx.throw(404, 'Member does not exist.')
            } else {
                throw err
            }
        }
    },
    createSession: async function (ctx) {
        const createdSession = await db.session.create({
            data: {
                member: { connect: { id: parseInt(ctx.params.memberId) } },
            },
            select: { id: true, memberId: true, start: true },
        })
        ctx.status = 201
        ctx.body = createdSession
    },
    getSessions: async function (ctx) {
        ctx.body = await db.session.findMany({
            where: { memberId: parseInt(ctx.params.memberId) },
            select: { id: true, start: true, finish: true },
        })
    },
}
