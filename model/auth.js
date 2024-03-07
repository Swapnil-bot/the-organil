let joi = require("joi");
let { User } = require("../schema/user")
let { validate } = require("../helper/validate")
let bcrypt = require("bcrypt")
let security = require("../helper/security")
let config = require("config");
let mailCrediential = config.get("mailCrediential");
let { sendMail } = require("../helper/mailer")

async function registerUser(params) {
    // User data validation
    let schema = joi.object({
        username: joi.string().min(6).required(),
        email: joi.string().email().required(),
        password: joi.string().required()
    })
    let valid = await validate(schema, params).catch((error) => { return { error } });
    if (!valid || (valid && valid.error)) {
        return { error: valid.error, status: 500 }
    }
    // Check if user exist
    let user = await User.findOne({ where: { emailID: params.email } }).catch((error) => { return { error } });
    if (user) {
        return { error: "User already exists", status: 409 };
    }
    // hash Password  
    let hashPassword = await bcrypt.hash(params.password, 10).catch((error) => { return { error } });
    if (!hashPassword || (hashPassword && hashPassword.error)) {
        return { error: "Internal server error", status: 500 }
    }
    // Data Format
    let data = {
        name: params.username,
        emailID: params.email,
        password: hashPassword
    }
    // Insert Data Into DB
    let insert = await User.create(data).catch((error) => { return { error } });
    if (!insert || (insert && insert.error)) {
        return { error: "internal server error", status: 500 }
    }
    // Response format
    let response = {
        Id: insert.id,
        username: insert.name,
        email: insert.emailID
    }
    // return response
    return { data: response }
}
async function loginUser(params) {
    // User data validation
    let schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(8).max(18).required()
    })
    let valid = await validate(schema, params).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error, status: 400 }
    }
    // check if Email exist 
    let isExist = await User.findOne({ where: { emailID: params.email } }).catch((error) => { return { error } });
    if (!isExist || (isExist && isExist.error)) {
        return { error: "User not Found", status: 401 };
    }
    // Check if password exist
    let password = await bcrypt.compare(params.password, isExist.password).catch((error) => { return { error } });
    if (!password || (password && password.error)) {
        return { error: "Password not match", status: 403 }
    }
    // Generate token
    let token = await security.signAsync({ id: isExist.id }).catch((error) => { return { error } });
    if (!token || (token && token.error)) {
        return { error: "Internal server error", status: 500 }
    }
    // Save token in Db
    let update = await User.update({ token }, { where: { id: isExist.id } }).catch((error) => { return { error } });
    if (!update || (update && update.error)) {
        return { error: "User not Login, please  try again", status: 500 }
    }
    // return token
    return { token }
}
async function fogetPassword(params) {
    // User data validation
    let schema = joi.object({
        email: joi.string().email().required()
    })
    let valid = await validate(schema, params).catch((error) => { return { error } });
    if (!valid || (valid && valid.error)) {
        return { error: valid.error, status: 500 }
    }
    // Check if email exist
    let user = await User.findOne({ where: { emailID: params.email } }).catch((error) => { return { error } });
    if (!user || (user && user.error)) {
        return { error: "User not found", status: 403 }
    }
    // Generate OTP
    let otp = security.GenerateOTP(6);

    // Hash OTP
    let hashOtp = await bcrypt.hash(otp, 10).catch((error) => { return { error } });
    if (!hashOtp || (hashOtp && hashOtp.error)) {
        return { error: "Internal Server Error", status: 500 }
    }
    // Save it INTO Db
    let insert = await User.update({ otp: hashOtp }, { where: { id: user.id } }).catch((error) => { return { error } });
    if (!insert || (insert && insert.error)) {
        return { error: "User can't Login, Please Try Again", status: 500 }
    }
    // Send Email to user
    let data = {
        from: mailCrediential.user,
        to: params.email,
        subject: "Forgot Password OTP",
        text: `Your OTP for Forgotting password is ${otp}`
    }
    let send = await sendMail(data).catch((error) => { return { error } });
    if (!send || (send && send.error)) {
        return { error: "Internal Server Error", status: 500 }
    }
    // Return response
    return { data: "success" };
}
async function resetPassword(params) {
    // UserData validation
    let schema = joi.object({
        email: joi.string().email().required(),
        otp: joi.string().min(6).max(6).required(),
        newPassword: joi.string().required()
    })
    let valid = await validate(schema, params).catch((error) => { return { error } });
    if (!valid || (valid && valid.error)) {
        return { error: valid.error, status: 500 }
    }
    // Check if email exist
    let user = await User.findOne({ where: { emailID: params.email } }).catch((error) => { return { error } });
    if (!user || (user && user.error)) {
        return { error: "User not found", status: 403 }
    }
    // Compare Otp
    let otp = await bcrypt.compare(params.otp, user.otp).catch((error) => { return { error } })
    if (!otp || (otp && otp.error)) {
        return { error: "Otp not match", status: 402 }
    }
    // Hash Pasword
    let hashPassword = await bcrypt.hash(params.newPassword, 10).catch((error) => { return { error } })
    if (!hashPassword || (hashPassword && hashPassword.error)) {
        return { error: "Something Went Wrong", status: 403 }
    }
    // Update password in DB
    let update = await User.update({ password: hashPassword, otp: "" }, { where: { id: user.id } }).catch((error) => { return { error } });
    if (!update || (update && update.error)) {
        return { error: "Internal Server Error", status: 500 }
    }
    // Return Response
    return { data: "Password changed successful" }
}
async function changePassword(params, userData) {
    // User Data validation
    let schema = joi.object({
        oldPassword: joi.string().required(),
        newPassword: joi.string().required()
    });
    let valid = await validate(schema, params).catch((error) => { return { error } });
    if (!valid || (valid && valid.error)) {
        return { error: valid.error, status: 500 }
    }
    // fetch User data from Db
    let user = await User.findOne({ where: { id: userData.id } }).catch((error) => { return { error } });
    if (!user || (user && user.error)) {
        return { error: "User Not Found", status: 404 };
    }
    // Compare Old Password
    let compareOldPass = await bcrypt.compare(params.oldPassword, user.password).catch((error) => { return { error } });
    if (!compareOldPass || (compareOldPass && compareOldPass.error)) {
        return { error: "Password Not Valid", status: 400 }
    }
    // Hash new password 
    let newPassword = await bcrypt.hash(params.newPassword, 10).catch((error) => { return { error } });
    if (!newPassword || (newPassword && newPassword.error)) {
        return { error: "Internal server error", status: 500 }
    }
    // Update new password in DB
    let updatedUser = await User.update({ password: newPassword }, { where: { id: userData.id } }).catch((error) => { return { error } })
    if (!updatedUser || (updatedUser && updatedUser.error)) {
        return { error: "Internal server error", status: 500 }
    }
    // Return response
    return { data: "Password Changed Successfully" }
}
async function logOut(userData) {
    // User Data Validation
    let schema = joi.object({
        id: joi.number().integer().required()
    })
    let valid = await validate(schema, { id: userData.id }).catch((error) => { return { error } });
    if (!valid || (valid && valid.error)) {
        return { error: valid.error, status: 500 }
    }
    // Check if User Exist 
    let checkExist = await User.findOne({ where: { id: userData.id } }).catch((error) => { return { error } });
    if (!checkExist || (checkExist && checkExist.error)) {
        return{error:"User Not Found",status:404}
    }
    // Update Token in DB
    let update = await User.update({token:""}, {where:{id:userData.id}}).catch((error)=>{return{error}})
    if(!update||(update&&update.error)){
        return{error:"Internal Server Error",status:500}
    }
    // Return response
    return {data:'Logged Out Successfully'}
}
module.exports = { registerUser, loginUser, fogetPassword, resetPassword, changePassword, logOut };