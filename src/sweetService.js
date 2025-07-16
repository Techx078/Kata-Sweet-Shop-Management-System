let sweets = [
  { id: 1001, name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 20 },
  { id: 1002, name: 'Badam Halwa', category: 'Nut-Based', price: 60, quantity: 15 },
  { id: 1003, name: 'Pista Roll', category: 'Nut-Based', price: 55, quantity: 18 },
  { id: 1004, name: 'Dry Fruit Laddu', category: 'Nut-Based', price: 45, quantity: 22 },
  { id: 1005, name: 'Anjeer Barfi', category: 'Nut-Based', price: 65, quantity: 17 },
  { id: 1006, name: 'Rasgulla', category: 'Milk-Based', price: 30, quantity: 25 },
  { id: 1007, name: 'Rasmalai', category: 'Milk-Based', price: 35, quantity: 20 },
  { id: 1008, name: 'Kalakand', category: 'Milk-Based', price: 40, quantity: 18 },
  { id: 1009, name: 'Milk Cake', category: 'Milk-Based', price: 38, quantity: 24 },
  { id: 1010, name: 'Basundi', category: 'Milk-Based', price: 33, quantity: 22 },
  { id: 1011, name: 'Mango Barfi', category: 'Fruit-Based', price: 42, quantity: 16 },
  { id: 1012, name: 'Orange Burfi', category: 'Fruit-Based', price: 40, quantity: 19 },
  { id: 1013, name: 'Pineapple Halwa', category: 'Fruit-Based', price: 37, quantity: 21 },
  { id: 1014, name: 'Apple Kheer', category: 'Fruit-Based', price: 36, quantity: 23 },
  { id: 1015, name: 'Banana Sheera', category: 'Fruit-Based', price: 34, quantity: 20 },
  { id: 1016, name: 'Jalebi', category: 'Sugar-Based', price: 25, quantity: 30 },
  { id: 1017, name: 'Imarti', category: 'Sugar-Based', price: 28, quantity: 27 },
  { id: 1018, name: 'Soan Papdi', category: 'Sugar-Based', price: 32, quantity: 26 },
  { id: 1019, name: 'Chikki', category: 'Sugar-Based', price: 22, quantity: 35 },
  { id: 1020, name: 'Sugar Batasha', category: 'Sugar-Based', price: 20, quantity: 28 },
  { id: 1021, name: 'Besan Laddu', category: 'Others', price: 27, quantity: 29 },
  { id: 1022, name: 'Moong Dal Halwa', category: 'Others', price: 29, quantity: 24 },
  { id: 1023, name: 'Mysore Pak', category: 'Others', price: 33, quantity: 21 },
  { id: 1024, name: 'Ghevar', category: 'Others', price: 31, quantity: 23 },
  { id: 1025, name: 'Boondi Laddu', category: 'Others', price: 26, quantity: 25 },
  // Repeat similar pattern to make 50:
  { id: 1026, name: 'Kaju Katli Special', category: 'Nut-Based', price: 52, quantity: 19 },
  { id: 1027, name: 'Badam Barfi', category: 'Nut-Based', price: 58, quantity: 17 },
  { id: 1028, name: 'Pista Burfi', category: 'Nut-Based', price: 54, quantity: 18 },
  { id: 1029, name: 'Dry Fruit Mix', category: 'Nut-Based', price: 60, quantity: 16 },
  { id: 1030, name: 'Anjeer Roll', category: 'Nut-Based', price: 66, quantity: 15 },
  { id: 1031, name: 'Double Rasgulla', category: 'Milk-Based', price: 36, quantity: 20 },
  { id: 1032, name: 'Special Rasmalai', category: 'Milk-Based', price: 38, quantity: 19 },
  { id: 1033, name: 'Malai Kalakand', category: 'Milk-Based', price: 42, quantity: 18 },
  { id: 1034, name: 'Brown Milk Cake', category: 'Milk-Based', price: 40, quantity: 22 },
  { id: 1035, name: 'Royal Basundi', category: 'Milk-Based', price: 35, quantity: 21 },
  { id: 1036, name: 'Mango Halwa', category: 'Fruit-Based', price: 43, quantity: 19 },
  { id: 1037, name: 'Orange Laddu', category: 'Fruit-Based', price: 41, quantity: 18 },
  { id: 1038, name: 'Pineapple Barfi', category: 'Fruit-Based', price: 39, quantity: 20 },
  { id: 1039, name: 'Apple Halwa', category: 'Fruit-Based', price: 38, quantity: 17 },
  { id: 1040, name: 'Banana Barfi', category: 'Fruit-Based', price: 36, quantity: 19 },
  { id: 1041, name: 'Jalebi Big', category: 'Sugar-Based', price: 26, quantity: 26 },
  { id: 1042, name: 'Imarti Special', category: 'Sugar-Based', price: 29, quantity: 24 },
  { id: 1043, name: 'Soan Papdi Premium', category: 'Sugar-Based', price: 34, quantity: 23 },
  { id: 1044, name: 'Chikki Mix', category: 'Sugar-Based', price: 24, quantity: 27 },
  { id: 1045, name: 'Sugar Disk', category: 'Sugar-Based', price: 21, quantity: 25 },
  { id: 1046, name: 'Besan Laddu Special', category: 'Others', price: 28, quantity: 23 },
  { id: 1047, name: 'Moong Halwa Rich', category: 'Others', price: 31, quantity: 22 },
  { id: 1048, name: 'Mysore Pak Soft', category: 'Others', price: 34, quantity: 20 },
  { id: 1049, name: 'Ghevar Dry Fruit', category: 'Others', price: 32, quantity: 21 },
  { id: 1050, name: 'Boondi Laddu Big', category: 'Others', price: 27, quantity: 24 }
];

const validCategories = ['Nut-Based', 'Fruit-Based', 'Milk-Based', 'Sugar-Based', 'Others'];

const restockPassword = 'secret123';
const deletePassword = 'delete123';

function reset() {
  sweets.length = 0;
}

function addSweet(sweet) {
  if (sweets.find(s => s.id === sweet.id)) {
    throw new Error('Sweet with this ID already exists');
  }

  if (!validCategories.includes(sweet.category)) {
    throw new Error('Invalid category');
  }

  if (sweet.price < 0) {
    throw new Error('Price must be non-negative');
  }

  if (sweet.quantity < 0) {
    throw new Error('Quantity must be non-negative');
  }

  sweets.push({ ...sweet }); // shallow copy to be safe
}

function deleteSweet(id, password) {
  if (password !== deletePassword) throw new Error('Invalid password');
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
}

function restockSweet(id, qty, password) {
  if (password !== restockPassword) throw new Error('Invalid password');
  const sweet = sweets.find(s => s.id === id);
  if (!sweet) throw new Error('Sweet not found');
  sweet.quantity += qty;
}

function getAllSweets() {
  return sweets;
}

function searchSweets({ name, category, minPrice, maxPrice }) {
  return sweets.filter(sweet => {
    if (name && !sweet.name.toLowerCase().includes(name.toLowerCase())) return false;
    if (category && sweet.category !== category) return false;
    if (minPrice != null && sweet.price < minPrice) return false;
    if (maxPrice != null && sweet.price > maxPrice) return false;
    return true;
  });
}

module.exports = {
  reset,
  addSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
  getAllSweets,
  searchSweets
};
