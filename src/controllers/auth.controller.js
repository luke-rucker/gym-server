const db = require('../db')
const { verifyPassword } = require('../util')

module.exports = {
    login: async function (ctx) {
        const { email, password } = ctx.request.body

        const user = await db.user.findUnique({
            where: { email: email },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                passwordHash: true,
                profileImageUrl: true,
                role: true,
            },
        })
        ctx.assert(user, 401, 'Wrong email or password.')

        const { passwordHash, ...userInfo } = user
        const passwordValid = await verifyPassword(password, passwordHash)
        ctx.assert(passwordValid, 401, 'Wrong email or password.')

        ctx.session.user = { id: userInfo.id, role: userInfo.role }
        ctx.body = userInfo
    },
    logout: async function (ctx) {
        ctx.session = null
        ctx.status = 204
    },
}
