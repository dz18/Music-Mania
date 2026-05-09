const prisma = require('../prisma/client')

const healthCheck = async(req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.status(200).json({ status: 'ok', db: 'connected' })
  } catch (error) {
    res.status(500).json({ status: 'error', db: 'disconnected' })
  }
}

module.exports = { healthCheck }