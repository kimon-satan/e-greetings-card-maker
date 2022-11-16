const express = require('express');
const assert = require('assert');
const path = require('path');
const app = express();
const port = 3000;



global.url = `http://localhost:${port}`

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


app.get('/', (req,res)=>{
    res.send("Hello world");
})


app.get('/edit-greetings-card', (req,res)=>{

    res.send("edit-greetings-card");

})

app.get('/view-greetings-card', (req,res)=>{

    res.send("view-greetings-card");

})


app.post('/create-greetings-card', (req,res)=>{

    res.send("POST create-greetings-card");
})

app.post('/add-message', (req,res)=>{

    res.send("POST add-message");
})


app.listen(port, ()=>console.log(`listening on port ${port}`));

