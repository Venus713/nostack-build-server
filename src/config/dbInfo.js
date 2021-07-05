/* eslint-disable no-undef */
require('dotenv').config()

const dbInfo = {
  URI: process.env.DB_URI,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD
}

module.exports = dbInfo
