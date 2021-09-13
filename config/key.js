if(process.env.NODE_ENV === 'production'){ // 배포 환경인 경우
    module.exports = require('./prod'); 
}else{ // 로컬 환경인 경우
    module.exports = require('./dev');
}