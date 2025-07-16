let sweets = [
  { id: 1001, name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 20 }
];

// Reset sweets list (for testing)
function reset() {
  sweets = [
    { id: 1001, name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 20 }
  ];
}

function addSweet(sweet) {
  sweets.push(sweet);
  return sweet;
}

function getAllSweets() {
  return sweets;
}
function deleteSweet(id) {
  const index = sweets.findIndex(s => s.id === id);
  if (index !== -1) {
    sweets.splice(index, 1);
  }
}
function purchaseSweet(id, qty) {
  const sweet = sweets.find(s => s.id === id);
  if (!sweet) throw new Error('Sweet not found');
  if (sweet.quantity < qty) throw new Error('Not enough stock');
  sweet.quantity -= qty;
  return sweet;
}
const restockPassword = 'secret123';

function restockSweet(id, qty, password) {
  if (password !== restockPassword) throw new Error('Invalid password');

  const sweet = sweets.find(s => s.id === id);
  if (!sweet) throw new Error('Sweet not found');

  sweet.quantity += qty;
  return sweet;
}

module.exports = {
  reset,
  addSweet,
  getAllSweets,
  deleteSweet,
  purchaseSweet,
  restockSweet
};
