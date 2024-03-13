let {Category} = require("../schema/category");
let joi = require("joi");
let {validate} = require("../helper/validate")

async function catCreate(userData,params) {
    // Data Validation
    let schema = joi.object({
        categoryName:joi.string().required()
    })
    let valid = await validate(schema,params).catch((error)=>{return{error}});
    if (!valid || (valid && valid.error)) {
        return{error:valid.error,status:500}
    }
    // Check if Category Exist in DB
    // let cat = await Category.findOne({where:{categoryName:params.categoryName}}).catch((error)=>{return{error}});
    // if (!cat || (cat && cat.error)) {
    //     return{error:"Category Already Created",status:401}
    // } 

    // Data Format 
    let data = {
        categoryName:params.categoryName,
        userID:userData.id
    }
    // Insert Data into DB
    let insert = await Category.create(data).catch((error)=>{return{error}})
    if (!insert || (insert && insert.error)) {
        return{error:"Internal Server Error",status:500}
    }
    // Response Data
    let response = {
        categoryName:insert.categoryName
    }
    // Return Data 
    return{data:response}
}
async function catList(userData) {
    // Fetch All categories
    let cat = await Category.findAll().catch((error)=>{return{error}});
    if (!cat || (cat && cat.error)) {
        return{error:"Category Not Found, Please Create Category First",status:401}
    } 
    // Return All Categories
    return{data:cat}
}
async function catDetail(userData,catId) {
    // Data Validation
    let schema = joi.object({
        id:joi.number().required()
    })
    let joiParams = {};
    joiParams["id"] = catId;
    let valid = await validate(schema,joiParams).catch((error)=>{return{error}});
    if (!valid || (valid && valid.error)) {
        return{error:valid.error,status:500}
    }
    // Check if category Exist
    let cat = await Category.findOne({where:{id:catId}}).catch((error)=>{return{error}});
    if (!cat || (cat && cat.error)) {
        return{error:"Category Not Found, Please Create Category First",status:401}
    } 
    // Return data
    return{data:cat}
}
async function catUpdate(userData,params,catId) {
    // Data Validation
    let schema = joi.object({
        id:joi.number().required(),
        categoryName:joi.string()
    })
    let joiParams = {...params};
    joiParams["id"] = catId;
    let valid = await validate(schema,joiParams).catch((error)=>{return{error}});
    if (!valid || (valid && valid.error)) {
        return{error:valid.error,status:500}
    }
    // Check if category Exist
    let cat = await Category.findOne({where:{id:catId}}).catch((error)=>{return{error}});
    if (!cat || (cat && cat.error)) {
        return{error:"Category Not Found, Please Create Category First",status:401}
    }
    // Update the Category
    let update = await Category.update({categoryName:params.categoryName},{where:{id:catId}}).catch((error)=>{return{error}});
    if (!update || (update && update.error)) {
        return{error:"Internal Server Error",status:500}
    }
    // Return Updated data
    return{message:"Category Has Been Updated Successfully"}
}
async function deleteCategory(userData,catId) {
    // Data Validation
    let schema = joi.object({
        id:joi.number().required()
    })
    let joiParams = {};
    joiParams["id"] = catId;
    let valid = await validate(schema,joiParams).catch((error)=>{return{error}});
    if (!valid || (valid && valid.error)) {
        return{error:valid.error,status:500}
    }
    // Check if category Exist
    let cat = await Category.findOne({where:{id:catId}}).catch((error)=>{return{error}});
    if (!cat || (cat && cat.error)) {
        return{error:"Category Not Found, Please Create Category First",status:401}
    }
    // Check if category is already Deleted
    if (cat.isDeleted != false) {
        return{error:"Category Is already Deleted"}
    }
    // Delete the Category
    let catDelete = await Category.update({isDeleted:true},{where:{id:catId}}).catch((error)=>{return{error}})
    if (!catDelete || (catDelete && catDelete.error)) {
        return{error:"Internal Server Error",status:500}
    }
    // Return deleted message
    return{message:"Category Has Been Deleted Successfully"}
}
module.exports = {catCreate,catList,catDetail,catUpdate,deleteCategory}