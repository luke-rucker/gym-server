const Router = require('@koa/router')
const { GymController } = require('../controllers')

const gym = new Router()

gym.get('/status', GymController.getStatus)

module.exports = gym.routes()
