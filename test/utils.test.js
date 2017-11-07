const test = require('ava')
const utils = require('../lib/utils')
const {validator} = require('./helpers')

test('should have http utils', t => {
  t.truthy(utils.http)
  t.truthy(utils.http.responseFactory)
  t.truthy(utils.http.errors)
  t.truthy(utils.http.errors.internalServerError)
})

test('responseFactory()', async t => {
  const testCases = [
    {httpStatus: 500, data: 'Internal service error', expected: {httpStatus: 500, error: 'Internal service error'}},
    {httpStatus: 400, data: null, expected: {httpStatus: 400, error: null}},
    {httpStatus: 200, data: {foo: 'bar'}, expected: {httpStatus: 200, body: {foo: 'bar'}}},
  ]

  await Promise.all(testCases.map(({httpStatus, data}) => utils.http.responseFactory(httpStatus, data)))
    .then(results => results.forEach(validator(t, testCases)))
    .catch(t)
})

test('internalServerError()', async t => {
  const actual = await utils.http.errors.internalServerError(new Error('Test error'))
  t.deepEqual(actual, {httpStatus: 500, error: 'Test error'})
})

test('should have s3 utils', t => {
  t.truthy(utils.s3)
  t.truthy(utils.s3.dataParser)
})

test('s3DataParser() should return rejected promise on parser error', async t => {
  const rawData = {Body: Buffer.from('abc')}
  const err = await t.throws(utils.s3.dataParser(rawData))
  t.is(err.message, 'Unexpected token a in JSON at position 0')
})

test('s3DataParser() should return parsed object', async t => {
  const rawData = {Body: Buffer.from('{"foo": "bar"}')}
  const obj = await utils.s3.dataParser(rawData)
  t.deepEqual(obj, {foo: 'bar'})
})
