'use strict'

const getCognitoProvider = require('../../utils/getCognitoProvider')

const stackNameTaken = async (name, session) => {
  const query = 'match (p:Platform{name:$name}) RETURN count(p)>0 as platform_exists'

  const result = await session.run(query, {
    name
  }).then(result => {
    console.log('result.records[0].get(\'platform_exists\')', result.records[0].get('platform_exists'))
    if (result.records[0].get('platform_exists')) {
      // no records found
      console.log(`Oops. stack ${name} already exists.`)
      return true
    } else {
      return false
    }
  })

  console.log('result=', result)
  return result
}

const createUserPool = (name, cognito) => {
  // const defaultEmailAddress = 'info@nostack.net'
  // const emailAddress = sendingEmail ? sendingEmail : defaultEmailAddress
  const params = {
    PoolName: name,
    AccountRecoverySetting: {
      RecoveryMechanisms: [
        {
          Name: 'verified_email', /* required */
          Priority: 1 /* required */
        },
        {
          Name: 'verified_phone_number', /* required */
          Priority: 2 /* required */
        }
      ]
    },
    AdminCreateUserConfig: {
      AllowAdminCreateUserOnly: false,
      InviteMessageTemplate: {
        EmailMessage: `Your username for ${name} is {username} and temporary password is {####}. `,
        EmailSubject: `Your temporary password for ${name}`,
        SMSMessage: `Your username for ${name}is {username} and temporary password is {####}.`
      },
      UnusedAccountValidityDays: '7'
    },
    AliasAttributes: ['email', 'phone_number', 'preferred_username'],
    AutoVerifiedAttributes: [
      'email', 'phone_number'
    ],
    DeviceConfiguration: {
      ChallengeRequiredOnNewDevice: false,
      DeviceOnlyRememberedOnUserPrompt: false
    },
    EmailConfiguration: {
      EmailSendingAccount: 'DEVELOPER',
      SourceArn: 'arn:aws:ses:us-east-1:412511290092:identity/info@nostack.net',
      From: 'info@nostack.net'
    },
    EmailVerificationMessage: `Your authentication code for ${name} is {####}.`,
    EmailVerificationSubject: `Your Verification Code for ${name}`,
    MfaConfiguration: 'OPTIONAL',
    SmsAuthenticationMessage: `Your authentication code for ${name} is {####}.`,
    SmsConfiguration: {
      SnsCallerArn: 'arn:aws:iam::412511290092:role/service-role/NoStack-SMS-Role',
      ExternalId: 'd611c8fd-0fd1-469a-a5ea-b02186042023'
    },
    SmsVerificationMessage: `Your authentication code for ${name} is {####}. `,
    VerificationMessageTemplate: {
      DefaultEmailOption: 'CONFIRM_WITH_LINK',
      EmailMessageByLink: 'Please click the link below to verify your email address. {##Verify Email##} ',
      EmailSubjectByLink: 'Your verification link',
      SmsMessage: `Your authentication code for ${name} is {####}. `
    }
  }
  return new Promise(function (resolve, reject) {
    cognito.createUserPool(params, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data.UserPool.Id)
      }
    })
  })
}

const createUserPoolClient = (userPoolId, cognito) => {
  const params = {
    ClientName: 'user_pool_app_client',
    UserPoolId: userPoolId,
    ExplicitAuthFlows: ['ALLOW_ADMIN_USER_PASSWORD_AUTH', 'ALLOW_REFRESH_TOKEN_AUTH']
  }
  return new Promise(function (resolve, reject) {
    cognito.createUserPoolClient(params, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data.UserPoolClient.ClientId)
      }
    })
  })
}

const createUserPoolDomain = (userPoolId, stackName, cognito) => {
  const domain = `nostack-${stackName.toLowerCase()}` // .auth.us-east-1.amazoncognito.com`
  // const domain = `nostack-testpoolb.auth.us-east-1.amazoncognito.com`
  const params = {
    Domain: domain,
    UserPoolId: userPoolId
  }
  console.log(`params=${JSON.stringify(params, null, 2)}`)
  return new Promise(function (resolve, reject) {
    cognito.createUserPoolDomain(params, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data.CloudFrontDomain)
      }
    })
  })
}

const createStack = async (name, awsInfo, session) => {
  let userPoolId = ''
  let clientId = ''
  console.log('in createStack...')

  const cognito = getCognitoProvider(null, awsInfo)

  const used = await stackNameTaken(name, session)
  if (used === true) {
    await session.close()
    console.log(`The stack name ${name} is alredy used.`)
    throw new Error(`StacknameExistsException: stack name ${name} already exists.`)
  }
  console.log('the stack name is never used.')

  try {
    userPoolId = await createUserPool(name, cognito)
  } catch (err) {
    await session.close()
    console.log(err) // error
    throw new Error(err)
  }

  try {
    clientId = await createUserPoolClient(userPoolId, cognito)
  } catch (err) {
    await session.close()
    console.log(err) // error
    throw new Error(err)
  }

  try {
    await createUserPoolDomain(
      userPoolId,
      name,
      cognito
    )
  } catch (err) {
    await session.close()
    console.log(err) // error
    throw new Error(err)
  }

  return {
    userPoolId,
    clientId
  }
}

module.exports = createStack
