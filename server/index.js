const express = require('express')
const app = express()
const port = 5000
// const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// 비밀 정보 관리 파일 
const config = require('./config/key');
const {auth} = require('./middleware/auth')
const {User} = require("./models/User");

// application/x-www-form-urlencoded를 분석하게 해 줌
// app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended: true}));

// application/json를 분석하게 해 줌
// app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

const mongoose = require('mongoose')
// 아래 비밀 정보 처리
mongoose.connect(config.mongoURI)
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!!!')
})

app.get('/api/hello', (req, res) => {
  res.send('안녕하세요~')
})

app.post('/api/users/register', (req, res) => {

  // 회원 가입할 때 필요한 정보들은 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body) // req.body를 통해 client에서 정보를 받아올 수 있다.


  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err}) // 에러가 발생한 경우
    return res.status(200).json({ // 정상 실행된 경우
      success: true
    })
  })
})

app.post('/api/users/login', (req, res) => {

  console.log('req.body', req.body)
  // 요청된 이메일이 데이터베이스에 있는지 찾는다.
  User.findOne({email: req.body.email}, (err, user) => {
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    // 요청된 이메일이 데이터베이스에 있다면, 비밀번호가 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch) return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})
      
      // 비밀번호가 맞다면, Token 생성
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err)

        // 토큰을 쿠키에 "x_auth" 이름으로 저장한다. (로컬 스토리지에도 저장 가능)
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess: true, userId: user._id})
      })
    })

  })

})

// middleware: auth, root에 middleware 폴더 생성 후 auth.js
// 중간에 auth.js 실행
app.get('/api/users/auth', auth, (req, res) => {
  
  // 여기까지 왔다는 건 middleware 통과 -> Authentication이 True
  res.status(200).json({
    _id: req.user._id,
    
    // role이 0 일반유저 0아니면 관리자
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image

  })
})

app.get('/api/users/logout', auth, (req, res) => {
  
  // middleware(auth)에서 req.user를 받는다.
  User.findOneAndUpdate({_id: req.user._id},
    {token: ""}, // 토큰 삭제
    (err, user) => {
      if(err) return res.json({success: false, err});
      return res.status(200).send({
        success: true
      })
    })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})