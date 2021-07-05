const AWS = require('aws-sdk')

const getCognitoProvider = (stackId, awsInfo) => {
  let region
  if (stackId) {
    region = stackId.substring(0, 9)
  } else {
    region = awsInfo.REGION
  }
  AWS.config.region = region
  AWS.config.credentials = new AWS.Credentials(
    awsInfo.AWS_ACCESS_KEY,
    awsInfo.AWS_SECRET_KEY
  )
  return new AWS.CognitoIdentityServiceProvider()
}

module.exports = getCognitoProvider
