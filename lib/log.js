/**
 * DEBUG - allows debug information logging (optional)
 * ERROR - allows error information logging (optional)
 */
const {DEBUG, ERROR} = process.env

/* eslint-disable no-console */
exports.debug = (...args) => (DEBUG ? console.log.apply(null, args) : null)
exports.error = (...args) => (ERROR ? console.error.apply(null, args) : null)
/* eslint-enable no-console */
