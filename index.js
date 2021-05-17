const express = require('express');
const app = express();
const colors = require('colors');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const Farm = require('./models/farm');
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

//***Method-Override for PUT req*** 
app.use(methodOverride('_method'))

//***Routes***

// Farm Routes

app.get('/farms', async (req, res) => {
    const farms = await Farm.find({})
    res.render('farms/index', { farms })
})

app.get('/farms/new', (req, res) => {
    res.render('farms/new')
})

app.get('/farms/:id', async (req, res) => {
    const farm = await Farm.findById(req.params.id);
    res.render('farms/show', { farm });
})

app.get('/farms/:id/products/new', (req, res) => {
    const { id } = req.params;
    res.render('products/new', { id });
})

app.post('/farms', async (req, res) => {
    const newFarm = new Farm(req.body);
    await newFarm.save();
    res.redirect('/farms');
})

app.post('/farms/:id/products', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    const { name, price, category } = req.body;
    const product = await new Product({ name, price, category });
    farm.product.push(products);
    product.farm = farm;
    await farm.save();
    await product.save();
    res.send(farm);
})


// Product Routes
app.get('/', (req, res) => {
    res.redirect('/products');
})

app.get('/products', async (req, res) => {
    const products = await Product.find({})
    res.render('products/index', { products })
})

app.get('/products/new', (req, res) => {
    res.render('products/new')
})

app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`)
})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/show', { product });
})

app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product })
})

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/products/${product._id}`);
})

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
})

//***Listener****
app.listen(3000, () => {
    console.log('Listening on PORT 3000'.white);
});
