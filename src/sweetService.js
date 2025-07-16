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

module.exports = {
  reset,
  addSweet,
  getAllSweets
};
