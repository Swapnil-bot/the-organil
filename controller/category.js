let category = require("../model/category");

async function create(req,res) {
    console.log("req.userData.role",req.userData.role);
    // Check if admin Has Login
    if (req.userData.role != 2) {
        return res.status(401).send({error:"You're Not Authorize For This Category"});
    }
    let data = await category.catCreate(req.userData,req.body).catch((error)=>{return{error}});
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? (data && data.error) :"Internal Server Error";
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send(error)
    }
    return res.send({data:data.data});
}
async function list(req,res) {
    // Check if admin Has Login
    if (req.userData.role != 2) {
        return res.status(401).send({error:"You're Not Authorize For This Category"});
    }
    let data = await category.catList(req.userData).catch((error)=>{return{error}});
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? (data && data.error) :"Internal Server Error";
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send(error)
    }
    return res.send({data:data.data});
}
async function detail(req,res) {
    // Check if admin Has Login
    if (req.userData.role != 2) {
        return res.status(401).send({error:"You're Not Authorize For This Category"});
    }
    let data = await category.catDetail(req.userData,req.params.catId).catch((error)=>{return{error}});
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? (data && data.error) :"Internal Server Error";
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send(error)
    }
    return res.send({data:data.data});
}
async function update(req,res) {
    // Check if admin Has Login
    if (req.userData.role != 2) {
        return res.status(401).send({error:"You're Not Authorize For This Category"});
    }
    let data = await category.catUpdate(req.userData,req.body,req.params.catId).catch((error)=>{return{error}});
    console.log("data",data);
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? (data && data.error) :"Internal Server Error";
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send(error)
    }
    return res.send({data:data});
}
async function deleteCategory(req,res) {
    // Check if admin Has Login
    if (req.userData.role != 2) {
        return res.status(401).send({error:"You're Not Authorize For This Category"});
    }
    let data = await category.deleteCategory(req.userData,req.params.catId).catch((error)=>{return{error}});
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? (data && data.error) :"Internal Server Error";
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send(error)
    }
    return res.send({data:data});
}
module.exports = {create,list,detail,update,deleteCategory}