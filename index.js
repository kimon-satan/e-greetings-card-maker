const express = require('express');
const assert = require('assert');
const path = require('path');
const app = express();
const port = 3000;

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

//////////////////////////////////////// DATA STRUCTURES ////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @description This renders the front page of the website
 */
app.get('/', (req,res)=>{
    res.send("Hello world");
})

/**
 * @description This renders the edit page of the website
 * @param cardId
 */
app.get('/edit-greetings-card', (req,res)=>{
    res.send("edit-greetings-card");
})

/**
 * @description This renders the viewing page of the website
 * @param cardId
 */
app.get('/view-greetings-card', (req,res)=>{
    res.send("view-greetings-card");
})

/**
 * @description This creates a new creating card record then redirects to it's edit page
 */
app.post('/create-greetings-card', (req,res)=>{
    res.send("POST create-greetings-card");
})

/**
 * @description This appends a message to a greeting card
 */
app.post('/add-message', (req,res)=>{
    res.send("POST add-message");
})


app.listen(port, ()=>console.log(`listening on port ${port}`));
