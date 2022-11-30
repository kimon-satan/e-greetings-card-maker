
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

//retrieve the results
{
    const sql = `SELECT * FROM testUserRecords`;

    global.db.all(sql,[],(err, rows)=>{
        console.log(rows);
    });
}

//insert new results
{
    const sql = `INSERT INTO testUserRecords ("test_record_value", "test_user_id") VALUES( "Another test user record", 1);`;

    //NB. an old fashioned function to access this
    global.db.run(sql,[],function(err){
        const {lastID, changes} = this;
        console.log({lastID, changes});
    });
}

