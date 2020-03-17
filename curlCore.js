const jp = require('jsonpath')
const lodash = require('lodash')

function coverHeader (originHeaders, option = {}) {
  const headers = lodash.cloneDeep(originHeaders)
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

function coverQuery (originQuery, option = {}) {
  const query = lodash.cloneDeep(originQuery)
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

function coverJsonBody (originBody, option = {}) {
  const body = lodash.cloneDeep(originBody)
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
  return `${req.protocol}://${req.get('host')}${req.path}`
}

module.exports = {
  coverHeader,
  coverQuery,
  coverJsonBody,
  coverUrlencodedFormDataBody,
  coverMultipartFormDataBody,
  getFullURL
}
