const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const session = require('express-session');

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UserController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");

//view engine
app.set('view engine', 'ejs');

//Body parser:
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//static
app.use(express.static("public"));

//Utilizando as rotas criadas no controller
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

//Session:
app.use(session({
    secret:"palavradeseguranca"//texto aleatório para aumentar a segurança das sessões, como o sal do bcrypt
}))

//Database:
connection
    .authenticate()
    .then(()=> {
        console.log("Conexão feita com sucesso!");
    }).catch((error)=>{
        console.log(error);
    });


app.get("/", (req, res)=>{
   Article.findAll({
    order:[
        ['id', 'DESC']
    ],
    limit: 4
   }).then(articles => {
    Category.findAll().then(categories =>{
        res.render("index", {articles:articles, categories:categories})
    });
   });
});

app.get("/:slug", (req, res)=>{
    var slug = req.params.slug;
    Article.findOne({
        where:{
            slug:slug
        }
    }).then(article=>{
        if(article != undefined){
              Category.findAll().then(categories =>{
                 res.render("article", {article:article, categories:categories})
    });
        }else{
            res.redirect("/");
        }
    }).catch(err =>{
        res.redirect("/");
    });
});

app.get("/category/:slug", (req, res)=> {
    var slug = req.params.slug;
    Category.findOne({
        where:{
            slug: slug
        },
        include: [{model:Article}]
    }).then(category=>{
        if(category != undefined){
            Category.findAll().then(categories=>{
                res.render("index", {articles:category.articles, categories: categories})
            })
        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    })
})
app.listen(8080, ()=>{
    console.log("O servidor está rodando!");
})