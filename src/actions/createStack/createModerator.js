const createUser = require('../../utils/addUser')

const getModeratorId = async (
  userPoolId,
  clientId,
  modName,
  modPassword,
  modEmail,
  awsInfo
) => {
  let userId = ''

  // add user to new pool for the moderator
  try {
    userId = await createUser(
      userPoolId,
      clientId,
      modName,
      modPassword,
      modEmail,
      awsInfo
    )
    console.log(`success creating new user for the moderator...id = ${userId}`)
  } catch (err) {
    console.log(err) // error
    throw new Error(err)
  }
  console.log(`new moderatorId=${userId}`)

  return userId
}

// create a moderator in user_pool and a plaform and moderator in db
const createModerator = async (
  stackId,
  clientId,
  licenseId,
  stackName,
  modName,
  modEmail,
  modPassword,
  awsInfo,
  session
) => {
  const moderatorId = await getModeratorId(stackId, clientId, modName, modPassword, modEmail, awsInfo)
  const query = `MATCH (o:Organization)-[:HAS_LICENSE]->(l:License {id:$licenseId})
        MERGE (moderator:Moderator{noStackId:$moderatorId})-[:BELONGS_TO]->(o)
        MERGE (platform:Platform)-[:OWNED_BY]->(moderator)-[:OWNS]->(moderator)
            -[:IS_IN_CLASS]->(userClass:UserClass:Type{id:$stackId+'moderatorClass'})
            -[:IN]->(platform)
        MERGE (moderator)-[:IS_A]->(userClass) 
        SET userClass.name = 'Moderator' 
        SET moderator :User
        SET moderator += { id: $moderatorId, name: $modName, email: $modEmail }
        SET platform += { id: $stackId, name: $stackName, clientId: $clientId } 
        SET l.numberStacks = l.numberStacks + 1 
        RETURN platform, moderator`

  let platformReturned
  try {
    platformReturned = await session.run(query, {
      moderatorId,
      stackName,
      stackId,
      clientId,
      licenseId,
      modEmail,
      modName
    })
      .then(async result => {
        if (result.records.length === 0) {
          console.log('result.records.length===0')
          throw new Error('EmptyDataError: Expected results for a query to perform the action requested, but none were returned.')
        }

        if (result.records.length > 1) {
          console.log('result.records.length > 1')
          throw new Error('MultiResultError: returned results more than one.')
        }

        const returned = result.records[0].get('platform').properties
        returned.moderators = [{ id: moderatorId }]
        return returned
      })

    console.log('platformReturned= ', platformReturned)
  } catch (err) {
    await session.close()
    console.log(err) // error
    throw new Error(err)
  }

  return platformReturned
}

module.exports = createModerator
