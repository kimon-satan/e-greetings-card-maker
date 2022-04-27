const express = require('express');
const assert = require('assert');
const path = require('path');
const app = express();
const port = 3000;

const cardTypes = ["birthday", "leaving"];
const userCards = [];

////////////////////////////////////// HELPER FUNCTIONS //////////////////////////////////////

const capitalize = s=>s.charAt(0).toUpperCase() + s.slice(1);

const generateId = (numChars=12)=>{
    const chars = "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$";
    let s = "";
    for(let i = 0; i < numChars; i++){
        s += chars[Math.floor(Math.random() * chars.length)];
    }
    return s;
}

//////////////////////////////////////////////////////////////////////////////////////////////

app.set('view engine', 'ejs');

app.use(express.static('public'));


app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

//to call use http://localhost:3000/greetings-card?cardtype=birthday&recipient=simon

app.get('/greetings-card', (req,res)=>{

    assert(cardTypes.includes(req.query.cardtype),"invalid card type");
    assert(req.query.recipient,"you need to provide a recipient");

    if(req.query.cardid){
        assert(userCards.includes(req.query.cardid),"cardid not found");
        if(req.query.cardtype === "birthday"){
            //res.send(`Happy Birthday ${req.query.recipient}!`);
            res.render('birthday-card',{recipient: capitalize(req.query.recipient), cardId: req.query.cardid});
        }else if(req.query.cardtype === "leaving"){
            res.render('leaving-card',{recipient: capitalize(req.query.recipient), cardId: req.query.cardid});
            //res.send(`Sorry you're leaving ${req.query.recipient}! `);
        }
    }else{
        const cardId = generateId();
        userCards.push(cardId);
        res.redirect(`/greetings-card?cardtype=${req.query.cardtype}&recipient=${req.query.recipient}&cardid=${cardId}`);
    }
})

app.listen(port, ()=>console.log(`listening on port ${port}`));

