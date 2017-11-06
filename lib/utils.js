/**
 * The method builds HTTP response with body.
 * @param  {Integer}        httpStatus response HTTP status code
 * @param  {Object|String}  data       response body object or error message
 * @return {Promise}
 */
const httpResponseFactory = (httpStatus, data) => {
  const response = {httpStatus}
  const key = +httpStatus < 400 ? 'body' : 'error'

  response[key] = data

  return Promise.resolve(response)
}

/**
 * The method returns Internal Server Error response.
 * @param  {Error}   err Error object, failure reason
 * @return {Promise}
 */
const internalServerError = err => httpResponseFactory(500, err.message)

exports.http = {
  responseFactory: httpResponseFactory,
  errors: {
    internalServerError,
  },
}

/**
 * The method parses data from s3 key.
 * @param  {Buffer} rawData object data stored in s3 key
 * @return {Promise}        parsed object
 */
const s3DataParser = (rawData) => {
  try {
    return Promise.resolve(JSON.parse(rawData.Body.toString()))
  } catch (err) {
    return Promise.reject(err)
  }
}

exports.s3 = {dataParser: s3DataParser}
