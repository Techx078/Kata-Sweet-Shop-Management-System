const service = require('../src/sweetService');

const categories = ['Nut-Based', 'Fruit-Based', 'Milk-Based', 'Sugar-Based', 'Others'];

exports.getHome = (req, res) => {
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

  res.render('index', { sweets, categories, error: null });
};

exports.addSweet = (req, res) => {
  const { name, category, price, quantity } = req.body;
  const sweetList = service.getAllSweets();
  const maxId = sweetList.length > 0 ? Math.max(...sweetList.map(s => s.id)) : 1000;
  const newId = maxId + 1;

  service.addSweet({
    id: newId,
    name,
    category,
    price: parseFloat(price),
    quantity: parseInt(quantity)
  });

  res.redirect('/');
};

exports.deleteSweet = (req, res) => {
  const password = req.body.password;
  let error = null;
  try {
    service.deleteSweet(parseInt(req.params.id), password);
  } catch (err) {
    error = err.message;
  }
  const sweets = service.getAllSweets();
  res.render('index', { sweets, categories, error });
};

exports.purchaseSweet = (req, res) => {
  const qty = parseInt(req.body.quantity);
  let error = null;
  try {
    service.purchaseSweet(parseInt(req.params.id), qty);
  } catch (err) {
    error = err.message;
  }
  const sweets = service.getAllSweets();
  res.render('index', { sweets, categories, error });
};

exports.restockSweet = (req, res) => {
  const qty = parseInt(req.body.quantity);
  const password = req.body.password;
  let error = null;
  try {
    service.restockSweet(parseInt(req.params.id), qty, password);
  } catch (err) {
    error = err.message;
  }
  const sweets = service.getAllSweets();
  res.render('index', { sweets, categories, error });
};
