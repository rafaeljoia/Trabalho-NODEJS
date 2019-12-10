const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")
const usersController = require("./users/UsersController")


const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require('./users/User');



//Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com o banco de dados!")
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })

// Estou dizendo para o Express usar o EJS como View engine
app.set('view engine','ejs');


//Configuração de Sessão
//MAX Age tempo de expiração da sessão em milisegundos
app.use(session({
    secret: "NODEJS_POS_INATEL",
    cookie: {
        maxAge: 30000
    },
}));


app.use(express.static('public'));
// Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//app.use("prefixo", object controller)
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

// Rotas
app.get("/",(req, res) => {

    Article.findAll({
        order:[
            ['id', 'DESC']
        ]
    }).then(articles=>{
        Category.findAll().then(categories=>{
            res.render("index",{articles: articles, categories:categories}); 
   
        });
        
         });

    
});

app.get("/article/:slug", (req,res)=>{

    var slug = req.params.slug;

    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article=>{
        if(article != undefined){
      Category.findAll().then(categories=>{
            res.render("article",{article: article, categories: categories}); 
        });
          
      
        }else{
            res.redirect("/");
        }
    }).catch(err=>{
           res.redirect("/");
    });

});

app.get("/category/:slug", (req, res)=>{
var slug = req.params.slug;

Category.findOne({
    where: {
        slug: slug
    },
    include: [{model: Article}]
}).then(category =>{

    if(category != undefined){
        Category.findAll().then(categories=>{
            res.render("index", {articles: category.articles, categories: categories});
        })    
    }else{
      res.redirect("/");    
    }

}).catch(err=>{
    res.redirect("/");
});

});

app.listen(9090, ()=>{
    console.log("O servidor está rodando");
});