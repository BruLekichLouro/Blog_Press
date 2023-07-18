const express= require('express');
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");

router.get("/admin/users", (req, res) =>{
   User.findAll().then(users=>{
     res.render("admin/users/index", {users: users})
   });
});

router.get("/admin/users/create", (req, res)=>{
    res.render("admin/users/create")
});

router.post("/users/create", (req, res)=>{
    var email= req.body.email;
    var password = req.body.password;

    //Verificando se o email já está cadastrado no BD pra evitar emails duplicados:
    User.findOne({
        where:{email:email}
    }).then(user =>{
        if(user==undefined){

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        
        User.create({
            email:email,
            password:hash
        }).then(()=>{
            res.redirect("/");
        }).catch((err)=>{
            res.redirect("/");
        });
        }else{
            res.redirect("/admin/users/create")
        }
    })
});

//Rota pág de login
router.get("/login", (req, res) => {
    res.render("admin/users/login")
});

//Rota para login
router.post("/authenticate", (req, res)=>{
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where: {email:email}}).then(user =>{
        if(user != undefined){
            //Se exite usuário com este email, vou validar a senha comparando a password digitada hasheada(na pág de login)  com a hasheada salva no BD
            var correct = bcrypt.compareSync(password, user.password);

            if(correct){ //criar sessão chamada user que só tem acesso quem faz login:
                req.session.user={
                    id:user.id,
                    email:user.email
                }
                res.json(req.session.user)
            }else{
                res.redirect("/login");
            }
        }else{
            res.redirect("/login");
        }
    })
})

module.exports= router;