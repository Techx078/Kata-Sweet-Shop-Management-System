const express = require('express');
const bodyParser = require('body-parser');
const service = require('./sweetService.js');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Home page: show all sweets or search results
app.get('/', (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;
  let sweets;

  if (name || category || minPrice || maxPrice) {
    sweets = service.searchSweets({
      name,
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined
    });
  } else {
    sweets = service.getAllSweets();
  }

  res.render('index', { sweets, error: null });
});

// Add sweet (from form)
app.post('/add', (req, res) => {
const error = null;
  const { name, category, price, quantity } = req.body;
  const sweet = service.getAllSweets();
  const maxId = sweet.length > 0 ? Math.max(...sweet.map(s => s.id)) : 1000;
  const newId = maxId + 1;
  service.addSweet({
    id: newId,
    name,
    category,
    price: parseFloat(price),
    quantity: parseInt(quantity)
  });
  const sweets = service.getAllSweets();
  res.redirect('/');
});

// Delete sweet
app.post('/delete/:id', (req, res) => {
  let error = null;
  const password = req.body.password;
  try {
    service.deleteSweet(parseInt(req.params.id),password);
  } catch (err) {
    error = err.message;
  }
  const sweets = service.getAllSweets();
  res.render('index', { sweets, error });
});

// Purchase sweet
app.post('/purchase/:id', (req, res) => {
  const qty = parseInt(req.body.quantity);
  let error = null;
  try {
    service.purchaseSweet(parseInt(req.params.id), qty);
  } catch (err) {
    error = err.message;
  }
  const sweets = service.getAllSweets();
  res.render('index', { sweets, error });
});

// Restock sweet
app.post('/restock/:id', (req, res) => {
    console.log(req.body);
  const qty = parseInt(req.body.quantity);
  const password = req.body.password;
  let error = null;
  try {
    service.restockSweet(parseInt(req.params.id), qty, password);
  } catch (err) {
    error = err.message;
  }
  const sweets = service.getAllSweets();
  res.render('index', { sweets, error });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
