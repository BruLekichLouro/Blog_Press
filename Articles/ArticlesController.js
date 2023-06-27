const express= require('express');
const router = express.Router();
const Category= require("../categories/Category");
const Article = require("./Article");//model artigo
const slugify = require("slugify");

router.get('/admin/articles', (req, res) => {
    Article.findAll({
        include:[{model:Category}]
    }).then(articles =>{        
        res.render("admin/articles/index", {articles:articles});
    })
});

router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", {categories:categories})
    } )
   });

router.post("/articles/save", (req, res)=> {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category; 

    //Chama o modle e usa o c reate():
    Article.create({
        title:title,
        slug:slugify(title),
        body:body,
        categoryId:category
    }).then(()=>{
        res.redirect("/admin/articles");                                            
    })
}); 

router.post("/articles/delete", (req, res)=>{
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){//se for um número
            Article.destroy({
                where:{
                    id:id //destruir categoria que tem id igual ao que passei acima (req.body.id)
                }
            }).then(()=>{
                res.redirect("/admin/articles");
            })
        }else{//não for numero
            res.redirect("/admin/articles");
        }
    }else{//NULL
        res.redirect("/admin/articles");
    }
});

router.get("/admin/articles/edit/:id", (req, res)=>{
    var id = req.params.id;
    //procurar o artigo pelo id
    Article.findByPk(id).then( article=>{
        if(article != undefined){ //diferente de nulo
            Category.findAll().then(categories =>{
                res.render("admin/articles/edit", {categories:categories, article: article})
            });   
        }else{
            res.redirect("/");
        }
    }).catch(err =>{
        res.redirect("/");
    });
});

router.post("/articles/update", (req, res)=>{
    var id = req.body.id;
    var title= req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.update({title:title, body :body, categoryId:category, slug: slugify(title)},{
        where:{
            id:id
        }
    }).then(()=>{
        res.redirect("/admin/articles");
    }).catch(err =>{
        res.redirect("/");
    });
});
   module.exports= router;