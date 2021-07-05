const moment = require('moment')

const createAgreement = async (billingPlanAttributes, billingPlanUpdates, name, description, paypal) => {
  // Attributes for creating the billing agreement.
  // Start Date should be greater than current time and date.
  const startDate = `${moment(new Date()).add(10, 'minute').format('gggg-MM-DDTHH:mm:ss')}Z`
  // Creating the billing plan and agreement of payment.
  return await new Promise((resolve, reject) => {
    paypal.billingPlan.create(billingPlanAttributes, (error, billingPlan) => {
      if (error) {
        reject(new Error(error))
      } else {
        paypal.billingPlan.update(billingPlan.id, billingPlanUpdates, (err) => {
          if (err) {
            reject(new Error(err))
          } else {
            // update the billing agreement attributes before creating it.
            const billingAgreementAttributes = {
              name,
              description,
              start_date: startDate,
              plan: {
                id: billingPlan.id
              },
              payer: {
                payment_method: 'paypal'
              }
            }

            paypal.billingAgreement.create(billingAgreementAttributes, (e, billingAgreement) => {
              if (e) {
                reject(new Error(e))
              } else {
                billingAgreement.links.forEach((agreement) => {
                  if (agreement.rel === 'approval_url') {
                    // Redirecting to paypal portal with approvalUrl.
                    const approvalUrl = agreement.href

                    resolve({
                      status: 'success',
                      data: {
                        redirect: true,
                        link: approvalUrl,
                        token: approvalUrl.split('token=')[1]
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  })
}

module.exports = createAgreement
