const paypal = require('../config/paypal')

const createPaymentController = async (object, params, ctx) => {
  console.log(`Received parameters in createAgreementController: ${params}`)
  const {
    domainUrl, paypalCredentials, total, currency, description, items
  } = params

  if (paypalCredentials) {
    paypal.configure({
      mode: 'sandbox', // sandbox or live
      client_id: paypalCredentials.clientId,
      client_secret: paypalCredentials.clientSecret
    })
  }

  const BASE_URL = domainUrl || 'http://localhost:3000/dev'

  const paymentJson = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal'
    },
    redirect_urls: {
      return_url: `${BASE_URL}/graphql`,
      cancel_url: `${BASE_URL}/graphql`
    },
    transactions: [{
      item_list: {
        items
      },
      amount: {
        currency,
        total
      },
      description
    }]
  }

  return await new Promise((resolve, reject) => {
    paypal.payment.create(paymentJson, (error, payment) => {
      if (error) {
        reject(new Error(error))
      }

      const { links } = payment
      const result = links.reduce((acc, link) => {
        if (link.rel === 'approval_url') {
          acc = link
        }
        return acc
      }, null)

      if (result) {
        resolve(JSON.stringify({
          status: 'success',
          data: {
            redirect: true,
            link: result.href
          }
        }))
      } else {
        resolve(JSON.stringify({ status: 'error' }))
      }
    })
  }).catch((err) => {
    throw new Error(err)
  })
}

module.exports = createPaymentController
