const express= require('express');
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");

router.get("/admin/users", (req, res) =>{
    res.send("Listagem de usuários")
});

router.get("/admin/users/create", (req, res)=>{
    res.render("admin/users/create")
});

router.post("/users/create", (req, res)=>{
    var email= req.body.email;
    var password = req.body.password;

    //Criando hash e enviando para o bd:
        //para aumentar a segurança:
        var salt = bcrypt.genSaltSync(10);
        //gerando o hash:
        var hash = bcrypt.hashSync(password, salt);

        User.create({
            email:email,
            password:hash
        }).then(()=>{
            res.redirect("/");
        }).catch((err)=>{
            res.redirect("/");
        });
});

module.exports= router;