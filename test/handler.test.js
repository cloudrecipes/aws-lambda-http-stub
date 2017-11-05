const test = require('ava')
const td = require('testdouble')
const handler = require('../lib/handler')

test.afterEach(t => td.reset()) // eslint-disable-line no-unused-vars

test('errorFactory()', async t => {
  const error = await handler.errorFactory(500, 'Test error')
  t.deepEqual(error, {httpStatus: 500, error: 'Test error'})
})

test('main() should return correct status and error when passed unsupported method', async t => {
  const error = await handler.main({method: 'OPTION'}, {})
  t.deepEqual(error, {httpStatus: 500, error: 'Method \'OPTION\' not supported'})
})

test.todo('main() should invoke readResource when method is GET')
test.todo('main() should invoke updateResource when method is PUT')
test.todo('main() should invoke createResource when method is POST')
test.todo('main() should invoke deleteResource when method is DELETE')
