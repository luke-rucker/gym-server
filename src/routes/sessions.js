const Router = require('@koa/router')
const db = require('../db')

const sessions = new Router()

sessions.get('/', async function (ctx) {
    const query = []

    switch (ctx.query.status) {
        case 'active':
            query.push({ finish: { equals: null } })
            break
        case 'finished':
            query.push({ finish: { not: null } })
    }

    ctx.body = await db.session.findMany({
        ...(query.length > 0 ? { where: { AND: query } } : null),
        select: {
            id: true,
            start: true,
            finish: true,
            member: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            },
        },
        orderBy: {
            start: 'asc',
        },
    })
})

sessions.delete('/:sessionId', async function (ctx) {
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
})

sessions.patch('/:sessionId/finish', async function (ctx) {
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
})

module.exports = sessions.routes()
