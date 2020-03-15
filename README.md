# generate-curl

在後端收到requests時，常常需要將這些requests參數複製下來至[postman](https://www.postman.com/)或者[insomnia](https://insomnia.rest/)重組，這十分的麻煩，**generate-curl**提供將requests轉換成curl的功能，讓後端人員可以使用此curl直接轉換至postman, insomnia, terminal來debug，另外，**generate-curl**也提供函數來讓重要資訊隱藏。

<div align="center">
  <img src="https://i.imgur.com/6b9qeTc.gif">
</div>

## 安裝

`npm install generate-curl`

## 如何使用

### 對於express.js server

express.js可直接使用

```javascript
const express = require('express')
const bodyParser = require('body-parser')
const curl = require('generate-curl').curl()
const { utils: curlUtils } = require('generate-curl')

const app = express();

const upload = require('multer')()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/monitor', upload.none(), function(req, res) {
  const option = {
    headers: {
      '$["authorization"]': curlUtils.hide()
    }
  }
  console.log(curl(req, option))
  // curl -d '{"data":"12345"}' -H "host: localhost:3003" -H "content-type: application/json" -H "authorization: hide" -X POST 'http://localhost:3003/monitor?query=abc'
  res.send('ok')
})

app.listen(3003, function () {
  console.log('3003');
})
```

### 對於其他node.js server

只需在初始化**generate-curl**時設置不同框架的req所對應至express的參數即可

```javascript
const curl = require('generate-curl').curl(req => {
  protocol: req.protocol,
  baseUrl: req.baseUrl,
  headers: req.headers,
  method: req.method,
  body: req.body,
  query: req.query,
  get (host) {
    return req.get(host)
  }
})
```

比如koa的ctx.path對應到express的req.baseUrl，所以須對應兩者

```javascript
const Koa = require('koa')
const bodyParser = require('koa-bodyparser');
const curl = require('generate-curl').curl(ctx => {
  return {
    baseUrl: ctx.path
  }
})

const app = new Koa();
app.use(bodyParser());

app.use( async ( ctx ) => {
  ctx.body = ctx.request.body
  console.log(curl(ctx))
})

app.listen(3000, () => {
  console.log('request get is starting at port 3000')
})
```

---

## 目前支援content-type

* [x] application/json
* [x] application/x-www-form-urlencoded
* [x] multipart/form-data //對req.file不支援

---

## 提供的utils function

當有敏感資訊不想顯示出來時，可以使用option對此做調整，例如`authorization`不想顯示時，可使用hide隱藏，目前有以下特性:

* 使用[jsonPath](https://github.com/dchester/jsonpath)來對應路徑，可以使用jsonPath的語法來對應複雜的巢狀json
* utils.hide(): 隱藏value
* utils.hash(): 雜湊value
* utils.slice(start, end): 切割字串
* 可自訂處理function

例子

```javascript
const option = {
  headers: {
    '$["authorization"]': curlUtils.hide(),// authorization會被隱藏，即 authorization: hide
    '$["userId"]': curlUtils.hash(),// userId會被hash，即 hashuserId: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
    '$["uuid"]': curlUtils.slice(0, 3)// uuid會被字串切割，即 uuid: 123
  }
  body: {
    '$..name': value => `${value}1234`// 在body裡的name會被自訂fucntion處理，此處即加上1234字串
  }
}
console.log(curl(req, option))
```