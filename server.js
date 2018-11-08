const express = require('express');
const bodyParser = require('body-parser');
const mustacheExpress = require('mustache-express');
require('dotenv').config();

const app = express(); 
app.use(express.static('public'));

const mustache = mustacheExpress(); 
mustache.cache = null; 

app.engine('mustache', mustache);
app.set('view engine', 'mustache')


app.get('/list-page', (req,res) => {
    res.render('list-page')
})

app.get('/book-form', (req,res) => {
    res.render('book-form')
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port 5006 ${process.env.PORT}.`)
})