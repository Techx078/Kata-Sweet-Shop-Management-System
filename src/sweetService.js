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

module.exports = {
  reset,
  addSweet,
  getAllSweets,
  deleteSweet
};
