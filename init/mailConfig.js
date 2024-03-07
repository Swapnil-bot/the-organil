let nodemailer = require("nodemailer");
let config = require("config");
let mailCrediential = config.get("mailCrediential");
let transport = nodemailer.createTransport({
    service:"gmail",
    port: 465,
    host:"smtp.gmail.com",
    secure:true,
    auth:mailCrediential
})
module.exports = {transport};