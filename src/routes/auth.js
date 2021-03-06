const Router = require('@koa/router')
const { IS_PROD } = require('../constants')
const db = require('../db')
const { verifyPassword, createToken } = require('../util')

const auth = new Router()

auth.post('/login', async function (ctx) {
  const { email, password } = ctx.request.body

  const user = await db.user.findUnique({
    where: { email: email },
    select: {
      id: true,
      passwordHash: true,
      role: true,
    },
  })
  ctx.assert(user, 401, 'Wrong email or password.')

  const { passwordHash, ...userInfo } = user
  const passwordIsValid = await verifyPassword(password, passwordHash)
  ctx.assert(passwordIsValid, 401, 'Wrong email or password.')

  const { token, expiresAt } = createToken(userInfo)

  ctx.cookies.set('token', token, {
    httpOnly: true,
    maxAge: expiresAt,
    path: '/api',
    sameSite: 'strict',
    secure: IS_PROD,
  })

  ctx.body = {
    expiresAt,
  }
})

auth.delete('/logout', async function (ctx) {
  ctx.cookies.set('token', null)
  ctx.status = 204
})

module.exports = auth.routes()
