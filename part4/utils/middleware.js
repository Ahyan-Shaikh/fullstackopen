const morgan = require('morgan')

morgan.token('body', (req, res) => req.body)
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
  console.log(error.name)
  next(error)
}

const unknownEndpoints = (req, res) => {
  res.status(404).json({ error: 'Unknown endpoint'})
}

module.exports = {
  morganLogger,
  errorHandler,
  unknownEndpoints
}