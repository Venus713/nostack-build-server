const { AuthenticationError } = require('apollo-server-lambda')
const dbInfo = require('../config/dbInfo')
const getSession = require('../config/getSession')
const serverExport = require('../actions/export')

const mutationExport = async (object, params, ctx) => {
  const { userId } = ctx
  const accountId = JSON.stringify(ctx.context.invokedFunctionArn).split(':')[4]
  console.log('context: ', accountId)

  console.log('in mutationExport...')
  console.log('params: ', params)
  console.log('token in ctx: ', ctx.headers.jwt)

  const { awsInfo: clientAwsInfo, dbInfo: clientDBInfo, unrestricted, ...envParams } = params
  const event = { accountId: accountId, userId, clientAwsInfo: JSON.stringify(clientAwsInfo), clientDBInfo: JSON.stringify(clientDBInfo), unrestricted, ...envParams }
  console.log(`generated event=${JSON.stringify(event, null, 2)}`)

  if (!unrestricted && !userId) {
    console.log('error executing action: no user associated with the request.' +
      'This could be due to an expired or invalid token.')
    throw new AuthenticationError('no user associated with the request.' +
      'This could be due to an expired or invalid token.')
  }

  const session = await getSession(dbInfo)
  const result = await serverExport(event, ctx.headers.jwt, session)
  console.log(`result in mutationExport: ${result}`)
  await session.close()
  return result
}

module.exports = mutationExport
