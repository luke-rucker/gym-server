const { PrismaClient } = require('@prisma/client')
const { hashPassword } = require('../util')

const prisma = new PrismaClient()

async function createSanta() {
    const santaUser = {
        firstName: 'Santa',
        lastName: 'Claus',
        email: 'santa@moretoys4u.com',
        password: 'hohoho',
        role: 'ADMIN',
    }

    const santaAlreadyExists = await prisma.user.findUnique({
        where: { email: santaUser.email },
    })

    if (!santaAlreadyExists) {
        const { password, ...rest } = santaUser
        await prisma.user.create({
            data: {
                passwordHash: await hashPassword(password),
                ...rest,
            },
        })
        console.log('Created Santa User.')
    } else {
        console.log('Santa User already exists.')
    }

    console.log(
        'Login with:',
        JSON.stringify({ email: santaUser.email, password: santaUser.password })
    )
}

async function seed() {
    createSanta()
        .catch((e) => console.error(e))
        .finally(async () => {
            await prisma.$disconnect()
        })
}

module.exports = seed
