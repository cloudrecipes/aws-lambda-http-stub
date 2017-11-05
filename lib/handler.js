const {debug} = require('./log')

/**
 * The method is the main entry point to the stubs
 * @param  {Object} data     event data, will be transfered from API gateway
 * @param  {Object} services other AWS services handlers to use
 * @return {Promise}         promise resolves with the stub result
 */
exports.main = (data, services) => {
  debug(`Event data:\n${JSON.stringify(data, null, 2)}`)

  const {method} = data

  switch (method) {
    case 'GET': return exports.readResource(data, services)
    case 'PUT': return exports.updateResource(data, services)
    case 'POST': return exports.createResource(data, services)
    case 'DELETE': return exports.deleteResource(data, services)

    default: return exports.errorFactory(500, `Method '${method}' not supported`)
  }
}

exports.readResource = (data, services) => {
  const {is4xx, is5xx, id} = data
  if (is4xx || is5xx) return exports.errorFactory(is4xx || is5xx)
  return Promise.resolve()
}

exports.createResource = (data, services) => {
}

exports.updateResource = (data, services) => {
}

exports.deleteResource = (data, services) => {
}

exports.errorFactory = (httpStatus, error) => Promise.resolve({httpStatus, error})
