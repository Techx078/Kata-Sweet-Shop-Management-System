const service = require('../src/sweetService.js');

describe('Sweet Service', () => {
  beforeEach(() => service.reset());

  test('should add new sweet to inventory', () => {
    const sweet = { id: 2001, name: 'Test Sweet', category: 'Test', price: 10, quantity: 5 };
    service.addSweet(sweet);
    const sweets = service.getAllSweets();
    expect(sweets).toContainEqual(sweet);
  });
});
