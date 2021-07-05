const neo4j = require('neo4j-driver')

const getSession = async (dbInfo) => {
  if (!dbInfo) {
    throw new Error('DatabaseError: No dbInfo provided.')
  }
  const driver = neo4j.driver(
    dbInfo.URI,
    neo4j.auth.basic(
      dbInfo.USER,
      dbInfo.PASSWORD
    )
  )

  try {
    await driver.verifyConnectivity()
  } catch (err) {
    console.log(`connectivity verification failed. ${err}`)
    throw new Error('DatabaseError: connectivity verification failed.')
  }
  return driver.session()
}

module.exports = getSession
