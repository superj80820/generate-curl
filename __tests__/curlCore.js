const curlCore = require('../curlCore')

describe('test cover', () => {
  test('cover headers not with option', () => {
    const headers = {
      'Content-Type': 'c',
      'b': 'a'
    }
    expect(curlCore.coverHeader(headers)).toBe(`-H "Content-Type: c" -H "b: a"`)
  })
  test('cover headers with option', () => {
    const headers = {
      'Content-Type': 'c',
      'b': 'a'
    }
    const option = {
      '$["Content-Type"]': value => `${value}d`,
      '$.b': value => `${value}z`
    }
    expect(curlCore.coverHeader(headers, option)).toBe(`-H "Content-Type: cd" -H "b: az"`)
  })
  test('cover headers with not effect option', () => {
    const headers = {
      'Content-Type': 'c',
      'b': 'a'
    }
    const option = {
      'notEffect': value => `${value}d`
    }
    expect(curlCore.coverHeader(headers, option)).toBe(`-H "Content-Type: c" -H "b: a"`)
  })
  test('cover query not with option', () => {
    const query = {
      'a': '1',
      'b': '2'
    }
    expect(curlCore.coverQuery(query)).toBe(`a=1&b=2`)
  })
  test('cover query with option', () => {
    const query = {
      'a': '1',
      'b': '2'
    }
    const option = {
      '$.a': value => `${value}d`
    }
    expect(curlCore.coverQuery(query, option)).toBe(`a=1d&b=2`)
  })
  test('cover json body not with option', () => {
    const body = {
      'a': {
        'c': 'd',
        'e': 'f'
      },
      'b': 'a'
    }
    expect(curlCore.coverJsonBody(body)).toBe('{"a":{"c":"d","e":"f"},"b":"a"}')
  })
  test('cover json body with option', () => {
    const body = {
      'a': {
        'c': 'd',
        'e': 'f'
      },
      'b': 'a'
    }
    const option = {
      '$..e': value => `${value}z`
    }
    expect(curlCore.coverJsonBody(body, option)).toBe('{"a":{"c":"d","e":"fz"},"b":"a"}')
  })
  test('cover json array body with option', () => {
    const body = [
      {
        'a': {
          'c': 'd',
          'e': 'f'
        },
        'b': 'a'
      },
      {
        'a': {
          'c': 'd',
          'e': 'f'
        },
        'b': 'a'
      }
    ]
    const option = {
      '$..e': value => `${value}z`
    }
    expect(curlCore.coverJsonBody(body, option)).toBe('[{"a":{"c":"d","e":"fz"},"b":"a"},{"a":{"c":"d","e":"fz"},"b":"a"}]')
  })
  test('cover json form data body', () => {
    const body = {
      'a': 3,
      'b': 'a'
    }
    expect(curlCore.coverFormDataBody(body)).toBe('a=3&b=a')
  })
})
