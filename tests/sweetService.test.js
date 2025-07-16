const service = require('../src/sweetService.js');

const validCategories = ['Nut-Based', 'Fruit-Based', 'Milk-Based', 'Sugar-Based', 'Others'];

describe('Sweet Service', () => {
  beforeEach(() => service.reset());

  test('should add new sweet to inventory', () => {
    const sweet = { id: 1001, name: 'Test Sweet', category: 'Nut-Based', price: 10, quantity: 5 };
    service.addSweet(sweet);
    const sweets = service.getAllSweets();
    expect(sweets).toContainEqual(sweet);
  });

  test('should not add sweet with duplicate ID', () => {
    const sweet1 = { id: 1002, name: 'Sweet A', category: 'Milk-Based', price: 20, quantity: 3 };
    const sweet2 = { id: 1002, name: 'Sweet B', category: 'Sugar-Based', price: 25, quantity: 2 };
    service.addSweet(sweet1);
    expect(() => {
      service.addSweet(sweet2);
    }).toThrow('Sweet with this ID already exists');
  });

  test('should not add sweet with invalid category', () => {
    const sweet = { id: 1003, name: 'Invalid Category', category: 'Fake', price: 10, quantity: 1 };
    expect(() => {
      service.addSweet(sweet);
    }).toThrow('Invalid category');
  });

  test('should not add sweet with negative price or quantity', () => {
    const sweet1 = { id: 1004, name: 'Neg Price', category: 'Others', price: -5, quantity: 2 };
    const sweet2 = { id: 1005, name: 'Neg Qty', category: 'Nut-Based', price: 10, quantity: -3 };
    expect(() => service.addSweet(sweet1)).toThrow('Price must be non-negative');
    expect(() => service.addSweet(sweet2)).toThrow('Quantity must be non-negative');
  });

  test('should delete sweet by ID', () => {
    const sweet = { id: 1006, name: 'Delete Me', category: 'Fruit-Based', price: 15, quantity: 3 };
    service.addSweet(sweet);
    service.deleteSweet(1006, 'delete123'); 
    service.deleteSweet(1006, 'delete123');
    const sweets = service.getAllSweets();
    expect(sweets.find(s => s.id === 1006)).toBeUndefined();
  });

  test('should do nothing when deleting non-existent sweet', () => {
    expect(() => service.deleteSweet(9999,'delete123')).not.toThrow();
  });

  test('should purchase sweet and reduce quantity', () => {
    const sweet = { id: 1007, name: 'Buy Me', category: 'Milk-Based', price: 20, quantity: 10 };
    service.addSweet(sweet);
    service.purchaseSweet(1007, 4);
    const updated = service.getAllSweets().find(s => s.id === 1007);
    expect(updated.quantity).toBe(6);
  });

  test('should throw error when purchasing more than available', () => {
    const sweet = { id: 1008, name: 'Low Stock', category: 'Sugar-Based', price: 20, quantity: 2 };
    service.addSweet(sweet);
    expect(() => service.purchaseSweet(1008, 5)).toThrow('Not enough stock');
  });

  test('should throw error when purchasing non-existent sweet', () => {
    expect(() => service.purchaseSweet(9999, 1)).toThrow('Sweet not found');
  });

  test('should restock sweet and increase quantity with correct password', () => {
    const sweet = { id: 1009, name: 'Restock Me', category: 'Others', price: 25, quantity: 5 };
    service.addSweet(sweet);
    service.restockSweet(1009, 10, 'secret123');
    const updated = service.getAllSweets().find(s => s.id === 1009);
    expect(updated.quantity).toBe(15);
  });

  test('should throw error when restocking with wrong password', () => {
    const sweet = { id: 1010, name: 'Wrong Pass', category: 'Nut-Based', price: 25, quantity: 5 };
    service.addSweet(sweet);
    expect(() => service.restockSweet(1010, 10, 'badpass')).toThrow('Invalid password');
  });

  test('should throw error when restocking non-existent sweet', () => {
    expect(() => service.restockSweet(9999, 10, 'secret123')).toThrow('Sweet not found');
  });

  // Search tests
  test('should search sweets by partial name (case-insensitive)', () => {
    service.addSweet({ id: 1011, name: 'Mango Barfi', category: 'Fruit-Based', price: 40, quantity: 10 });
    const results = service.searchSweets({ name: 'mango' });
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Mango Barfi');
  });

  test('should search sweets by category', () => {
    service.addSweet({ id: 1012, name: 'Badam Halwa', category: 'Nut-Based', price: 60, quantity: 5 });
    const results = service.searchSweets({ category: 'Nut-Based' });
    expect(results.find(s => s.id === 1012)).toBeDefined();
  });

  test('should search sweets by price range', () => {
    service.addSweet({ id: 1013, name: 'Cheap Sweet', category: 'Others', price: 15, quantity: 10 });
    const results = service.searchSweets({ minPrice: 10, maxPrice: 20 });
    expect(results.find(s => s.id === 1013)).toBeDefined();
  });

  test('should return empty array if no sweets match search', () => {
    service.addSweet({ id: 1014, name: 'Random Sweet', category: 'Sugar-Based', price: 50, quantity: 1 });
    const results = service.searchSweets({ name: 'xyz' });
    expect(results).toEqual([]);
  });

  test('should search by combined filters (name & category & price)', () => {
    service.addSweet({ id: 1015, name: 'Kesar Peda', category: 'Milk-Based', price: 30, quantity: 8 });
    const results = service.searchSweets({ name: 'kesar', category: 'Milk-Based', minPrice: 20, maxPrice: 40 });
    expect(results.length).toBe(1);
    expect(results[0].id).toBe(1015);
  });

  test('should handle empty search (return all sweets)', () => {
    service.addSweet({ id: 1016, name: 'Sweet 1', category: 'Nut-Based', price: 10, quantity: 2 });
    service.addSweet({ id: 1017, name: 'Sweet 2', category: 'Others', price: 20, quantity: 3 });
    const results = service.searchSweets({});
    expect(results.length).toBe(2);
  });

});
