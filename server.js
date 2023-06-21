const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const connection = require("./database/database")
const Register = require("./database/Register")

connection
    .authenticate()
    .then(()=>{
        console.log('conexão realizada');
    }).catch((err)=>{
        console.log('Erro de conexão'+err);
    })

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false}))
app.use(express.json())

app.use(express.static('public'))

app.get("/", (req,res)=>{
    res.render('index', {name: 'John'})
})

app.get("/login", (req,res)=>{
    res.render('login')
})

app.post("/login", (req,res)=>{
    
})

app.get("/register", (req,res)=>{
    res.render('register')
})

app.post("/register", async (req,res)=>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        await Register.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })   
        res.redirect('/login')
    } catch(err) {
        console.log("erro ao criar registro"+err);
        res.redirect('/register')
    }
})

app.listen(3000)