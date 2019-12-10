const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");


router.get("/admin/articles", adminAuth.authenticate, (req, res)=>{
    Article.findAll({
        include: [{model: Category}]
    }).then(articles=>{
        res.render("admin/articles/index", {articles: articles})
    })
});



router.get("/admin/articles/new", adminAuth.authenticate , (req, res)=>{
    Category.findAll().then(categories=>{
        res.render("admin/articles/new", {categories: categories});
    });
});

router.post("/admin/articles/save", adminAuth.authenticate, (req,res)=>{

    var title = req.body.title
    var body = req.body.body
    var category_id = req.body.category

    Article.create({
        title:title,
        slug: slugify(title),
        body: body,
        categoryId: category_id
    }).then(()=>{
        res.redirect("/admin/articles")
    });

});



router.get("/admin/articles/edit/:id", adminAuth.authenticate, (req,res)=>{
    var id = req.params.id;
    if(isNaN(id)){
        res.redirect("admin/articles");
    }

    Article.findByPk(id).then(article =>{
        if(article != undefined){
            Category.findAll().then(categories=>{
                res.render("admin/articles/edit", {article: article, categories: categories});
            });

        }else{
             console.log("ERRO");
            res.redirect("admin/articles");
        }
    }).catch(error=>{
        console.log("ERRO");
        console.log(error);
        res.redirect("admin/articles");
    });

});


router.post("/articles/delete", adminAuth.authenticate,(req, res)=>{
    var id = req.body.id;

    if(id != undefined){
        if(!isNaN(id)){
            Article.destroy({
                where:{
                    id:id
                }
            }).then(()=>{
                res.redirect("/admin/articles");
            });

        }else{//Não for numero
            res.redirect("/admin/articles");
        }
    }else{// se for vazio
            res.redirect("/admin/articles");
    }

});

router.post("/articles/update", adminAuth.authenticate, (req,res)=>{

    var title = req.body.title
    var body = req.body.body
    var category_id = req.body.category

    var id = req.body.id;

    Article.update({ title: title, body: body , categoryId: category_id, slug: slugify(title)}, {
        where:{
            id:id
        }
    }).then(()=>{
        res.redirect("/admin/articles/")
    });


});


router.get("/articles/page/:num",(req, res)=>{
    var page = req.params.num;

    if(isNaN(page) || page == 1){
        offset=0
    }else{
        offset = (parseInt(page) -1) * 4;
    }

    
    Article.findAndCountAll({limit: 4,
    offset: offset }).then(articles=>{
        
        var next;
        if(offset + 4 >= articles.count){
            next = false;
        }else{
            next = true;
        }
        Category.findAll().then(categories=>{
            var result = {
                next: next,
                articles: articles
             }

        res.render("admin/articles/page", {result: result, categories: categories});

        });

        
    });


});


module.exports = router;