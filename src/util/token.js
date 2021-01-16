const jwt = require('jsonwebtoken')

const algorithm = 'HS512'

function createToken(user) {
    // Two hours from now in seconds
    const expiresAt = Math.floor(Date.now() / 1000) + 2 * 60 * 60
    const token = jwt.sign(
        {
            sub: user.id,
            role: user.role,
            iss: 'www.jub-gym.com',
            aud: 'www.jub-gym.com',
            exp: expiresAt,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            algorithm,
        }
    )
    return { token, expiresAt: expiresAt * 1000 }
}

function createRefreshToken(user) {
    // One week from now in seconds
    const refreshExpiresAt = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
    const refreshToken = jwt.sign(
        {
            sub: user.id,
            iss: 'www.jub-gym.com',
            aud: 'www.jub-gym.com',
            exp: refreshExpiresAt,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            algorithm,
        }
    )
    return { refreshToken, refreshExpiresAt: refreshExpiresAt * 1000 }
}

function sendRefreshToken(ctx, refreshToken, refreshExpiresAt) {
    ctx.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: refreshExpiresAt,
        path: '/api/auth/token/refresh',
    })
}

function verifyToken(token, secret) {
    try {
        return jwt.verify(token, secret, {
            algorithms: [algorithm],
            audience: 'www.jub-gym.com',
            issuer: 'www.jub-gym.com',
        })
    } catch (err) {
        return
    }
}

function verifyAccessToken(token) {
    return verifyToken(token, process.env.ACCESS_TOKEN_SECRET)
}

function verifyRefreshToken(token) {
    return verifyToken(token, process.env.REFRESH_TOKEN_SECRET)
}

module.exports = {
    createToken,
    createRefreshToken,
    sendRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
}
