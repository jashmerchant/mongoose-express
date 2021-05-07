const express = require('express');
const app = express();
const colors = require('colors');
const path = require('path');
const mongoose = require('mongoose');

const Product = require('./models/product');

//***Connect Mongoose with Mongodb*** 
mongoose
    .connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connection Open'.brightCyan);
    })
    .catch((err) => {
        console.log('Error'.red);
        console.log(err);
    });

//***To use req.body in POST routes we need these middlewares***
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.json()); // for parsing application/json

//***Template***
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

//***Static Files***
app.use(express.static(path.join(__dirname, '/public')));

//***Routes***
app.get('/products', async (req, res) => {
    const products = await Product.find({})
    res.render('products/index', { products })
})

//***Listener****
app.listen(3000, () => {
    console.log('Listening on PORT 3000'.white);
});
