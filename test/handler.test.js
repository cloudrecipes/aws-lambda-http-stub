const test = require('ava')
const td = require('testdouble')
const handler = require('../lib/handler')
const {validator} = require('./helpers')

test.afterEach(t => td.reset()) // eslint-disable-line no-unused-vars

test('main() should return correct status and error when passed unsupported method', async t => {
  const error = await handler.main({method: 'OPTION'}, {})
  t.deepEqual(error, {httpStatus: 500, error: 'Method \'OPTION\' not supported'})
})

test('main() should invoke readResource when method is GET', t => {
  const readResource = td.replace(handler, 'readResource')
  handler.main({method: 'GET'}, {})
  td.verify(readResource({method: 'GET'}, {}, td.matchers.anything()))
  t.pass()
})

test('main() should invoke updateResource when method is PUT', t => {
  const updateResource = td.replace(handler, 'updateResource')
  handler.main({method: 'PUT'}, {})
  td.verify(updateResource({method: 'PUT'}))
  t.pass()
})

test('main() should invoke createResource when method is POST', t => {
  const createResource = td.replace(handler, 'createResource')
  handler.main({method: 'POST'}, {})
  td.verify(createResource({method: 'POST'}))
  t.pass()
})

test('main() should invoke deleteResource when method is DELETE', t => {
  const deleteResource = td.replace(handler, 'deleteResource')
  handler.main({method: 'DELETE'}, {})
  td.verify(deleteResource({method: 'DELETE'}))
  t.pass()
})

test('readResource() should return internalServerError on errors', async t => {
  const getObject = td.function()
  td.when(getObject({Bucket: 'fixturesBucket', Key: 'error.json'})).thenCallback(new Error('Bucket error'))
  td.when(getObject({Bucket: 'fixturesBucket', Key: 'corruptedData.json'}))
    .thenCallback(null, {Body: Buffer.from('ABC')})

  const fixturesBucket = 'fixturesBucket'
  const testCases = [
    {
      data: {is4xx: '403'},
      services: {s3: {getObject}},
      fixturesBucket,
      expected: {httpStatus: 403, error: undefined},
    },
    {
      data: {is5xx: '501'},
      services: {s3: {getObject}},
      fixturesBucket,
      expected: {httpStatus: 501, error: undefined},
    },
    {
      data: {resource: 'error'},
      services: {s3: {getObject}},
      fixturesBucket,
      expected: {httpStatus: 500, error: 'Bucket error'},
    },
    {
      data: {resource: 'corruptedData'},
      services: {s3: {getObject}},
      fixturesBucket,
      expected: {httpStatus: 500, error: 'Unexpected token A in JSON at position 0'},
    },
  ]

  await Promise.all(testCases.map(({data, services, fixturesBucket: fb}) => handler.readResource(data, services, fb)))
    .then(results => results.forEach(validator(t, testCases)))
    .catch(t)
})

test('readResource() should return successfull response', async t => {
  const getObject = td.function()
  td.when(getObject({Bucket: 'fixturesBucket', Key: 'data.json'}))
    .thenCallback(null, {Body: Buffer.from('{"1": {"foo": "bar"}, "2": {"big": "kraken"}}')})

  const fixturesBucket = 'fixturesBucket'
  const testCases = [
    {
      data: {resource: 'data'},
      services: {s3: {getObject}},
      fixturesBucket,
      expected: {httpStatus: 200, body: {1: {foo: 'bar'}, 2: {big: 'kraken'}}},
    },
    {
      data: {resource: 'data', id: 2},
      services: {s3: {getObject}},
      fixturesBucket,
      expected: {httpStatus: 200, body: {big: 'kraken'}},
    },
  ]

  await Promise.all(testCases.map(({data, services, fixturesBucket: fb}) => handler.readResource(data, services, fb)))
    .then(results => results.forEach(validator(t, testCases)))
    .catch(t)
})

test.todo('createResource()')

test('updateResource()', async t => {
  const testCases = [
    {data: {is5xx: '404'}, expected: {httpStatus: 404, error: undefined}},
    {data: {is5xx: '501'}, expected: {httpStatus: 501, error: undefined}},
    {data: {}, expected: {httpStatus: 204, body: undefined}},
  ]

  await Promise.all(testCases.map(({data}) => handler.updateResource(data)))
    .then(results => results.forEach(validator(t, testCases)))
    .catch(t)
})

test('deleteResource()', async t => {
  const testCases = [
    {data: {is5xx: '501'}, expected: {httpStatus: 501, error: undefined}},
    {data: {}, expected: {httpStatus: 204, body: undefined}},
  ]

  await Promise.all(testCases.map(({data}) => handler.deleteResource(data)))
    .then(results => results.forEach(validator(t, testCases)))
    .catch(t)
})
