async function validate(schema,params) {
    if (typeof(schema)!="object" || typeof(params) != "object") {
        return{error:"Please provide valid data"}
    }
    let valid = await schema.validateAsync(params,{abortEarly:false}).catch((error)=>{return {error}});  // Validate params against the
    if (!valid || (valid && valid.error)) {
        let msg = [];
        for(let i of valid.error.details){
            msg.push(i.message);
        }
        return{error:msg}
    }
    return{data:valid}
}
module.exports = {validate};