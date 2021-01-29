const db = require('../db')

module.exports = {
    getMany: async function (ctx) {
        ctx.body = await db.session.findMany()
    },
    delete: async function (ctx) {
        try {
            await db.session.delete({
                where: {
                    id: parseInt(ctx.params.sessionId),
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
        const session = await db.session.findUnique({
            where: { id: parseInt(ctx.params.sessionId) },
        })

        ctx.assert(session, 404, 'Session does not exist.')
        ctx.assert(!session.finish, 400, 'Session is already finished.')

        await db.session.update({
            data: { finish: new Date() },
            where: { id: parseInt(ctx.params.sessionId) },
        })
        ctx.status = 204
    },
}
