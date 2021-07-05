const isLicenseMaxedOut = async (licenseId, session) => {
  let maxedOut = false
  try {
    const checkLicenseQuery =
      `MATCH (l:License {id:$licenseId})
      OPTIONAL MATCH (l)<-[:HAS_LICENSE]-(o:Organization)<-[:BELONGS_TO]-(m:Moderator)<-[:OWNED_BY]-(p:Platform) 
      RETURN l.stackMax as max, count(distinct p) as numberStacks`

    await session.run(checkLicenseQuery, {
      licenseId
    }).then(
      result => {
        const max = parseInt(result.records[0].get('max'))
        const numberStacks = parseInt(result.records[0].get('numberStacks'))

        if (numberStacks >= max) {
          maxedOut = true
        }
      }
    )
  } catch (err) {
    await session.close()
    console.log(err)
    throw new Error('There is a problem with the license provided. Please check your details again or apply for a license at www.nostack.net.' +
      'If you think that this message is in error, please contact info@nostack.dev')
  }

  return maxedOut
}

module.exports = isLicenseMaxedOut
