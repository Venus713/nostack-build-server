// server.js
const { ApolloServer, AuthenticationError } = require('apollo-server-lambda')
const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')
const getUser = require('./utils/getUser')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ event, context }) => {
    const token = event.headers.jwt
    let userId = ''
    if (token) {
      userId = await getUser(token)
    }
    return ({
      headers: event.headers,
      functionName: context.functionName,
      event,
      context,
      userId
    })
  },
  formatError: (err) => {
    console.log('the following error occurred: ', err)
    if (err.message.includes('ExistsException:')) {
      return ({ statusCode: 409, message: err.message })
    }
    if (err.message.includes('NotFoundException:')) {
      return ({ statusCode: 404, message: err.message })
    }
    if (err.message.startsWith('DatabaseError:')) {
      return ({ statusCode: 500, message: err.message })
    }
    if (err.originalError instanceof AuthenticationError) {
      return ({ statusCode: 401, message: err.message })
    }
    if (err.message.startsWith('ForbiddenError:')) {
      return ({ statusCode: 403, message: err.message })
    }
    if (err.message.startsWith('EmptyDataError:')) {
      return ({ statusCode: 204, message: err.message })
    }
    if (err.message.startsWith('MultiResultError:')) {
      return ({ statusCode: 300, message: err.message })
    } else {
      return ({ statusCode: 400, message: err.message })
    }
  },
  playground: {
    endpoint: '/graphql'
  }
})

exports.serverHandler = server.createHandler({
  cors: {
    origin: true,
    credentials: true
  }
})
