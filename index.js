const express = require('express');
const assert = require('assert');
const path = require('path');
const app = express();
const port = 3000;

const cardTypes = ["birthday", "leaving"];
const userCards = new Map();

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

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(express.static('public'));


app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

//to call use http://localhost:3000/greetings-card?cardtype=birthday&recipient=simon

app.get('/edit-greetings-card', (req,res)=>{

    assert(req.query.cardid,"no cardid provided");
    const cardDetails = userCards.get(req.query.cardid);
    assert(cardDetails,"cardid not found");
    
    if(cardDetails.cardType === "birthday"){
        //res.send(`Happy Birthday ${req.query.recipient}!`);
        res.render('birthday-card',{recipient: capitalize(cardDetails.recipient), cardId: cardDetails.cardId});
    }else if(cardDetails.cardType === "leaving"){
        res.render('leaving-card',{recipient: capitalize(cardDetails.recipient), cardId: cardDetails.cardid});
        //res.send(`Sorry you're leaving ${req.query.recipient}! `);
    }
    
})

app.post('/create-greetings-card', (req,res)=>{

    assert(cardTypes.includes(req.body.cardtype),"invalid card type");
    assert(req.body.recipient,"you need to provide a recipient");

    const cardId = generateId();
    const cardDetails = {recipient: req.body.recipient, cardType: req.body.cardtype};
    userCards.set(cardId, cardDetails);

    //forward to the edit page
    res.redirect(`/edit-greetings-card?cardid=${cardId}`);

})

app.listen(port, ()=>console.log(`listening on port ${port}`));

