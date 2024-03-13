let express = require("express");
let router = express.Router();
let authController = require("./controller/auth");
let categoryController=require('./controller/category')

let {auth} = require("./middleware/auth")

router.get("/",(req,res)=>{
    return res.send("Welcome to the The organil")
})

// Authetication Routes
router.post('/register',authController.register);
router.post('/login',authController.login);
router.post('/fogetPassword',authController.fogetPassword);
router.put('/resetPassword',authController.resetPassword);
router.put('/changePassword',auth,authController.changePassword);
router.put('/logOut',auth,authController.logOut);

// Category  Route
router.post('/category',auth,categoryController.create)
router.get('/category',auth,categoryController.list)
router.get('/category/:catId',auth,categoryController.detail)
router.put('/category/:catId',auth,categoryController.update)
router.delete('/category/:catId',auth,categoryController.deleteCategory)

//  Products Routes

module.exports = router;