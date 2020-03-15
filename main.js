const lodash = require('lodash')
const curlCore = require('./curlCore')
const utils = require('./utils')

function curl (serializationOption = () => {
  return {}
}) {
  const serialization = req => {
    return {
      protocol: req.protocol,
      baseUrl: req.baseUrl,
      headers: req.headers,
      method: req.method,
      body: req.body,
      query: req.query,
      get (host) {
        return req.get(host)
      }
    }
  }
  return function (originReq, option = {
    headers: {},
    body: {},
  }) {
    try {
      const req = {...serialization(originReq), ...serializationOption(originReq)}
      if (
        lodash.isEmpty(req.headers) ||
        (lodash.isEmpty(req.headers['Content-Type']) && lodash.isEmpty(req.headers['content-type']))
      ) {
        return `curl ${curlCore.coverHeader(req.headers, option.headers)} -X ${req.method} '${curlCore.getFullURL(req)}?${curlCore.coverQuery(req.query)}'`
      }
      const contentType = req.headers['Content-Type'] || req.headers['content-type']
      if (contentType.includes('application/json')) {
        return `curl -d '${curlCore.coverJsonBody(req.body, option.body)}' ${curlCore.coverHeader(req.headers, option.headers)} -X ${req.method} '${curlCore.getFullURL(req)}?${curlCore.coverQuery(req.query)}'`
      }
      else if (contentType.includes('application/x-www-form-urlencoded')) {
        return `curl -d '${curlCore.coverUrlencodedFormDataBody(req.body, option.body)}' ${curlCore.coverHeader(req.headers, option.headers)} -X ${req.method} '${curlCore.getFullURL(req)}?${curlCore.coverQuery(req.query)}'`
      }
      else if (contentType.includes('multipart/form-data')) {
        return `curl ${curlCore.coverMultipartFormDataBody(req.body, option.body)} ${curlCore.coverHeader(req.headers, option.headers)} -X ${req.method} '${curlCore.getFullURL(req)}?${curlCore.coverQuery(req.query)}'`
      }
      else {
        return "Content type error. Can't not parse"
      }
    } catch (error) {
      return `Parse error: ${error}`
    }
  }
}

module.exports = {
  curl,
  utils
}