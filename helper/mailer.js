let {transport} = require("../init/mailConfig");
async function sendMail(params) {
    if (typeof(params.from)!="string" || typeof(params.to)!="string") {
        return{error:"Please provide From & To as In string Form"}
    }
    let send = await transport.sendMail(params).catch((error)=>{return{error}});
    if (!send || (send && send.error)) {
        return{error:"Internal Server Error",status:500}
    }
    return{data:send}
}
module.exports = {sendMail}