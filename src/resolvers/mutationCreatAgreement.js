const paypal = require('../config/paypal')
const createAgreement = require('../actions/payments/createAgreement')

const createAgreementController = async (object, params, ctx) => {
  console.log(`Received parameters in createAgreementController: ${params}`)
  const {
    domainUrl, paypalCredentials, fee, name, total, currency, description
  } = params

  if (paypalCredentials) {
    paypal.configure({
      mode: 'sandbox', // sandbox or live
      client_id: paypalCredentials.clientId,
      client_secret: paypalCredentials.clientSecret
    })
  }
  const BASE_URL = domainUrl || 'http://localhost:3000/dev'

  // Atrributs for creating the billing plan of  a user.
  const billingPlanAttributes = {
    name,
    type: 'INFINITE',
    description,
    merchant_preferences: {
      auto_bill_amount: 'yes',
      cancel_url: `${BASE_URL}/graphql`,
      return_url: `${BASE_URL}/graphql`,
      initial_fail_amount_action: 'continue',
      max_fail_attempts: '1',
      setup_fee: {
        currency,
        value: fee // setup Fee here
      }
    },
    payment_definitions: [
      {
        amount: {
          currency,
          value: total
        },
        charge_models: [],
        cycles: '0',
        frequency: 'MONTH', // setup frequency here
        frequency_interval: 1,
        name: 'Regular Payments',
        type: 'REGULAR'
      }
    ]
  }

  // Once a billing plan is created it must be updated with the following attributes.
  const billingPlanUpdates = [
    {
      op: 'replace',
      path: '/',
      value: {
        state: 'ACTIVE'
      }
    }
  ]

  const result = createAgreement(billingPlanAttributes, billingPlanUpdates, name, description, paypal)

  return JSON.stringify(result)
}

module.exports = createAgreementController
