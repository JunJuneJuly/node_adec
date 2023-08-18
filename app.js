const http = require('http');
const url = require('url');
const fs = require('fs');
const util = require('./util/util.js')
http.createServer((req, res) => {
  //设置响应的类型及编码格式
  res.setHeader('Content-Type', 'text/html;charset=utf-8');
  //过滤无效请求
  if (req.url == '/favicon.ico') {
    return false
  }
  const { pathname, query } = url.parse(req.url, true)
  console.log(pathname)
  console.log(query);
  if (pathname == '/register') {
    fs.readFile('./pages/register.html', (err, data) => {
      if (!err) {
        res.end(data.toString());
      }
    })
  }
  if (pathname == '/login') {
    fs.readFile('./pages/login.html', (err, data) => {
      if (!err) {
        res.end(data.toString());
      }
    })
  }
  //注册的ajax请求
  if (pathname == '/doregister') {
    const method = req.method.toLocaleLowerCase();
    // console.log(method)
    if (method == 'get') {
      let users = JSON.parse(fs.readFileSync('./data/user.json')) || [];
      let obj = query;
      users.push(obj)
      fs.writeFileSync('./data/user.json', JSON.stringify(users));
      res.end("<script>alert('注册成功');location.href='/login'</script>"); 
    }
  }
  //登录请求
  if(pathname == '/dologin'){
    const method = req.method.toLocaleLowerCase();
    if(method == 'post'){
      var str = ''
      req.on('data',(chunk)=>{
        str += chunk
      })
      req.on('end',function(){
        let { username,password } = util.formatStr(str)
        let users = JSON.parse(fs.readFileSync('./data/user.json'))
        let flag = users.some(item=>{
          return decodeURIComponent(item.username) == decodeURIComponent(username) && 
          decodeURIComponent(item.password) == decodeURIComponent(password)
        })
        if(flag){
          res.end("<script>alert('登陆成功');location.href='/index'</script>"); 
        }else{
          res.end("<script>alert('登陆失败');location.href='/login'</script>"); 
        }
      })
    }
  }
  if(pathname == '/index'){
    fs.readFile('./pages/index.html', (err, data) => {
      if (!err) {
        res.end(data.toString());
      }
    })
  }
  //获取用户接口
  if(pathname == '/users'){
    const users = JSON.parse(fs.readFileSync('./data/user.json')) || [];
    res.end(
      JSON.stringify({
        code:200,
        msg:'获取用户列表成功',
        users
      })
    )
  }
  //删除接口 deleteuser
  if(pathname == '/deleteuser'){
    const index = query.index;
    // console.log(index);
    const users = JSON.parse(fs.readFileSync('./data/user.json'))
    users.splice(index,1)
    fs.writeFileSync('./data/user.json',JSON.stringify(users));
    res.end(JSON.stringify({
      code:200,
      msg:'删除用户列表成功',
      users
    }))
  }
  //跳转修改页面
  if(pathname == '/edit'){
    fs.readFile('./pages/edit.html', (err, data) => {
      if (!err) {
        res.end(data.toString());
      }
    })
  }
  //修改接口
  if(pathname == '/user'){
    const id = parseInt(query.id);
    console.log(id);
    const users = JSON.parse(fs.readFileSync('./data/user.json')) || [];
    res.end(JSON.stringify({
      code:200,
      msg:'获取用户成功',
      user:users[id]
    }))
  }
  //提交修改
  if(pathname == '/doedit'){
    const method = req.method.toLocaleLowerCase();
    if(method == 'post'){
      var str = ''
      req.on('data',(chunk)=>{
        str += chunk
      })
      req.on('end',function(){
        let { username,password,id } = util.formatStr(str)
        let users = JSON.parse(fs.readFileSync('./data/user.json'))
        users.splice(id,1,{username:decodeURIComponent(username),
          password:decodeURIComponent(password)})
        fs.writeFileSync('./data/user.json',JSON.stringify(users))
        res.end("<script>alert('修改成功');location.href='/index'</script>"); 
      })
    }
  }
}).listen(8888)