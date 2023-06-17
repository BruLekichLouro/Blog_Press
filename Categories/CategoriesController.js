const express= require('express');
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");

router.get('/admin/categories/new', (req, res) => {
 res.render("admin/categories/new");
});
router.post('/categories/save', (req, res) => {
    var title= req.body.title;
    if(title != undefined){
        Category.create({
            title:title,
            slug:slugify(title)
        }).then(()=>{
            res.redirect("/admin/categories");
        })
    }else{
        res.redirect("/admin/categories/new")
    }
   });
   
router.get("/admin/categories", (req, res)=>{
    Category.findAll().then(categories=>{
        res.render("admin/categories/index", {categories: categories});
    });
});

router.post("/categories/delete", (req, res)=>{
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){//se for um número
            Category.destroy({
                where:{
                    id:id //destruir categoria que tem id igual ao que passei acima (req.body.id)
                }
            }).then(()=>{
                res.redirect("/admin/categories");
            })
        }else{//não for numero
            res.redirect("/admin/categories");
        }
    }else{//NULL
        res.redirect("/admin/categories");
    }
});

router.get("/admin/categories/edit/:id", (req, res)=>{
    var id = req.params.id;// id dos parametros da rota
    if(isNaN(id)){ // se não for número, redireciona
        res.redirect("/admin/categories");
    }
    //findByPk(): modo rápido de pesquisar algo pelo id
    Category.findByPk(id).then(category => {
        if(category != undefined){ //se é nula ou não
            res.render("admin/categories/edit", {category:category})
        }else{//null
            res.redirect("/admin/categories");
        }
    }).catch(erro=>{
        res.redirect("/admin/categories");
    })
});

router.post("/categories/update", (req, res)=>{
    var id= req.body.id;
    var title= req.body.title;
    //Update no model:
    Category.update({title: title, slug: slugify(title)}, {
        where:{
            id:id
        }
    }).then(()=>{
        res.redirect("/admin/categories");
    })
});

module.exports= router;