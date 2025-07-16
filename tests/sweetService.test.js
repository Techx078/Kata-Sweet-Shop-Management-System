const service = require('../src/sweetService.js');

describe('Sweet Service', () => {
  beforeEach(() => service.reset());

    test('should add new sweet to inventory', () => {
        const sweet = { id: 2001, name: 'Test Sweet', category: 'Test', price: 10, quantity: 5 };
        service.addSweet(sweet);
        const sweets = service.getAllSweets();
        expect(sweets).toContainEqual(sweet);
    });
    test('should delete sweet by ID', () => {
        const sweet = { id: 2002, name: 'Delete Me', category: 'Test', price: 15, quantity: 3 };
        service.addSweet(sweet);

        service.deleteSweet(2002);

        const sweets = service.getAllSweets();
        const found = sweets.find(s => s.id === 2002);
        expect(found).toBeUndefined();
    });

});
