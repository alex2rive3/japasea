// Barrel exports para dominio del módulo Auth
const entities = require('./entities')
const services = require('./services')

module.exports = {
  ...entities,
  ...services
}