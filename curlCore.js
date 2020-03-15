const jp = require('jsonpath')

function coverHeader (headers, option = {}) {
  if (Object.keys(option).length !== 0) {
    Object.keys(option)
      .forEach(key => {
        jp.apply(headers, key, option[key])
      })
  }
  return Object.entries(headers)
    .map(([key, value]) => `-H "${key}: ${value}"`)
    .join(' ')
}

function coverQuery (query, option = {}) {
  if (Object.keys(option).length !== 0) {
    Object.entries(option)
      .forEach(([key, value]) => {
        jp.apply(query, key, value)
      })
  }
  return Object.entries(query)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
}

function coverJsonBody (body, option = {}) {
  if (Object.keys(option).length !== 0) {
    Object.entries(option)
      .forEach(([key, value]) => {
        jp.apply(body, key, value)
      })
    
  }
  return JSON.stringify(body)
}

function coverUrlencodedFormDataBody (body) {
  return Object.entries(body)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
}

function coverMultipartFormDataBody (body) {
  return Object.entries(body)
    .map(([key, value]) => `-F '${key}=${value}'`)
    .join(' ')
}

function getFullURL (req) {
  return `${req.protocol}://${req.get('host')}${req.baseUrl}`
}

module.exports = {
  coverHeader,
  coverQuery,
  coverJsonBody,
  coverUrlencodedFormDataBody,
  coverMultipartFormDataBody,
  getFullURL
}
