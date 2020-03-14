const utils = require('../utils')

describe('test handler', () => {
  const curl = require('../main')()
  test('cover `application/json request` to curl', () => {
    const req = {
      method: 'POST',
      protocol: 'http',
      baseUrl: 'google.com.tw',
      query: {
        a: "3",
        b: "4"
      },
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
    expect(curl(req)).toBe(`curl -d '{"a":3}' -H "Content-Type: application/json" -H "b: a" -X POST 'http://google.com.tw?a=3&b=4'`)
  })
  test('cover `application/json request` to curl with option, and do not override', () => {
    const originReq = {
      method: 'POST',
      protocol: 'http',
      baseUrl: 'google.com.tw',
      query: {
        a: "3",
        b: "4"
      },
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
    const req = {...originReq}
    const option = {
      headers: {
        '$["Content-Type"]': value => `${value}z`,
      },
      body: {
        '$.a': value => value + 1
      }
    }
    curl(req, option)
    expect(req).toStrictEqual(originReq)
  })
  test('cover `application/json request` to curl with option', () => {
    const req = {
      method: 'POST',
      protocol: 'http',
      baseUrl: 'google.com.tw',
      query: {
        a: "3",
        b: "4"
      },
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
    const option = {
      headers: {
        '$["Content-Type"]': value => `${value}z`,
      },
      body: {
        '$.a': value => value + 1
      }
    }
    expect(curl(req, option)).toBe(`curl -d '{"a":4}' -H "Content-Type: application/jsonz" -H "b: a" -X POST 'http://google.com.tw?a=3&b=4'`)
  })
  test('cover `application/json request` to curl with option, utils function', () => {
    const req = {
      method: 'POST',
      protocol: 'http',
      baseUrl: 'google.com.tw',
      query: {
        a: "3",
        b: "4"
      },
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
    const option = {
      headers: {
        '$["Content-Type"]': utils.hide(),
      },
      body: {
        '$.a': value => value + 1
      }
    }
    expect(curl(req, option)).toBe(`curl -d '{"a":4}' -H "Content-Type: hide" -H "b: a" -X POST 'http://google.com.tw?a=3&b=4'`)
  })
  test('cover `application/x-www-form-urlencoded request` to curl', () => {
    const req = {
      method: 'POST',
      protocol: 'http',
      baseUrl: 'google.com.tw',
      query: {
        a: "3",
        b: "4"
      },
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
    expect(curl(req)).toBe(`curl -d 'a=3&b=d' -H "Content-Type: application/x-www-form-urlencoded" -H "b: a" -X POST 'http://google.com.tw?a=3&b=4'`)
  })
  test('cover `not has header request` to curl', () => {
    const req = {
      method: 'GET',
      protocol: 'http',
      baseUrl: 'google.com.tw',
      query: {
        a: "3",
        b: "4"
      },
      get() {
        return ''
      }
    }
    expect(curl(req)).toBe(`curl -X GET 'http://google.com.tw?a=3&b=4'`)
  })
  test('curl parse error', () => {
    const req = {
      method: 'POST',
      protocol: 'http',
      baseUrl: 'google.com.tw',
      query: {
        a: "3",
        b: "4"
      },
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
    expect(curl(req)).toBe(`Content type error. Can't not parse`)
  })
})

describe('test handler with serialization option', () => {
  const curl = require('../main')(req => {
    return {
      protocol: req.protocol.test,
      query: req.test.query
    }
  })
  test('cover `application/json request` to curl', () => {
    const req = {
      method: 'POST',
      protocol: {
        test: 'http'
      },
      baseUrl: 'google.com.tw',
      test: {
        query: {
          a: "3",
          b: "4"
        }
      },
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
    expect(curl(req)).toBe(`curl -d '{"a":3}' -H "Content-Type: application/json" -H "b: a" -X POST 'http://google.com.tw?a=3&b=4'`)
  })
  test('parse serializationOption error', () => {
    const req = {
      method: 'POST',
      protocol: {
        test: 'http'
      },
      baseUrl: 'google.com.tw',
      query: {
        a: "3",
        b: "4"
      },
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
    expect(curl(req)).toBe(`Parse error: TypeError: Cannot read property 'query' of undefined`)
  })
});