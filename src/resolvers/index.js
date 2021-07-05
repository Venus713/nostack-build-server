const mutationExport = require('./mutationExport')
const mutationCreateAgreement = require('./mutationCreatAgreement')
const mutationCreatePayment = require('./mutationCreatePayment')
const queryExecuteAgreement = require('./queryExecuteAgreement')
const queryExecutePayment = require('./queryExecutePayment')
const queryCancelAgreement = require('./queryCancelAgreement')

const resolvers = {
  Mutation: {
    export: mutationExport,
    createAgreement: mutationCreateAgreement,
    createPayment: mutationCreatePayment
  },
  Query: {
    executeAgreement: queryExecuteAgreement,
    executePayment: queryExecutePayment,
    cancelAgreement: queryCancelAgreement
  }
}

module.exports = resolvers
