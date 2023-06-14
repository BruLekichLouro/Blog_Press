const express = require("express");
const app = express();
const bodyParser = require("body-parser");

//view engine
app.set('view engine', 'ejs');

//Body parser:
app.use(bodyParser.urlenconded({extends: false}));
app.use(bodyParser.json());

//static
app.use(express.static("public"));

app.get("/", (req, res)=>{
    res.render("index");
})

app.listen(8080, ()=>{
    console.log("O servidor está rodando!");
})