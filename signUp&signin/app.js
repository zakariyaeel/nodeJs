const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();

app.use(bodyParser.json());
const port = 3000;

const users = [];

app.post("/register", async (req,res)=>{
    try{
        const {email, password} = req.body;
        const findUser = users.find(data => data.email === email);

        if(findUser){
            res.status(401).send("Wrong email or password!");
        }
        // hash the password
        const hashedPassword = await bcrypt.hash(password , 10);
        users.push({email, password : hashedPassword});
        res.status(200).send("registred succesfully");
    }catch(err){
        res.status(500).send({message : err.message});
    }
});

app.post("/login", async (req,res)=>{
    try{
        const {email, password} = req.body;
        const findUser = users.find(data => data.email === email);

        if(!findUser){
            res.status(401).send('somthing went wrong!');
        }
        const passwordMatch = await bcrypt.compare(password,findUser.password);
        if (passwordMatch){
            res.status(200).send("logged in succefully!");
        }else{
            res.status(401).send("something went wrong!");
        }
    }catch(err){
        res.status(400).send({message : err.message});
    }
})
//server always on listning
app.listen(port, ()=>{
    console.log("server working");
});
