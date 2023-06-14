const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const conection = require("./database/database")

//view engine
app.set('view engine', 'ejs');

//Body parser:
app.use(bodyParser.urlenconded({extends: false}));
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

app.get("/", (req, res)=>{
    res.render("index");
})

app.listen(8080, ()=>{
    console.log("O servidor está rodando!");
})