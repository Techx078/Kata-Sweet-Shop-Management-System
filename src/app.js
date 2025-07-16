const express = require('express');
const bodyParser = require('body-parser');
const service = require('./sweetService.js');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

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

  res.render('index', { sweets });
});

// Add sweet (from form)
app.post('/add', (req, res) => {
  const { id, name, category, price, quantity } = req.body;
  service.addSweet({
    id: parseInt(id),
    name,
    category,
    price: parseFloat(price),
    quantity: parseInt(quantity)
  });
  res.redirect('/');
});

// Delete sweet
app.post('/delete/:id', (req, res) => {
  service.deleteSweet(parseInt(req.params.id));
  res.redirect('/');
});

// Purchase sweet
app.post('/purchase/:id', (req, res) => {
  const qty = parseInt(req.body.quantity);
  try {
    service.purchaseSweet(parseInt(req.params.id), qty);
  } catch (err) {
    // handle error if needed
  }
  res.redirect('/');
});

// Restock sweet
app.post('/restock/:id', (req, res) => {
  const qty = parseInt(req.body.quantity);
  const password = req.body.password;
  try {
    service.restockSweet(parseInt(req.params.id), qty, password);
  } catch (err) {
    // handle error if needed
  }
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
