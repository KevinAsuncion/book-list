const express = require('express');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
const { Client } = require('pg');
require('dotenv').config();

const app = express(); 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

const mustache = mustacheExpress(); 
mustache.cache = null; 

app.engine('mustache', mustache);
app.set('view engine', 'mustache')

app.get('/list-page', (req,res) => {
    res.render('list-page');
})

app.get('/book/add', (req,res) => {
    res.render('book-form');
})

app.post('/book/add', (req,res) => {
    const {title, authors} = req.body;
    //Connect to the Postgress
    const client = new Client();
    client.connect()
        .then(()=>{
            console.log('connection complete')
            const sql = 'INSERT into books (title, authors) VALUES($1, $2)'
            const params =[title, authors]
            return client.query(sql, params)
        })
        .then((result) => {
            console.log(result)
            res.redirect('/list-page');
        })
        .catch((err) => {
            console.log('err', err)
            res.redirect('/list')
        })
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port 5006 ${process.env.PORT}.`)
})