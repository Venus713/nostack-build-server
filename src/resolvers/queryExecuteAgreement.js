const paypal = require('../config/paypal')

const executeAgreementController = async (object, params, ctx) => {
  console.log(`Received parameters in executeAgreement: ${params}`)
  const { token } = params

  const executeAgreement = () => new Promise((resolve, reject) => {
    paypal.billingAgreement.execute(token, (error, billingAgreement) => {
      if (error) {
        reject(error)
      }
      console.log(JSON.stringify(billingAgreement))
      resolve(JSON.stringify({ status: 'success' }))
    })
  })

  return executeAgreement()
}

module.exports = executeAgreementController
