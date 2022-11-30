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


app.get('/edit-greetings-card', (req,res, next)=>{

    const sql = `SELECT * FROM Cards LEFT JOIN Messages ON Cards.CardId = Messages.CardId WHERE Cards.CardId = ?`;
    
    global.db.all(sql,[req.query.cardId], function(err,rows){
        if(err){
            next(err);
        }else{

            if(rows.length < 1){
                next(new Error("card not found"));
                return;
            }

            const cardDetails = rows[0];

            const params = {
                recipient: capitalize(cardDetails.Recipient), 
                cardId: req.query.cardId, 
                url: global.url,
                messages: rows,
                isEdit: true
            };
            
            if(cardDetails.CardType === "birthday"){
                res.render('birthday-card',params);
            }else if(cardDetails.CardType === "leaving"){
                res.render('leaving-card',params);
            }  
            next();
        }
    })
    
})

app.get('/view-greetings-card', (req,res, next)=>{

    assert(req.query.cardId,"no cardId provided");

    const sql = `SELECT * FROM Cards LEFT JOIN Messages ON Cards.CardId = Messages.CardId WHERE Cards.CardId = ?`;
    
    global.db.all(sql,[req.query.cardId], function(err,rows){
        if(err){
            next(err);
        }else{

            if(rows.length < 1){
                next(new Error("card not found"));
                return;
            }

            const cardDetails = rows[0];

            const params = {
                recipient: capitalize(cardDetails.Recipient), 
                cardId: req.query.cardId, 
                url: global.url,
                messages: rows,
                isEdit: false
            };
            
            if(cardDetails.CardType === "birthday"){
                res.render('birthday-card',params);
            }else if(cardDetails.CardType === "leaving"){
                res.render('leaving-card',params);
            }  
            next();
        }
    })
   
})


app.post('/create-greetings-card', (req,res,next)=>{

    assert(cardTypes.includes(req.body.cardtype),"invalid card type");
    assert(req.body.recipient,"you need to provide a recipient");

    const cardId = generateId();

    const sql = `INSERT INTO Cards VALUES (?,?,?)`;

    global.db.run(sql,[cardId, req.body.recipient, req.body.cardtype],function(err){

        if(err){
            next(err);
        }else{
            const {lastID, changes} = this;
            console.log({lastID, changes});
            //forward to the edit page
            res.redirect(`/edit-greetings-card?cardId=${cardId}`);
            next();
        }

    });

})

app.post('/add-message', (req,res,next)=>{

    assert(req.body.cardId,"no cardId provided");

    const sql = `INSERT INTO Messages ("_Message","_From","CardId") VALUES (?,?,?)`;

    global.db.run(sql, [req.body.message,req.body.from,req.body.cardId],function(err){
        if(err){
            next(err);
        }else{
            res.redirect(`/edit-greetings-card?cardId=${req.body.cardId}`);
            next();
        }
    })
    
})


app.listen(port, ()=>console.log(`listening on port ${port}`));

