let { sequelizeCon, DataTypes, Model } = require("../init/dbconfig")
class Category extends Model { }
Category.init({
    id: { 
        type: DataTypes.INTEGER(),
        primaryKey: true,
        autoIncrement: true, 
        allowNull: false 
    },
    categoryName: { 
        type: DataTypes.STRING(),
        allowNull: false
    },
    userID: { 
        type: DataTypes.INTEGER(), 
        allowNull: false
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
},{tableName:"category",modelName:"Category",sequelize:sequelizeCon});
// Category.sync({force:true})
module.exports={Category};