require('dotenv').config()

const awsInfo = {
  REGION: process.env.REGION,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY
}
module.exports = awsInfo
