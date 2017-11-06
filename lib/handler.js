const {debug} = require('./log')

const {FIXTURES_BUCKET} = process.env

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
    case 'GET': return exports.readResource(data, services, FIXTURES_BUCKET)
    case 'PUT': return exports.updateResource(data, services)
    case 'POST': return exports.createResource(data, services)
    case 'DELETE': return exports.deleteResource(data, services)

    default: return exports.responseFactory(500, `Method '${method}' not supported`)
  }
}

exports.readResource = (data, services, fuxturesBucket) => {
  const {is4xx, is5xx, resource, id} = data // eslint-disable-line object-curly-newline
  const {s3} = services

  if (is4xx || is5xx) return exports.responseFactory(is4xx || is5xx)

  const opts = {Bucket: fuxturesBucket, Key: `${resource}.json`}

  return new Promise((resolve, reject) => s3.getObject(opts, (err, rawData) => (err ? reject(err) : resolve(rawData))))
    .then(exports.s3DataParser)
    .then(fixtureObject => (id ? fixtureObject[id] : fixtureObject))
    .catch(exports.internalServerError)
}

exports.createResource = (data, services) => {
}

exports.updateResource = (data, services) => {
}

exports.deleteResource = (data, services) => {
}

/**
 * The method builds HTTP response with body
 * @param  {Integer}        httpStatus response HTTP status code
 * @param  {Object|String}  data       response body object or error message
 * @return {Promise}
 */
exports.responseFactory = (httpStatus, data) => {
  const response = {httpStatus}
  const key = +httpStatus < 400 ? 'body' : 'error'

  response[key] = data

  return Promise.resolve(response)
}

exports.internalServerError = err => exports.responseFactory(500, err.message)

exports.s3DataParser = (rawData) => {
  try {
    return Promise.resolve(JSON.parse(rawData.Body.toString()))
  } catch (err) {
    return exports.internalServerError(err)
  }
}
