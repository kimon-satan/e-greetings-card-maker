const express = require('express');
const assert = require('assert');
const app = express();
const port = 3000;

const cardTypes = ["birthday", "leaving"];

app.use(express.static('/public'));

app.get('/', (req,res)=>{
    res.send('Welcome to Greetings Card Maker !');
})

//to call use http://localhost:3000/greetings-card?cardtype=birthday&name=simon

app.get('/greetings-card', (req,res)=>{

    assert(cardTypes.includes(req.query.cardtype),"invalid card type");
    assert(req.query.name,"you need to provide a name");

    if(req.query.cardtype === "birthday"){
        res.send(`Happy Birthday ${req.query.name}!`);
    }else if(req.query.cardtype === "leaving"){
        res.send(`Sorry you're leaving ${req.query.name}! `);
    }
})

app.listen(port, ()=>console.log(`listening on port ${port}`));