const Router = require('@koa/router')
const db = require('../db')

const members = new Router()

members.post('/', async function (ctx) {
    const memberWithSameEmail = await db.member.findUnique({
        where: { email: ctx.request.body.email },
    })
    ctx.assert(
        !memberWithSameEmail,
        400,
        `A member with the email ${ctx.request.body.email} already exists.`
    )

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
})

members.get('/', async function (ctx) {
    ctx.body = await db.member.findMany()
})

members.get('/:memberId', async function (ctx) {
    const member = await db.member.findUnique({
        where: { id: parseInt(ctx.params.memberId) },
    })
    ctx.assert(member, 404, 'Member does not exist.')
    ctx.body = member
})

members.delete('/:memberId', async function (ctx) {
    const memberId = parseInt(ctx.params.memberId)

    const member = await db.member.findUnique({ where: { id: memberId } })
    ctx.assert(member, 404, 'Member does not exist.')

    await db.member.delete({
        where: {
            id: memberId,
        },
    })
    ctx.status = 204
})

members.post('/:memberId/sessions', async function (ctx) {
    const createdSession = await db.session.create({
        data: {
            member: { connect: { id: parseInt(ctx.params.memberId) } },
        },
        select: { id: true, memberId: true, start: true },
    })
    ctx.status = 201
    ctx.body = createdSession
})

members.get('/:memberId/sessions', async function (ctx) {
    ctx.body = await db.session.findMany({
        where: { memberId: parseInt(ctx.params.memberId) },
        select: { id: true, start: true, finish: true },
    })
})

module.exports = members.routes()
