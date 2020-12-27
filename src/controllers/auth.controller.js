const prisma = require('../prisma')
const { verifyPassword } = require('../util')

module.exports = {
    login: async function (ctx) {
        const { email, password } = ctx.request.body
        const { passwordHash, ...userInfo } = await prisma.user.findUnique({
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
        ctx.assert(userInfo, 401, 'Wrong email or password.')

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
