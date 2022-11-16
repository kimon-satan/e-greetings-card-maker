const express = require('express');
const assert = require('assert');
const path = require('path');
const app = express();


const port = 3000;

const cardTypes = ["birthday", "leaving"];
const userCards = new Map();

global.url = `http://localhost:${port}`;

const mysql = require('mysql');
const { get } = require('express/lib/request');
const dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'simon',
    password: 'test123K!', //this is insecure
    database: 'EGreetings'
})

dbConnection.connect((err)=> {
    if (err) throw err;
    console.log("Connected!");
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

const getCard = (cardId, errorCb, successCb)=>{
    
    const sql = `SELECT * FROM Cards WHERE id=?`;

    dbConnection.query(sql, cardId, (err,result)=>{

        try{
            assert(!err, err);
            assert(result.length > 0, "card not found");
            successCb(result.at(0));
        }catch(e){
            errorCb(e);
        }
    })
}

const getMessages = (cardId, errorCb, successCb)=>{

    const sql = `SELECT * FROM messages WHERE cardId=?`;

    dbConnection.query(sql, cardId, (err,result)=>{
        try{
            assert(!err, err);
            successCb(result);
        }catch(e){
            errorCb(e);
        }
    })
}


app.get('/edit-greetings-card', (req,res,next)=>{

    assert(req.query.cardId,"no cardId provided");
    //const cardDetails = userCards.get(req.query.cardId);
    //assert(cardDetails,"cardId not found");

    const sql = `SELECT * FROM Cards LEFT JOIN messages ON Cards.id=messages.cardId WHERE id=?`;

    dbConnection.query(sql, req.query.cardId, (err,result)=>{
        try{
            assert(!err, err);
            assert(result.length > 0, "card not found");
            const messages = result.filter(r=>r.messageId !== null);

            const cardType = result[0].cardType;

            const params = {
                recipient: capitalize(result[0].recipient), 
                cardId: req.query.cardId, 
                url: global.url,
                messages: messages,
                isEdit: true,
                imagePath: "/bye.jpeg"
            };

            if(cardType === "birthday"){
                res.render('birthday-card', params);
            }else if(cardType === "leaving"){
                res.render('leaving-card', params);
            } 
            next();
        }catch(e){
            next(e);
        }
    })
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

    //Insert the card into the database
    const sql = `INSERT INTO Cards (id,recipient,cardType,created) VALUES ('${cardId}','${req.body.recipient}','${req.body.cardtype}',CURRENT_TIMESTAMP())`;
    dbConnection.query(sql, (err,result)=>{
        if(err){
            console.error(err);
        }else{
            console.log(result);
        }
    })

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

