const { PrismaClient } = require('@prisma/client')
const { hashPassword } = require('../util')

const prisma = new PrismaClient()

async function main() {
    const santa = await prisma.user.create({
        data: {
            firstName: 'Santa',
            lastName: 'Claus',
            email: 'santa@moretoys4u.com',
            passwordHash: await hashPassword('hohoho'),
            role: 'ADMIN',
        },
    })

    console.log('Created Santa User:', JSON.stringify(santa, null, 2))
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
