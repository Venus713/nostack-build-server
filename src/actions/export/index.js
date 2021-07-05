'use strict'
require('dotenv').config()
const unirest = require('unirest')

const exportServer = async (event, token, session) => {
  try {
    console.log('export-api-url: ', process.env.EXPORT_API_URL)
    console.log('Event: ', event)
    const response = await new Promise((resolve, reject) => {
      unirest.post(process.env.EXPORT_API_URL)
        .header({ Accept: 'application/json', jwt: token })
        .send(event)
        .end(function (response) {
          console.log('res body in calling export-api: ', response.body)
          resolve(response)
        })
    })

    console.log('response in call export-api', response)
    return JSON.stringify(response.body, null, 2)
  } catch (err) {
    await session.close()
    console.log('Raised error in calling export-api', err) // error
    throw new Error(err)
  }
}

module.exports = exportServer
