const { verifyToken } = require('../util')

function isAuth() {
    return async function (ctx, next) {
        const token = ctx.cookies.get('token')
        ctx.assert(token, 401, 'Not authorized.')

        const decodedToken = verifyToken(token)
        ctx.assert(decodedToken, 401, 'Not Authorized.')

        ctx.state.user = {
            id: decodedToken.sub,
            role: decodedToken.role,
        }

        await next()
    }
}

module.exports = isAuth
