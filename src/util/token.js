const jwt = require('jsonwebtoken')

const algorithm = 'HS512'

function createToken(user) {
  // Three hours from now in seconds
  const expiresAt = Math.floor(Date.now() / 1000) + 3 * 60 * 60
  const token = jwt.sign(
    {
      sub: user.id,
      role: user.role,
      iss: 'www.jub-gym.com',
      aud: 'www.jub-gym.com',
      exp: expiresAt,
    },
    process.env.JWT_SECRET,
    {
      algorithm,
    }
  )
  return { token, expiresAt: expiresAt * 1000 }
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: [algorithm],
      audience: 'www.jub-gym.com',
      issuer: 'www.jub-gym.com',
    })
  } catch (err) {
    return
  }
}

module.exports = {
  createToken,
  verifyToken,
}
