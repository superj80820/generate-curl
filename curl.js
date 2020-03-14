const lodash = require('lodash')

const DEBUG = process.env.DEBUG

// core
function coverHeader (headers) {
  return Object.entries(headers)
    .map(item => `-H "${item[0]}: ${item[1]}"`)
    .join(' ')
}

function coverHeaderToHide (headers) {
  return Object.entries(headers)
    .map(item => `-H "${item[0]}: Hide"`)
    .join(' ')
}

function coverJsonBody (body) {
  return JSON.stringify(body)
}

function coverFormDataBody (body) {
  return Object.entries(body)
    .map(item => `${item[0]}=${item[1]}`)
    .join('&')
}

function getFullURL (req) {
  return `'${req.protocol}://${req.get('host')}${req.originalUrl}'`
}

// hight level handler
function coverReqToCurlHandler (req) {
  try {
    if (
      lodash.isEmpty(req.headers) ||
      (lodash.isEmpty(req.headers['Content-Type']) && lodash.isEmpty(req.headers['content-type']))
    ) {
      return `curl -X ${req.method} ${getFullURL(req)}`
    }
    const contentType = req.headers['Content-Type'] || req.headers['content-type']
    if (contentType.includes('application/json')) {
      return `curl -d '${coverJsonBody(req.body)}' ${(DEBUG) ? coverHeader(req.headers) : coverHeaderToHide(req.headers)} -X ${req.method} ${getFullURL(req)}`
    }
    else if (contentType.includes('application/x-www-form-urlencoded')) {
      return `curl -d '${coverFormDataBody(req.body)}' ${(DEBUG) ? coverHeader(req.headers) : coverHeaderToHide(req.headers)} -X ${req.method} ${getFullURL(req)}`
    }
    else {
      return "Content type error. Can't not parse"
    }
  } catch (error) {
    return `Parse error: ${error}`
  }
}

module.exports = {
  coverHeader,
  coverJsonBody,
  coverFormDataBody,
  coverReqToCurlHandler
}
