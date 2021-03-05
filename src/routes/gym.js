const Router = require('@koa/router')
const db = require('../db')

const gym = new Router()

gym.get('/status', async function (ctx) {
  ctx.body = {
    currentCapacity: await db.session.count({
      where: { finish: { equals: null } },
    }),
    maxCapacity: 15,
  }
})

module.exports = gym.routes()
