const morgan = require('morgan')
const jwt = require('jsonwebtoken')
morgan.token('body', (req, res) => JSON.stringify(req.body))
const morganLogger = () => {
  return (morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.body(req, res)
    ].join(' ')
  })
)}
const errorHandler = (err, req, res, next) => {
  if (err.name === 'JsonWebTokenError') {
    return res.status(400).send({
      error: err.message
    })
  }
  next(err)
}

const unknownEndpoints = (req, res) => {
  res.status(404).json({ error: 'Unknown endpoint'})
}

// With this token extractor we are checking on all routes, which is wrong as we only get token upon sucessful login
const tokenExtracter = (req, res, next) => {

  // This check is needed to bypass the GET (all) request method
  if (req.method !== 'GET') {
    const auth = req.get('authorization')
    // checks if the token is present in the header
    if (!(auth && auth.startsWith('Bearer '))) {
      return res.status(401).send({ error: 'Unauthorized access denied'})
    }
    req.token = auth.replace('Bearer ', '')
  }
  next()
}

const userExtractor = (req, res, next) => {
  const decoded = jwt.decode(req.token)
  req.user = decoded
  next()
}
module.exports = {
  morganLogger,
  errorHandler,
  unknownEndpoints,
  tokenExtracter,
  userExtractor
}