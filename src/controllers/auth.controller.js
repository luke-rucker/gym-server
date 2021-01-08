const db = require('../db')
const {
    verifyPassword,
    createToken,
    createRefreshToken,
    verifyRefreshToken,
} = require('../util')

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
        const { refreshToken, refreshExpiresAt } = createRefreshToken(userInfo)

        ctx.cookies.set('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: refreshExpiresAt,
            path: '/auth/token/refresh',
        })

        ctx.body = {
            message: 'Authentication Successful',
            token,
            expiresAt,
            userInfo,
        }
    },
    refreshToken: async function (ctx) {
        const refreshToken = ctx.cookies.get('refreshToken')
        ctx.assert(refreshToken, 401, 'Not Authorized.')

        const decodedToken = verifyRefreshToken(refreshToken)
        ctx.assert(decodedToken, 401, 'Not Authorized.')

        const user = await db.user.findUnique({
            where: { id: decodedToken.sub },
            select: { id: true, role: true },
        })

        const { token, expiresAt } = createToken(user)
        const {
            refreshToken: newRefreshToken,
            refreshExpiresAt,
        } = createRefreshToken(user)

        ctx.cookies.set('refreshToken', newRefreshToken, {
            httpOnly: true,
            maxAge: refreshExpiresAt,
            path: '/auth/token/refresh',
        })

        ctx.body = {
            token,
            expiresAt,
        }
    },
    invalidateToken: async function (ctx) {
        ctx.cookies.set('refreshToken', null)
        ctx.status = 204
    },
}
