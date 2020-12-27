const prisma = require('../prisma')

module.exports = {
    getMany: async function (ctx) {
        ctx.body = await prisma.session.findMany()
    },
    delete: async function (ctx) {
        try {
            await prisma.session.delete({
                where: {
                    id: parseInt(ctx.params.id),
                },
            })
            ctx.status = 204
        } catch (err) {
            // Why Prisma :(
            if (err.meta.details.includes('RecordNotFound')) {
                ctx.throw(404, 'Session does not exist.')
            } else {
                throw err
            }
        }
    },
    finish: async function (ctx) {
        const session = await prisma.session.findUnique({
            where: { id: parseInt(ctx.params.id) },
        })
        ctx.assert(session, 404, 'Session does not exist.')
        ctx.assert(!session.finish, 400, 'Session is already finished.')
        await prisma.session.update({
            data: { finish: new Date() },
            where: { id: parseInt(ctx.params.id) },
        })
        ctx.status = 204
    },
}
