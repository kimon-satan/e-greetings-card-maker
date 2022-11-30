const express = require('express');
const assert = require('assert');
const path = require('path');
const app = express();
const port = 3000;

const cardTypes = ["birthday", "leaving"];
const userCards = new Map();

global.url = `http://localhost:${port}`;

const sqlite3 = require('sqlite3').verbose();

//items in the global namespace are accessible throught out the node application
global.db = new sqlite3.Database('./database.db',function(err){
  if(err){
    console.error(err);
    process.exit(1); //Bail out we can't connect to the DB
  }else{
    console.log("Database connected");
    global.db.run("PRAGMA foreign_keys=ON"); //This tells SQLite to pay attention to foreign key constraints
  }
});

////////////////////////////////////// HELPER FUNCTIONS //////////////////////////////////////

const capitalize = s=>s.charAt(0).toUpperCase() + s.slice(1);

const generateId = (numChars=12)=>{
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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


app.get('/edit-greetings-card', (req,res)=>{

    assert(req.query.cardId,"no cardId provided");
    const cardDetails = userCards.get(req.query.cardId);
    assert(cardDetails,"cardId not found");

    const params = {
        recipient: capitalize(cardDetails.recipient), 
        cardId: req.query.cardId, 
        url: global.url,
        messages: cardDetails.messages,
        isEdit: true
    };
    
    if(cardDetails.cardType === "birthday"){
        res.render('birthday-card', params);
    }else if(cardDetails.cardType === "leaving"){
        res.render('leaving-card', params);
    }  
})

app.get('/view-greetings-card', (req,res)=>{

    assert(req.query.cardId,"no cardId provided");
    const cardDetails = userCards.get(req.query.cardId);
    assert(cardDetails,"cardId not found");

    
    const params = {
        recipient: capitalize(cardDetails.recipient), 
        cardId: req.query.cardId, 
        url: global.url,
        messages: cardDetails.messages,
        isEdit: false
    };
    
    if(cardDetails.cardType === "birthday"){
        res.render('birthday-card',params);
    }else if(cardDetails.cardType === "leaving"){
        res.render('leaving-card',params);
    }  
})


app.post('/create-greetings-card', (req,res)=>{

    assert(cardTypes.includes(req.body.cardtype),"invalid card type");
    assert(req.body.recipient,"you need to provide a recipient");

    const cardId = generateId();
    const cardDetails = {
        recipient: req.body.recipient, 
        cardType: req.body.cardtype,
        messages: []
    };
    userCards.set(cardId, cardDetails);

    //forward to the edit page
    res.redirect(`/edit-greetings-card?cardId=${cardId}`);

})

app.post('/add-message', (req,res)=>{

    assert(req.body.cardId,"no cardId provided");
    const cardDetails = userCards.get(req.body.cardId);
    assert(cardDetails,"cardId not found");

    const t = {...cardDetails};

    t.messages.push({message: req.body.message, from: req.body.from});

    userCards.set(req.body.cardId, t);

    res.redirect(`/edit-greetings-card?cardId=${req.body.cardId}`);
})


app.listen(port, ()=>console.log(`listening on port ${port}`));

