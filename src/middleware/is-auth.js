const { verifyToken } = require('../util')

function isAuth() {
    return async function (ctx, next) {
        const token = getTokenFromHeader(ctx)

        const decodedToken = verifyToken(token)
        ctx.assert(decodedToken, 401, 'Not Authorized.')

        ctx.state.user = {
            id: decodedToken.sub,
            role: decodedToken.role,
        }

        await next()
    }
}

// Inspired by https://github.com/koajs/jwt
function getTokenFromHeader(ctx) {
    if (!ctx.header || !ctx.header.authorization) {
        return
    }

    const parts = ctx.header.authorization.trim().split(' ')

    if (parts.length === 2) {
        const [scheme, credentials] = parts

        if (/^Bearer$/i.test(scheme)) {
            return credentials
        }
    }

    ctx.throw(
        401,
        'Bad Authorization header format. Format is "Authorization: Bearer <token>"'
    )
}

module.exports = isAuth
