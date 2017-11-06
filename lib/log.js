/**
 * DEBUG - allows debug information logging (optional)
 * ERROR - allows error information logging (optional)
 */

/* eslint-disable no-console */
exports.debug = (...args) => (process.env.DEBUG ? console.log.apply(null, args) : null)
exports.error = (...args) => (process.env.ERROR ? console.error.apply(null, args) : null)
/* eslint-enable no-console */
