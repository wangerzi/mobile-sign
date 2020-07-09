# mobile-sign
A project to solve the problem of mobile api request signature verification.

# features
- multi language back-end demos
- more secret sign maker.

# usage
First, install mobile-sign
```shell script
npm install mobile-sign
```
Second, require it and calc the sign by key and secret.
```js
let sign = require('mobile-sign')
const token = sign.calcFormDataSign('your key', 'your secret', FormData, ''); // if you want to make a request by FormData
const token = sign.calcJsonSign('your key', 'your secret', json, ''); // or you can upload a json
``` 
Finally, send this token to your api server, your server can check it by the same algorithm.

## sign algorithm

You can enjoy it on `CodePen`

[https://codepen.io/jeffrey-lunaon/full/oNjQYww](https://codepen.io/jeffrey-lunaon/full/oNjQYww)

Every APP will apply a `key` and `secret` for `sign` Hash Encryption, client should make secret key as secure as possible.

Every request, you should use `key+sorted POST fields + soreted fields map to values + secret` to generate a string with utf8, and use the md5 to hash the sign, and request to back-end with your key(GET params or HTTP-Header). 

> The data of File, we upload the file md5 for check  

### http request demo

```http
POST /?key=6g5lE&sign=ad197a1657d9d2576469a5d5ad6e57ff HTTP/1.1
Host: www.badidu.com
Connection: keep-alive
Content-Length: 9053
Pragma: no-cache
X-token: 6g5lE&user_id&file&size_x&size_y&user_id&a88151ef1c53b2892cdde490774c6625&100&200&uid123&TnK2w&TnK2w
Cache-Control: no-cache
DNT: 1
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryg3TqD40tuUsq4mTx
Accept: */*
Origin: chrome-extension://coohjcphdfgbiolnekdpbcijmhambjff
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7

------WebKitFormBoundaryg3TqD40tuUsq4mTx
Content-Disposition: form-data; name="user_id"

uid123
------WebKitFormBoundaryg3TqD40tuUsq4mTx
Content-Disposition: form-data; name="size_x"

100
------WebKitFormBoundaryg3TqD40tuUsq4mTx
Content-Disposition: form-data; name="size_y"

200
------WebKitFormBoundaryg3TqD40tuUsq4mTx
Content-Disposition: form-data; name="file"; filename="51.jpg"
Content-Type: image/jpeg


------WebKitFormBoundaryg3TqD40tuUsq4mTx--
```