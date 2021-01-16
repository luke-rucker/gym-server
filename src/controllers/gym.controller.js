const db = require('../db')

module.exports = {
    getStatus: async function (ctx) {
        ctx.body = {
            currentCapacity: await db.session.count({
                where: { finish: { equals: null } },
            }),
            maxCapacity: 15,
        }
    },
}
