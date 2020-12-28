const db = require('../db')
const { hashPassword } = require('../util')

module.exports = {
    create: async function (ctx) {
        const { password, ...userInfo } = ctx.request.body
        const passwordHash = await hashPassword(password)

        const createdUser = await db.user.create({
            data: { passwordHash, ...userInfo },
        })
        ctx.status = 201
        ctx.body = createdUser
    },
    getMany: async function (ctx) {
        ctx.body = await db.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profileImageUrl: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        })
    },
    delete: async function (ctx) {
        try {
            await db.user.delete({
                where: {
                    id: parseInt(ctx.params.id),
                },
            })
            ctx.status = 204
        } catch (err) {
            // Why Prisma :(
            if (err.meta.details.includes('RecordNotFound')) {
                ctx.throw(404, 'User does not exist.')
            } else {
                throw err
            }
        }
    },
}