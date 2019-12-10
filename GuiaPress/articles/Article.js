const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category");

const Article = connection.define('articles',  {
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    },
    body:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

//1 para muitos
Category.hasMany(Article);
//Chave estrangeira
Article.belongsTo(Category); //um artigo pertence a uma categoria 1 para 1

//Article.sync({force:true});

module.exports = Article;