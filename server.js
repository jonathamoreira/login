if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const passport = require("passport")
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

//Conexão com banco de dados
const connection = require("./database/database")
const Register = require("./database/Register")

const initializePassport = require("./passportConfig")

initializePassport(passport, async (email) => {
  try {
    const user = await Register.findOne({ where: { email: email } });
    return user;
  } catch (error) {
    throw error;
  }
});


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
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.use(express.static('public'))

app.get("/",checkAuthenticated, (req,res)=>{
    res.render('index', {name: req.user.name})
})

app.get("/login",checkNotAuthenticated, (req,res)=>{
    res.render('login')
})

app.post("/login", checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get("/register", checkNotAuthenticated, (req,res)=>{
    res.render('register')
})

app.post("/register", checkNotAuthenticated, async (req,res)=>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        await Register.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })   
        res.redirect('/')
    } catch(err) {
        console.log("erro ao criar registro"+err);
        res.redirect('/register')
    }
})

app.delete("/logout", (req,res)=>{
    req.logOut(()=>{
        res.redirect('/login')
    })
})

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}
function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    next()
}
app.listen(3000)