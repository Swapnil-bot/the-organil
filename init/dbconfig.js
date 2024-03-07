let {Sequelize,DataTypes,Model,Op} = require("sequelize")
let config = require("config");
let mysql = config.get('mysql');
let sequelizeCon = new Sequelize(mysql);
sequelizeCon.authenticate().then((data)=>{console.log("Connect to DB");}).catch((error)=>{return{error:"Database Cannot connect"}});
module.exports = {sequelizeCon,DataTypes,Model};