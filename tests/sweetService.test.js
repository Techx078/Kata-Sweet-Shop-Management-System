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
    test('should purchase sweet and reduce quantity', () => {
        const sweet = { id: 2003, name: 'Purchase Me', category: 'Test', price: 20, quantity: 10 };
        service.addSweet(sweet);

        service.purchaseSweet(2003, 4); // purchase 4

        const updated = service.getAllSweets().find(s => s.id === 2003);
        expect(updated.quantity).toBe(6); // 10 - 4
    });

    test('should throw error when purchasing more than stock', () => {
        const sweet = { id: 2004, name: 'Low Stock', category: 'Test', price: 20, quantity: 2 };
        service.addSweet(sweet);

        expect(() => {
            service.purchaseSweet(2004, 5);
        }).toThrow('Not enough stock');
    });

});
