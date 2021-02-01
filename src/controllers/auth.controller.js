const db = require('../db')
const { verifyPassword, createToken } = require('../util')

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
        const passwordIsValid = await verifyPassword(password, passwordHash)
        ctx.assert(passwordIsValid, 401, 'Wrong email or password.')

        const { token, expiresAt } = createToken(userInfo)

        ctx.body = {
            message: 'Authentication Successful',
            token,
            expiresAt,
            userInfo,
        }
    },
}
