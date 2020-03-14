const sha256 = require("crypto-js/SHA256");

function hide () {
  return () => 'hide'
}

function hash () {
  return value => sha256(value).toString()
}

function slice (start, end) {
  return value => value.slice(start, end)
}

module.exports = {
  hide,
  hash,
  slice
}
