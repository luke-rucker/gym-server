const Router = require('@koa/router')
const db = require('../db')
const {
  uploadMemberProfileImage,
  downloadMemberProfileImage,
} = require('../util')

const members = new Router()

members.post('/', async function (ctx) {
  const memberWithSameEmail = await db.member.findUnique({
    where: { email: ctx.request.body.email },
  })
  ctx.assert(
    !memberWithSameEmail,
    400,
    `A member with the email ${ctx.request.body.email} already exists.`
  )

  const { firstName, lastName, ...rest } = ctx.request.body
  const { profileImage } = ctx.request.files

  const newMember = await db.member.create({
    data: {
      firstName,
      lastName,
      ...rest,
      profileImage: profileImage
        ? `${firstName}-${lastName}.${profileImage.name.split('.')[1]}` // firstName-lastName.fileType
        : null,
      createdBy: { connect: { id: ctx.state.user.id } },
    },
  })

  if (profileImage) {
    await uploadMemberProfileImage(newMember.profileImage, profileImage)
  }

  ctx.status = 201
  ctx.body = {
    id: newMember.id,
  }
})

members.get('/', async function (ctx) {
  let filter = []

  if (ctx.query.search) {
    const searchableFields = ['firstName', 'lastName', 'email']
    filter = searchableFields.map(field => ({
      [field]: { contains: ctx.query.search, mode: 'insensitive' },
    }))
  }

  ctx.body = await db.member.findMany({
    ...(filter.length > 0 ? { where: { OR: filter } } : null),
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      profileImage: true,
    },
  })
})

members.get('/:memberId', async function (ctx) {
  const member = await db.member.findUnique({
    where: { id: parseInt(ctx.params.memberId) },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      profileImage: true,
      createdAt: true,
      updatedAt: true,
      createdBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          profileImage: true,
        },
      },
    },
  })
  ctx.assert(member, 404, 'Member does not exist.')
  ctx.body = member
})

members.get('/:memberId/profileImage', async function (ctx) {
  const memberId = parseInt(ctx.params.memberId)

  const member = await db.member.findUnique({
    where: { id: memberId },
    select: { profileImage: true },
  })

  ctx.assert(member, 404, 'Member does not exist.')
  ctx.assert(member.profileImage, 400, 'Member does not have a profile image.')

  const image = await downloadMemberProfileImage(member.profileImage)

  ctx.response.set({
    'Cache-Control': `max-age=${60 * 10}`, // 10 min
    'Content-Disposition': `attachment; filename=${member.profileImage}`,
  })
  ctx.body = image.Body
})

members.delete('/:memberId', async function (ctx) {
  const memberId = parseInt(ctx.params.memberId)
  const member = await db.member.findUnique({ where: { id: memberId } })
  ctx.assert(member, 404, 'Member does not exist.')

  // TODO: delete profile image from S3

  // Bypass prisma query engine until https://github.com/prisma/prisma/issues/4711 is implemented
  await db.$executeRaw`DELETE FROM "Member" WHERE id=${memberId};`
  ctx.status = 204
})

members.post('/:memberId/sessions', async function (ctx) {
  const activeSession = await db.session.findFirst({
    where: {
      AND: [
        { memberId: parseInt(ctx.params.memberId) },
        { finish: { equals: null } },
      ],
    },
  })
  ctx.assert(!activeSession, 400, 'Member is already in the gym.')

  const createdSession = await db.session.create({
    data: {
      member: { connect: { id: parseInt(ctx.params.memberId) } },
    },
    select: { id: true, memberId: true, start: true },
  })
  ctx.status = 201
  ctx.body = createdSession
})

members.get('/:memberId/sessions', async function (ctx) {
  const query = []

  switch (ctx.query.status) {
    case 'active':
      query.push({ finish: { equals: null } })
      break
    case 'finished':
      query.push({ finish: { not: null } })
  }

  ctx.body = await db.session.findMany({
    where: { memberId: parseInt(ctx.params.memberId), AND: query },
    select: { id: true, start: true, finish: true },
    orderBy: {
      start:
        ctx.query.sort === 'asc' || ctx.query.sort === 'desc'
          ? ctx.query.sort
          : 'desc',
    },
  })
})

module.exports = members.routes()
