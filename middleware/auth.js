let {verifyAsync} = require("../helper/security");
let {User} = require("../schema/user")

async function auth(req,res,next) {
    // Check if token exist in DB
    let token = req.header("token");
    if (typeof(token)!="string") {
        return res.status(400).send({error:"Token Is Required"})
    }
    // Decrypt token
    let decryptedToken = await verifyAsync(token).catch((error)=>{return{error}});
    if (!decryptedToken || (decryptedToken && decryptedToken.error)){
        return res.status(403).send({error:"Token is not valid"});
    }
    // Check if user id and token present in DB
    let user = await User.findOne({where:{token:token,id:decryptedToken.id}}).catch((error)=>{return {error}});
    if (!user || (user && user.error)) {
        return res.status(403).send({error: "Access Denied"});
    }
    // Check if user is not deleted
    if (user.isDeleted) {
        return res.status(403).send({error:"User is Deleted"})
    }
    req["userData"] = {
        id:user.id,
        name:user.name,
        email:user.emailID
    }
    //  If all checks pass then move to next middleware
    next()
}
module.exports = {auth}