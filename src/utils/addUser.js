const getCognitoProvider = require('./getCognitoProvider')

const addUser = async (userPoolId, clientId, username, password, email, awsInfo) => {
  console.log(`in addUser(${userPoolId}, ${clientId}, ${username}, ${password}, ${email}`)
  const cognito = getCognitoProvider(userPoolId, awsInfo)
  const params = {
    ClientId: clientId, /* required */
    Username: username, /* required */
    Password: password,
    UserAttributes: [
      {
        Name: 'email', /* required */
        Value: email
      }
      /* more items */
    ],
    ValidationData: [
      {
        Name: 'email',
        Value: 'false'
      }
    ]
  }
  return new Promise(function (resolve, reject) {
    cognito.signUp(params, function (err, data) {
      if (err) {
        reject(err)
      } else {
        // console.log("data attributes in cognito: ",data["User"]['Attributes'].toString())
        // console.log("data returned from cognito: ", JSON.stringify(data, null, 2))
        resolve(data.UserSub)
      }
    })
  })
}

module.exports = addUser
