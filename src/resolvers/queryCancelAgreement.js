const paypal = require('../config/paypal')

const cancelAgreementController = async (object, params, ctx) => {
  console.log(`Received parameters in cancelAgreement: ${params}`)
  const { token } = params

  const data = {
    notes: 'Canceling the agreement'
  }
  return await new Promise((resolve, reject) => {
    paypal.billingAgreement.suspend(token, data, (error) => {
      if (error) {
        reject(error)
      }
      resolve(JSON.stringify({ status: 'success' }))
    })
  })
}

module.exports = cancelAgreementController
