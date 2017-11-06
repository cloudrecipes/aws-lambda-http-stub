const test = require('ava')
const {stdout, stderr} = require('test-console')
const log = require('../lib/log')

let inspectOut
let inspectErr

/* eslint-disable no-unused-vars */
test.beforeEach(t => {
  delete process.env.DEBUG
  delete process.env.ERROR
  inspectOut = stdout.inspect()
  inspectErr = stderr.inspect()
})

test.afterEach(t => {
  inspectOut.restore()
  inspectErr.restore()
})
/* eslint-enable no-unused-vars */

test('debug() does not write to console by default', t => {
  log.debug('Hello debug')
  t.deepEqual(inspectOut.output, [])
  t.deepEqual(inspectErr.output, [])
})

test('debug() writes to console', t => {
  process.env.DEBUG = 1
  log.debug('Hello debug')
  t.deepEqual(inspectOut.output, ['Hello debug\n'])
  t.deepEqual(inspectErr.output, [])
})

test('error() does not write to console by default', t => {
  log.error('Hello error')
  t.deepEqual(inspectOut.output, [])
  t.deepEqual(inspectErr.output, [])
})

test('error() writes to console', t => {
  process.env.ERROR = 1
  log.error('Hello error')
  t.deepEqual(inspectOut.output, [])
  t.deepEqual(inspectErr.output, ['Hello error\n'])
})
