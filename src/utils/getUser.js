const dbInfo = require('../config/dbInfo')
const getSession = require('../config/getSession')
const awsInfo = require('../config/awsInfo')
const getCognitoProvider = require('./getCognitoProvider')

async function resolveCognitoUser (params, awsInfo) {
  const cognito = getCognitoProvider(null, awsInfo)

  return new Promise(function (resolve, reject) {
    cognito.getUser(params, function (err, data) {
      if (err) {
        reject(err)
      } else {
        const userData = {
          id: data.UserAttributes[0].Value,
          name: data.Username
        }
        resolve(userData)
      }
    })
  })
}

async function userQuery (userId, session) {
  const query = 'MATCH (u:User{id:$userId})<-[:OWNED_BY]-(:Platform) RETURN u'
  try {
    const result = await session.run(
      query,
      {
        userId
      }
    )
    return result.records
  } catch (err) {
    console.log('raised error in getUser:', err)
    throw new Error(err)
  }
}

// temp placeholder function
const getUser = async (token) => {
  let userId = ''
  const params = {
    AccessToken: token
  }
  const session = await getSession(dbInfo)
  try {
    const userData = await resolveCognitoUser(params, awsInfo)
    userId = userData.id
    const user = await userQuery(userId, session)
    console.log(`userData=${JSON.stringify(userData)}`)
    if (!user) {
      userId = ''
      return userId
    }
    return userId
  } catch (err) {
    console.log(`error getting user from token: ${JSON.stringify(err)}`)
  } finally {
    await session.close()
  }
}

module.exports = getUser
