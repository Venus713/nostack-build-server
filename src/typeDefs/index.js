const { gql } = require('apollo-server-lambda')

const typeDefs = gql`
  input AwsInfoInput {
    REGION: String!
    AWS_ACCESS_KEY: String!
    AWS_SECRET_KEY: String!
  }

  input DBInfoInput {
    USER: String!
    URI: String!
    PASSWORD: String!
  }

  input PayPalInfoInput {
    clientId: String!
    clientSecret: String!
  }

  type Query {
    executeAgreement (
      token: String!
    ): String

    cancelAgreement (
      token: String
    ): String

    executePayment (
      payerId: ID!
      paymentId: ID!
    ): String
  }

  type Mutation {
    export(
      awsInfo: AwsInfoInput!
      dbInfo: DBInfoInput!
      stackName: String!
      mailgunKey: String!
      mailgunDomain: String!
      customerEmail: String!
      unrestricted: Boolean
    ): String

    createAgreement (
      domainUrl: String!
      paypalCredentials: PayPalInfoInput
      fee: Float!
      name: String!
      total: Float!
      currency: String!
      description: String!
    ): String

    createPayment (
      domainUrl: String!
      paypalCredentials: PayPalInfoInput
      total: Float!
      currency: Float!
      items: String!
    ): String
  }
`
module.exports = typeDefs
