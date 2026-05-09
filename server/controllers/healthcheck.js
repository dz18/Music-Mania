const prisma = require('../prisma/client')

const healthCheck = async(req, res) => {
  res.status(200).send('ok')
}

module.exports = { healthCheck }