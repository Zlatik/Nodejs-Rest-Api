const express = require('express');
const mysql = require('mysql');
const body_parser = require('body-parser');
const app = express();
app.use(express.static(__dirname + '/s'));

// app.use(express.static(__dirname + '/s'));
app.use(body_parser());
app.use(body_parser.json());

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'score'
})

app.get('/:username/score',(req,res,next)=>{
    connection.query('SELECT * from users where users_name = (?)',[req.params.username],(err,data)=>{
        console.log(data);
        if(err) throw err;
        let str = "";

       str = JSON.stringify(data);
       console.log(str);

        res.end(str);
        
    })
    next();
})

app.post('/newUser',(req,res,next)=>{
    const obj = req.body;
    connection.query('INSERT into users(users_name,score_eat,score_time) values (?,?,?)',[obj.users_name,obj.score_eat,obj.score_time],(err)=>{
       if(err){
           if(err.errno == 1062){
               throw( new Error('this name is used already.Try another one'));
           }else{
               throw err;
           }
       }
    })
    next();
})

app.put('/:username/update',(req,res,next)=>{
    let obj = req.body;
    connection.query('UPDATE users SET score_eat = ?, score_time = ? where users_name= ?',[obj.score_eat,obj.score_time,req.params.username],(err)=>{
        if (err) throw err;
    })
    next();
})

app.delete('/:username/delete',(req,res,next)=>{
    connection.query('delete from users where users_name = ?',[req.params.username],(err)=>{
        if(err) throw err;
    })
    next();
})

app.get('/allUsers',(req,res,next)=>{
    
    connection.query('select * from users order by score_time DESC',(err,data)=>{
        
        if (err) throw err;
        let str = "";

        str = JSON.stringify(data);
        console.log(str);
        res.end(str);
        
    })
next();
});

app.listen(3005,()=>{
    console.log('listen on 3005');
})