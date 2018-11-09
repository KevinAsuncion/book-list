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

app.get('/books', (req,res) => {
    const client = new Client();
    client.connect()
        .then(() => {
            return client.query('SELECT * FROM books;');
        })
        .then((results) => {
            res.render('list-page', {
                books: results.rows
            });
        })
        .catch((err) => {
            //console.log('error', err);
            res.send('Something bad happened');
        });
})

app.get('/book/add', (req,res) => {
    res.render('book-form');
})

//ADDING A BOOK

app.post('/book/add', (req,res) => {
    const {title, authors} = req.body;
    //Connect to the Postgres
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
            res.redirect('/books');
        })
        .catch((err) => {
            console.log('err', err)
            res.redirect('/list')
        })
})

app.post('/book/delete/:id', (req,res) =>{
    const client  = new Client(); 
    client.connect()
        .then(() => {
            const sql = 'DELETE FROM books WHERE book_id = $1;'
            const params = [req.params.id]; 
            return client.query(sql, params);
        })
        .then((results) => {
            res.redirect('/books')
        })
        .catch((err) => {
            console.log(err)
            res.redirect('/books')
        });
})

app.get('/book/edit/:id',(req,res) => {
    const client = new Client(); 
    client.connect()
        .then(()=>{
            const sql = 'SELECT * FROM books WHERE book_id = $1;'
            const params = [req.params.id]
            return client.query(sql, params)
        })
        .then((results) => {
            if(results.rowCount === 0){
                res.redirect('/books');
                return;
            }
            res.render('book-edit', {
                book: results.rows[0]
            });
        })
        .catch((err) => {
            console.log(err)
            res.redirect('/books')
        })
})

app.post('/book/edit/:id', (req,res)=>{
    const client = new Client(); 
    client.connect()
        .then(() => {
            const sql = 'UPDATE books SET title = $1, authors = $2 WHERE book_id = $3;'
            const params = [req.body.title, req.body.authors, req.params.id]
            return client.query(sql, params)
        })
        .then((results) => {
            res.redirect('/books')
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/books');
        })
})



app.listen(process.env.PORT, () => {
    console.log(`Listening on port 5006 ${process.env.PORT}.`)
})