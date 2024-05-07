const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();

// Serve static files from the 'public' folder
app.use(express.static('public'));


const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database : "db_name"
});

connection.connect((err)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log("db connected!");
});

//setup views
app.set("view engine","ejs");
app.set("views",path.join(__dirname, "views"));

// Session middleware setup
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Flash messages middleware setup
app.use(flash());


app.use(express.urlencoded({extended : false}));//parse url encoded bodies(sent by forms)
app.use(express.json()); // parse json bodies
// application
app.get('/',(req,res)=>{
    res.render('index', {"msg" : req.flash(), "email" : req.session.email});
});

app.post('/signup',async (req,res)=>{
    const {email, password} = req.body;
    const passHashed = await bcrypt.hash(password,10);

    connection.query("select email from users where email = ?",[email],(err,results)=>{
        if(err){
            console.log(err);
            return res.status(500);
        }else if(results.length > 0){
            req.flash("msg" , "email already exist!");
            return res.redirect('/signup');
        }

        connection.query(`insert into users(email,PASSWORD) values(?,?)`, [email,passHashed],(err)=>{
            if(err){
                console.log(err);
                return res.status(500);
            }
            req.session.email = {
                email : req.body.email
            }
            req.session.msg = "register successfully!"
            res.redirect('/');
        })
    })
});

app.get('/signup',(req,res)=>{
    const errMsg = req.flash('msg');
    res.render('signup',{msg : errMsg});
});

app.get("/login",(req,res)=>{
    const errMsg = req.flash('msg');
    res.render('login',{msg : errMsg});
});
app.post('/login',(req,res)=>{
    const {email,password} = req.body;
    
    connection.query("select email,password from users where email = ?",[email], async (err,results)=>{
        if(err){
            console.log(err);
        }
        
        if(results.length <= 0){
            req.flash("msg","somthing went wrong!");
            return res.redirect('/login');
        }
        
        const user = results[0];
        const passMatch = await bcrypt.compare(password, user.password);
        if(!passMatch){
            req.flash("msg","somthing went wrong!");
            return res.redirect('/login');
        }
        req.session.email = {
            email : req.body.email
        };
        req.session.msg = "Login successfully!"
        res.redirect('/');

    })
});

const port = 3000;
app.listen(port,(err)=>{
    if(err){
        console.log(err);
    }
    console.log("server working : http://localhost:3000/")
});
