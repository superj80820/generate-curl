const utils = require('../utils')

test('hide', () => {
  expect(utils.hide()()).toBe('hide')
})

test('hash', () => {
  expect(utils.hash()('test')).toBe('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08')
})

test('slice', () => {
  expect(utils.slice(0, 2)('123456789')).toBe('12')
})
