const Router = require('@koa/router')
const db = require('../db')
const isAdmin = require('../middleware/is-admin')
const { hashPassword } = require('../util')

const users = new Router()

users.post('/', isAdmin(), async function (ctx) {
  const { password, ...userInfo } = ctx.request.body
  const passwordHash = await hashPassword(password)

  const createdUser = await db.user.create({
    data: { passwordHash, ...userInfo },
  })

  ctx.status = 201
  ctx.body = createdUser
})

const userSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  profileImage: true,
  role: true,
  createdAt: true,
  updatedAt: true,
}

users.get('/', isAdmin(), async function (ctx) {
  ctx.body = await db.user.findMany({
    select: userSelect,
  })
})

users.get('/me', async function (ctx) {
  ctx.body = await db.user.findUnique({
    where: { id: ctx.state.user.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      profileImage: true,
      role: true,
    },
  })
})

users.delete('/:userId', isAdmin(), async function (ctx) {
  const userId = parseInt(ctx.params.userId)

  const user = await db.user.findUnique({ where: { id: userId } })
  ctx.assert(user, 404, 'User does not exist.')

  await db.user.delete({
    where: {
      id: userId,
    },
  })
  ctx.status = 204
})

module.exports = users.routes()
