# Thanks https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/docker/multi_stage_builds.md

# Start with fully-featured Node.js base image
FROM node:14.4.0 AS build

# Set non-root user 
USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# Copy dependency information and install all dependencies
COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --frozen-lockfile

# Copy source code (and all other relevant files)
COPY --chown=node:node src ./src

# Run-time stage
FROM node:14.4.0-alpine

# Set non-root user 
USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# Copy dependency information and install production-only dependencies
COPY --chown=node:node package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Copy results from previous stage
COPY --chown=node:node --from=build /home/node/app ./

# Generate Prisma Client
RUN yarn prisma generate

CMD [ "node", "src/app.js" ]
