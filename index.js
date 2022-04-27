const express = require('express');
const assert = require('assert');
const path = require('path');
const app = express();
const port = 3000;

const cardTypes = ["birthday", "leaving"];

app.use(express.static('public'));

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

//to call use http://localhost:3000/greetings-card?cardtype=birthday&recipient=simon

app.get('/greetings-card', (req,res)=>{

    assert(cardTypes.includes(req.query.cardtype),"invalid card type");
    assert(req.query.recipient,"you need to provide a recipient");

    if(req.query.cardtype === "birthday"){
        res.send(`Happy Birthday ${req.query.recipient}!`);
    }else if(req.query.cardtype === "leaving"){
        res.send(`Sorry you're leaving ${req.query.recipient}! `);
    }
})

app.listen(port, ()=>console.log(`listening on port ${port}`));