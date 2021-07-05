const paypal = require('../config/paypal')

const executePaymentController = async (object, params, ctx) => {
  console.log(`Received parameters in executePayment: ${params}`)
  const { payerId, paymentId } = params

  const executePaymentJson = {
    payer_id: payerId,
    transactions: [{
      amount: {
        currency: 'USD',
        total: '50.00'
      }
    }]
  }

  return await new Promise((resolve, reject) => {
    paypal.payment.execute(paymentId, executePaymentJson, (error, payment) => {
      if (error) {
        reject(error)
      }
      console.log(JSON.stringify(payment))
      resolve({ status: 'success' })
    })
  })
}

module.exports = executePaymentController
