const bcrypt = require('bcrypt')

async function hashPassword(password) {
    return await bcrypt.hash(password, 12)
}

async function verifyPassword(passwordAttempt, passwordHash) {
    return await bcrypt.compare(passwordAttempt, passwordHash)
}

module.exports = { hashPassword, verifyPassword }
