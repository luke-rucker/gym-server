# gym-server
Koa and Prisma powered Node.js backend for jub-gym

# Getting started
To get the server running locally:

- Clone this repo
- Run `docker-compose up` to start Postgres
- Use `sample.env` to create a `.env` file
- Run `yarn` to install dependencies
- Rum `yarn prisma generate` to generate the Prisma Client
- Run `yarn seed` to seed the database
- Run `yarn start` to start the local server
