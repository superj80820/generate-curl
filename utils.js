const crypto = require('crypto');

function hide () {
  return () => 'hide'
}

function hash () {
  return value => {
    return crypto.createHash('sha256')
      .update(value)
      .digest('hex')
  }
}

function slice (start, end) {
  return value => value.slice(start, end)
}

module.exports = {
  hide,
  hash,
  slice
}
