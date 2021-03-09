# gym-server

Koa and Prisma powered Node.js backend for jub-gym

# Getting started

To get the server running locally:

- Clone this repo
- Create an S3 Bucket with the provider of your choice, or use [localstack](https://github.com/localstack/localstack).
- Use `sample.env` to create a `.env` file
- Run `yarn` to install dependencies
- Run `docker-compose up -d` to start Postgres
- Rum `yarn prisma db push --preview-feature` to generate the Prisma Client and push the schema to the db
- Run `yarn start` to start the local server
