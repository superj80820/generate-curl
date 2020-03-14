// suite setup
process.env.DEBUG = true

// require
const curl = require('../curl')

// test case
test('cover headers', () => {
  const headers = {
    'Content-Type': 'c',
    'b': 'a'
  }
  expect(curl.coverHeader(headers)).toBe(`-H "Content-Type: c" -H "b: a"`)
})

test('cover json body', () => {
  const body = {
    'a': 'c',
    'b': 'a'
  }
  expect(curl.coverJsonBody(body)).toBe('{"a":"c","b":"a"}')
})

test('cover `application/json request` to curl', () => {
  const req = {
    method: 'POST',
    protocol: 'http',
    originalUrl: 'google.com.tw?a=3&b=3',
    headers: {
      'Content-Type': 'application/json',
      'b': 'a'
    },
    body: {
      a: 3
    },
    get() {
      return ''
    }
  }
  expect(curl.coverReqToCurlHandler(req)).toBe(`curl -d '{"a":3}' -H "Content-Type: application/json" -H "b: a" -X POST 'http://google.com.tw?a=3&b=3'`)
})

test('cover `application/x-www-form-urlencoded request` to curl', () => {
  const req = {
    method: 'POST',
    protocol: 'http',
    originalUrl: 'google.com.tw?a=3&b=3',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'b': 'a'
    },
    body: {
      a: 3,
      b: 'd'
    },
    get() {
      return ''
    }
  }
  expect(curl.coverReqToCurlHandler(req)).toBe(`curl -d 'a=3&b=d' -H "Content-Type: application/x-www-form-urlencoded" -H "b: a" -X POST 'http://google.com.tw?a=3&b=3'`)
})

test('curl parse error', () => {
  const req = {
    method: 'POST',
    protocol: 'http',
    originalUrl: 'google.com.tw',
    headers: {
      'Content-Type': 'asdf',
      'b': 'a'
    },
    body: {
      a: 3,
      b: 'd'
    },
    get() {
      return ''
    }
  }
  expect(curl.coverReqToCurlHandler(req)).toBe(`Content type error. Can't not parse`)
})