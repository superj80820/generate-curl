const { utils: curlUtils } = require('../main')

describe('test handler', () => {
  const curl = require('../main').curl()
  test('cover `application/json request` to curl', () => {
    const req = {
      method: 'POST',
      protocol: 'http',
      path: '/api',
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
        return 'google.com.tw'
      }
    }
    expect(curl(req)).toBe(`curl -d '{"a":3}' -H "Content-Type: application/json" -H "b: a" -X POST 'http://google.com.tw/api?a=3&b=4'`)
  })
  test('cover `application/json request` to curl with option, and do not override', () => {
    const originReq = {
      method: 'POST',
      protocol: 'http',
      path: '/api',
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
        return 'google.com.tw'
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
      path: '/api',
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
        return 'google.com.tw'
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
    expect(curl(req, option)).toBe(`curl -d '{"a":4}' -H "Content-Type: application/jsonz" -H "b: a" -X POST 'http://google.com.tw/api?a=3&b=4'`)
  })
  test('cover `application/json request` to curl with option, utils function', () => {
    const req = {
      method: 'POST',
      protocol: 'http',
      path: '/api',
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
        return 'google.com.tw'
      }
    }
    const option = {
      headers: {
        '$["Content-Type"]': curlUtils.hide(),
      },
      body: {
        '$.a': value => value + 1
      }
    }
    expect(curl(req, option)).toBe(`curl -d '{"a":4}' -H "Content-Type: hide" -H "b: a" -X POST 'http://google.com.tw/api?a=3&b=4'`)
  })
  test('cover `application/json request` to curl with option, utils function. Should not have call by sharing side effect', () => {
    const req = {
      method: 'POST',
      protocol: 'http',
      path: '/api',
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
        return 'google.com.tw'
      }
    }
    const option = {
      headers: {
        '$["Content-Type"]': curlUtils.hide(),
      },
      body: {
        '$.a': value => value + 1
      }
    }
    curl(req, option)
    expect(req.headers['Content-Type']).toBe('application/json')
  })
  test('cover body to curl with option, utils function. Should not have call by nested sharing side effect', () => {
    const req = {
      method: 'POST',
      protocol: 'http',
      path: '/api',
      query: {
        a: "3",
        b: "4"
      },
      headers: {
        'Content-Type': 'application/json',
        'b': 'a'
      },
      body: {
        a: {
          b: 2
        }
      },
      get() {
        return 'google.com.tw'
      }
    }
    const option = {
      body: {
        '$..b': value => value + 1
      }
    }
    curl(req, option)
    expect(req.body.a.b).toBe(2)
  })
  test('cover `application/x-www-form-urlencoded request` to curl', () => {
    const req = {
      method: 'POST',
      protocol: 'http',
      path: '/api',
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
        return 'google.com.tw'
      }
    }
    expect(curl(req)).toBe(`curl -d 'a=3&b=d' -H "Content-Type: application/x-www-form-urlencoded" -H "b: a" -X POST 'http://google.com.tw/api?a=3&b=4'`)
  })
  test('cover `multipart/form-data request` to curl', () => {
    const req = {
      method: 'POST',
      protocol: 'http',
      path: '/api',
      query: {
        a: "3",
        b: "4"
      },
      headers: {
        'Content-Type': 'multipart/form-data',
        'b': 'a'
      },
      body: {
        a: 3,
        b: 'd'
      },
      get() {
        return 'google.com.tw'
      }
    }
    expect(curl(req)).toBe(`curl -F 'a=3' -F 'b=d' -H "Content-Type: multipart/form-data" -H "b: a" -X POST 'http://google.com.tw/api?a=3&b=4'`)
  })
  test('cover `not has content type request` to curl', () => {
    const req = {
      method: 'GET',
      protocol: 'http',
      path: '/api',
      headers: {
        a: '3'
      },
      query: {
        a: "3",
        b: "4"
      },
      get() {
        return 'google.com.tw'
      }
    }
    expect(curl(req)).toBe(`curl -H "a: 3" -X GET 'http://google.com.tw/api?a=3&b=4'`)
  })
  test('curl parse error', () => {
    const req = {
      method: 'POST',
      protocol: 'http',
      path: '/api',
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
        return 'google.com.tw'
      }
    }
    expect(curl(req)).toBe(`Content type error. Can't not parse`)
  })
})

describe('test handler with serialization option', () => {
  const curl = require('../main').curl(req => {
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
      path: '/api',
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
        return 'google.com.tw'
      }
    }
    expect(curl(req)).toBe(`curl -d '{"a":3}' -H "Content-Type: application/json" -H "b: a" -X POST 'http://google.com.tw/api?a=3&b=4'`)
  })
  test('parse serializationOption error', () => {
    const req = {
      method: 'POST',
      protocol: {
        test: 'http'
      },
      path: '/api',
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
        return 'google.com.tw'
      }
    }
    expect(curl(req)).toBe(`Parse error: TypeError: Cannot read property 'query' of undefined`)
  })
});