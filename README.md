# 短链接生成器

### 设计思路
* 前端：用简单HTML，AngularJS和Bootstrap建立一个表格，用户可以输入原网址，点击提交按钮，Controller将合法的URL输入用async HTTP方法访问服务器，并由相应的函数处理，将生成的短网址返回。如果用户输入的URL不合法，提示用户重新输入。

* 后端：主要用Express和Mongoose搭建Node.js服务器，提供两个功能的实现。
第一，如果请求的原网址没有通过本服务器转换过，根据数据库的地址计数器生成唯一的短网址path，并与原网址一起保存在数据库，返回生成的短网址。如果原网址已经通过本服务器转换，则从数据库提取对应的短网址，返回给浏览器。
第二，当用户访问短网址时，查询数据库，如果短网址已经存在，则重新定向到对应的原网址，如果短网址不存在，则返回404状态。

### DB Schema 和 APIs
* DB中用到两个Collection：

```javascript
//linkpair用来存放原网址与对应的短网址
var LinkPairSchema = mongoose.Schema({
	originalLink: String,
	shortenedLink: String
}, {collection: 'linkpair'});
```

```javascript
//counter用来记录linkpair已经保存的document数，从而产生唯一的短网址path
var CounterSchema = mongoose.Schema({
	_id: String,
	counter: Number
}, {collection: 'counter'});
```

* APIs
  
  处理对原网址转换的请求api: app.post('/originalLink', getShortenedLink);

  用户访问短网址的api: app.get('/:shortenedLink', rediToOriginLink);

### 运行与测试
* 本地：需要安装node，mongodb。用node执行服务器server.js文件，连接数据库，在浏览器端访问本地测试地址：http://localhost:3000 即可进行本地测试。
* Openshift：直接访问Openshift链接进行公共测试。


### 技术
* HTML5, BootStrap, AngularJS
* Node.js, Express.js, Mongoose, MongoDB
* Openshift, Git, Github


### 链接
* Openshift 访问地址: http://linkshortener-xianggao.rhcloud.com
* GitHub Repo 地址：https://github.com/gxless/LinkShortener



