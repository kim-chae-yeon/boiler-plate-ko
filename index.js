const express = require('express')
const app = express()
const port = 3000
// const bodyParser = require('body-parser');

// 비밀 정보 관리 파일 
const config = require('./config/key');

const {User} = require("./models/User");

// application/x-www-form-urlencoded를 분석하게 해 줌
// app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended: true}));

// application/json를 분석하게 해 줌
// app.use(bodyParser.json());
app.use(express.json());

const mongoose = require('mongoose')
// 아래 비밀 정보 처리
mongoose.connect(config.mongoURI)
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!!!')
})

app.post('/register', (req, res) => {

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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})