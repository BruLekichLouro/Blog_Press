const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const categoriesController = require("./Categories/CategoriesController");
const articlesController = require("./Articles/ArticlesController");


//view engine
app.set('view engine', 'ejs');

//Body parser:
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//static
app.use(express.static("public"));

//Database:
connection
    .authenticate()
    .then(()=> {
        console.log("Conexão feita com sucesso!");
    }).catch((error)=>{
        console.log(error);
    })

    //Utilizando as rotas criadas no controller
app.use("/", categoriesController);
app.use("/", articlesController);


app.get("/", (req, res)=>{
    res.render("index");
})

app.listen(8080, ()=>{
    console.log("O servidor está rodando!");
})