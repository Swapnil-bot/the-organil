let auth = require("../model/auth");

async function register(req, res) {
    let data = await auth.registerUser(req.body).catch((error) => { return { error } });
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "Internal Server Error";
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({ "Error": error });
    }
    return res.send(data);
}
async function login(req, res) {
    let data = await auth.loginUser(req.body).catch((error) => { return { error } });
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "Internal Server Error";
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({ "Error": error });
    }
    return res.header("token", data.token).send({ data: "You're Login Successful" });
}
async function fogetPassword(req, res) {
    let data = await auth.fogetPassword(req.body).catch((error) => { return { error } });
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "Internal Server Error";
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({ "Error": error });
    }
    return res.send({ data: "Otp send successfully" });
}
async function resetPassword(req, res) {
    let data = await auth.resetPassword(req.body).catch((error) => { return { error } });
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "Internal Server Error";
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({ "Error": error });
    }
    return res.send({ data: "Password Changed successfully" });
}
async function changePassword(req, res) {
    let data = await auth.changePassword(req.body, req.userData).catch((error) => { return { error } });
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "Internal Server Error";
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({ "Error": error });
    }
    return res.send({ data: "Password Changed successfully" });
}
async function logOut(req, res) {
    let data = await auth.logOut(req.userData).catch((error) => { return { error } });
    console.log("data controller", data);
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "Internal Server Error";
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({ "Error": error });
    }
    return res.send({ data: "User Log Out successfully" });
}
module.exports = { register, login, fogetPassword, resetPassword, changePassword, logOut }