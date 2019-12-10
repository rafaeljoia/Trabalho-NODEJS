const Sequelize = require("sequelize");
const connection = require("../database/database");

const Category = connection.define('categories',  {
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

//Toda a vez que a aplicação for recarregada, o banco sincroniza as alterações
//Category.sync({force:true});

module.exports = Category;