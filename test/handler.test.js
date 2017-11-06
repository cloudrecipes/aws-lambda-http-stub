const test = require('ava')
const td = require('testdouble')
const handler = require('../lib/handler')

test.afterEach(t => td.reset()) // eslint-disable-line no-unused-vars

test('responseFactory()', async t => {
  const testCases = [
    {httpStatus: 500, data: 'Internal service error', expected: {httpStatus: 500, error: 'Internal service error'}},
    {httpStatus: 400, data: null, expected: {httpStatus: 400, error: null}},
    {httpStatus: 200, data: {foo: 'bar'}, expected: {httpStatus: 200, body: {foo: 'bar'}}},
  ]

  const validator = (actual, idx) => t.deepEqual(actual, testCases[idx].expected)

  await Promise.all(testCases.map(({httpStatus, data}) => handler.responseFactory(httpStatus, data)))
    .then(results => results.forEach(validator))
    .catch(err => {
      t.log(err)
      t.fail()
    })
})

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
  td.verify(updateResource({method: 'PUT'}, {}))
  t.pass()
})

test('main() should invoke createResource when method is POST', t => {
  const createResource = td.replace(handler, 'createResource')
  handler.main({method: 'POST'}, {})
  td.verify(createResource({method: 'POST'}, {}))
  t.pass()
})

test('main() should invoke deleteResource when method is DELETE', t => {
  const deleteResource = td.replace(handler, 'deleteResource')
  handler.main({method: 'DELETE'}, {})
  td.verify(deleteResource({method: 'DELETE'}, {}))
  t.pass()
})


test.todo('readResource()')
test.todo('createResource()')
test.todo('updateResource()')
test.todo('delete()')
