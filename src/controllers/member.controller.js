const prisma = require('../prisma')

module.exports = {
    create: async function (ctx) {
        const newMember = await prisma.member.create({
            data: {
                ...ctx.request.body,
                createdBy: { connect: { id: 2 } },
            },
        })
        ctx.status = 201
        ctx.body = {
            id: newMember.id,
        }
    },
    getMany: async function (ctx) {
        ctx.body = await prisma.member.findMany()
    },
    getById: async function (ctx) {
        const member = await prisma.member.findUnique({
            where: { id: parseInt(ctx.params.id) },
        })
        ctx.assert(member, 404, 'Member does not exist.')
        ctx.body = member
    },
    delete: async function (ctx) {
        try {
            await prisma.member.delete({
                where: {
                    id: parseInt(ctx.params.id),
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
        const createdSession = await prisma.session.create({
            data: { member: { connect: { id: parseInt(ctx.params.id) } } },
            select: { id: true, memberId: true, start: true },
        })
        ctx.status = 201
        ctx.body = createdSession
    },
    getSessions: async function (ctx) {
        ctx.body = await prisma.session.findMany({
            where: { memberId: parseInt(ctx.params.id) },
            select: { id: true, start: true, finish: true },
        })
    },
}
