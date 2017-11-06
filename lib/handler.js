const {debug} = require('./log')
const utils = require('./utils')

const {FIXTURES_BUCKET} = process.env
const {responseFactory: httpResponseFactory} = utils.http
const {internalServerError} = utils.http.errors
const {dataParser: s3DataParser} = utils.s3

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

    default: return httpResponseFactory(500, `Method '${method}' not supported`)
  }
}

exports.readResource = (data, services, fixturesBucket) => {
  const {is4xx, is5xx, resource, id} = data // eslint-disable-line object-curly-newline
  const {s3} = services

  if (is4xx || is5xx) return httpResponseFactory(is4xx || is5xx)

  const opts = {Bucket: fixturesBucket, Key: `${resource}.json`}

  return new Promise((resolve, reject) => s3.getObject(opts, (err, rawData) => (err ? reject(err) : resolve(rawData))))
    .then(s3DataParser)
    .then(fixtureObject => (id ? fixtureObject[id] : fixtureObject))
    .then(body => httpResponseFactory(200, body))
    .catch(internalServerError)
}

exports.createResource = (data, services) => {
}

exports.updateResource = (data, services) => {
}

exports.deleteResource = (data, services) => {
}
