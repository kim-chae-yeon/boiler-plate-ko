const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
// salt 글자 수 설정
const saltRounds = 10

var jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({ // Schema
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // space 공백 없애주는 역할
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})


// save 전에 실행되는 함수 (next() 해줘야 됨)
userSchema.pre('save', function(next){
    
    var user = this;

    // salt를 이용해서 비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if(err) return next(err)

        if(user.isModified('password')){
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)

                // Store hash in your password DB.
                user.password = hash
                next()

            });
        }
        else{
            next()
        }
    })
})

userSchema.methods.comparePassword = function(plainPassword, cb){

    // plainPassword와 암호화된 비밀번호가 맞는지
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err)
        cb(null, isMatch)
    })

}

userSchema.methods.generateToken = function(cb){

    var user = this;

    // jsonwebtoken을 이용해서 token을 생성하기
    // Error: Expected "payload" to be a plain object.해결하기 위해 toJSON()
    var token = jwt.sign(user._id.toJSON(), 'secretToken'); 
    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb){
    var user = this;

    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded) {
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token}, function(err, user) {
            if(err) return cb(err);
            cb(null, user)
        })
    })

}
const User = mongoose.model('User', userSchema) // Schema(userSchema)를 감싸주는 Model(User)생성

module.exports = {User} // 다른 파일에서도 쓸 수 있게