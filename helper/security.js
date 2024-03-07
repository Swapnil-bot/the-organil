let jwt = require("jsonwebtoken");

function GenerateOTP(length) {
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() *10).toString();
    }
    return otp;
}

function signAsync(data,key = "123456789") {
    return new Promise((resolve, reject) => {
        jwt.sign(data,key,(error,data)=>{
            if (error) {
                return reject(error)
            }
            return resolve(data)
        })
    })
}
function verifyAsync(token,key = "123456789") {
    return new Promise((resolve, reject) => {
        jwt.verify(token,key,(error,data)=>{
            if (error) {
                return reject(error)
            }
            return resolve(data)
        })
    })
}

module.exports = {signAsync,verifyAsync,GenerateOTP}