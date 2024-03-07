let {sequelizeCon,DataTypes,Model} = require("../init/dbconfig");
class User extends Model{}
User.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING(),
        allowNull:false
    },
    emailID:{
        type:DataTypes.STRING(),
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING(),
        allowNull:false
    },
    contactNumber:{
        type:DataTypes.BIGINT(10),
        allowNull:true
    },
    otp:{
        type:DataTypes.STRING,
        allowNull:true
    },
    token:{
        type:DataTypes.STRING,
    },
    isDeleted:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
        allowNull:false
    },
    isActive:{
        type:DataTypes.BOOLEAN,
        defaultValue:true,
        allowNull:false
    },
    updatedBy:{
        type:DataTypes.INTEGER,
        allowNull:true
    }
},{tableName:"user",modelName:"User",sequelize:sequelizeCon})
// User.sync({force:true});
module.exports = {User};