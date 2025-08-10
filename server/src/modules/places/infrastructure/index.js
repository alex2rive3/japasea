const repositories = require('./repositories')
const controllers = require('./controllers')

module.exports = {
  ...repositories,
  ...controllers
}
