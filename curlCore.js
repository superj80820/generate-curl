const jp = require('jsonpath')

function coverHeader (headers, option = {}) {
  if (Object.keys(option).length !== 0) {
    Object.keys(option)
      .forEach(key => {
        jp.apply(headers, key, option[key])
      })
  }
  return Object.entries(headers)
    .map(item => `-H "${item[0]}: ${item[1]}"`)
    .join(' ')
}

function coverQuery (query, option = {}) {
  if (Object.keys(option).length !== 0) {
    Object.keys(option)
      .forEach(key => {
        jp.apply(query, key, option[key])
      })
  }
  return Object.entries(query)
    .map(item => `${item[0]}=${item[1]}`)
    .join('&')
}

function coverJsonBody (body, option = {}) {
  if (Object.keys(option).length !== 0) {
    Object.keys(option)
      .forEach(key => {
        jp.apply(body, key, option[key])
      })
    
  }
  return JSON.stringify(body)
}

function coverFormDataBody (body) {
  return Object.entries(body)
    .map(item => `${item[0]}=${item[1]}`)
    .join('&')
}

function getFullURL (req) {
  return `${req.protocol}://${req.get('host')}${req.baseUrl}`
}

module.exports = {
  coverHeader,
  coverQuery,
  coverJsonBody,
  coverFormDataBody,
  getFullURL
}
