const { PrismaClient } = require('@prisma/client')
const { hashPassword } = require('../util')

const prisma = new PrismaClient()

const santa = {
  firstName: 'Santa',
  lastName: 'Claus',
  email: 'santa@moretoys4u.com',
  profileImageUrl:
    'https://pbs.twimg.com/profile_images/1316013567305342977/2wd-FZ63_400x400.jpg',
  password: 'hohoho',
  role: 'ADMIN',
}

async function seed() {
  try {
    await insertUser(santa)
  } catch (error) {
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

async function insertUser(user) {
  const userExists = await prisma.user.findUnique({
    where: { email: user.email },
  })

  if (!userExists) {
    const { password, ...rest } = user
    await prisma.user.create({
      data: {
        passwordHash: await hashPassword(password),
        ...rest,
      },
    })
  } else {
    console.log(`User ${user.email} already exists.`)
  }

  console.log(
    'Login with:',
    JSON.stringify({ email: user.email, password: user.password }, null, 2)
  )
}

module.exports = seed
