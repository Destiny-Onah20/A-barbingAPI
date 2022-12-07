const mysql = require("mysql");
const express = require("express");
const app = express();
const port = 2099;
app.use(express.json());
const sqlCont = mysql.createConnection({
    host : "localhost",
    user :"root",
    password : "root",
    database : "barbDb",
    multipleStatements : true
})

sqlCont.connect((er)=>{
    if(er){
        console.log(er.message)
    }else{
        console.log("Connected successfully")
    }
})


app.get("/styles", (req,res)=>{
    sqlCont.query('SELECT * FROM barbRec', (err,rows,fields)=>{
        if(err){
            console.log(err.message)
        }else{
            res.status(200).json({
                data : rows
            })
        }
    })
});

// update a style
app.put("/styles", (req,res)=>{
    let body = req.body;
    let sql = `set @id=?;set @hair=?;set @price=?;
    call bEdit(@id,@hair,@price);`;
    sqlCont.query(sql,[body.id,body.hair,body.price], (err,rows,fields)=>{
        if(err){
            res.status(404).json({
                message : err.message
            })
        }else{
            res.status(200).json({
                message: "Update successfully"
            })
        }
    })
});


// create new style
app.post("/styles", (req,res)=>{
    let body = req.body;
    let sql = `set @id=?; set @hair=?; set @price=?;
    call bEdit(@id,@hair,@price);`;
    sqlCont.query(sql, [body.id,body.hair,body.price], (err,rows,fields)=>{
        if(err){
            console.log(err.message)
        }else{
            rows.forEach((item)=>{
                if(item.constructor == Array){
                    res.status(200).json({
                        message : "Newly add id: " + item[0].id
                    })
                }
            })
        }
    })
});

app.delete("/styles/:id", (req,res)=>{
    let id = req.params.id;
    sqlCont.query(`DELETE FROM barbRec WHERE id=${id}`, (err,rows,fields)=>{
        if(err){
            res.status(404).json({
                message : err.message
            })
        }else{
            res.status(200).json({
                message: "Successfully Deleted this style from the Record"
            })
        }
    })
});

// get all user
app.get("/user", (req,res)=>{
    sqlCont.query(`select * from userRec`, (err,rows,fields)=>{
        if(err){
            console.log(err.message)
        }else{
           res.status(200).json({
            data: rows
           }) 
        }
    })
})

// create a user
app.post("/user", (req,res)=>{
    let body = req.body;
    let sql = `set @id=?; set @name=?; set @username=?; set @password=?;
    call uEdit(@id,@name,@username,@password);`;
    sqlCont.query(sql,[body.id,body.name,body.username,body.password], (err,rows, fields)=>{
        if(err){
            console.log(err.message)
        }else{
            rows.forEach((item)=>{
                if(item.constructor == Array){
                    res.status(200).json({
                        message : "Created a new costumer with the id "  + item[0].id
                    })
                }
            })
        }
    })
});

// delete user
app.delete("/user/:id", (req,res)=>{
    let id = req.params.id
    sqlCont.query(`delete from userRec where id=${id}`, (err,rows,fields)=>{
        if(err){
            console.log(err.message)

        }else{
            res.status(200).json({
                message : "Deleted successfully"
            })
        }
    })
})


app.listen(port, ()=>{
    console.log(`Listening to port : ${port}...`)
})