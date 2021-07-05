'use strict'
const licenseValidation = require('../../utils/licenseValidation')
const createUserPoolForStack = require('./createUserPoolForStack')
const createModerator = require('./createModerator')

const createStack = async (event, session) => {
  const { licenseId, stackName, modName, modEmail, modPassword, awsInfo } = event
  if (await licenseValidation(licenseId, session) === true) {
    throw new Error(`ForbiddenError: The maximum number of stacks for the license '${licenseId}' are in use already.`)
  }
  const stackInfo = await createUserPoolForStack(stackName, awsInfo, session)
  const { userPoolId: stackId, clientId } = stackInfo

  const platformReturned = await createModerator(
    stackId,
    clientId,
    licenseId,
    stackName,
    modName,
    modEmail,
    modPassword,
    awsInfo,
    session
  )

  const response = {
    statusCode: 200,
    body: platformReturned
  }
  return JSON.stringify(response)
}

module.exports = createStack
