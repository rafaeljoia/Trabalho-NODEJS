const Sequelize = require("sequelize");
const connection = require("../database/database");

const User = connection.define('users',  {
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

//Toda a vez que a aplicação for recarregada, o banco sincroniza as alterações
//User.sync({force:true});

module.exports = User;