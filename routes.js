let express = require("express");
let router = express.Router();
let authController = require("./controller/auth");
let adminAuthController = require("./controller/adminAuth");

let {auth} = require("./middleware/auth")
router.get("/",(req,res)=>{
    return res.send("Welcome to the The organil")
})

// User Authetication Routes
router.post('/register',authController.register);
router.post('/login',authController.login);
router.post('/fogetPassword',authController.fogetPassword);
router.put('/resetPassword',authController.resetPassword);
router.put('/changePassword',auth,authController.changePassword);
router.put('/logOut',auth,authController.logOut);

// Admin Authetication Routes
router.post('/admin/register',adminAuthController.register);
router.post('/admin/login',adminAuthController.login);
router.post('/admin/fogetPassword',adminAuthController.fogetPassword);
router.put('/admin/resetPassword',adminAuthController.resetPassword);
router.put('/admin/changePassword',auth,adminAuthController.changePassword);
router.put('/admin/logOut',auth,adminAuthController.logOut);


module.exports = router;