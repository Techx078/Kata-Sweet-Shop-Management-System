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
    test('should restock sweet and increase quantity with correct password', () => {
        const sweet = { id: 2005, name: 'Restock Me', category: 'Test', price: 25, quantity: 5 };
        service.addSweet(sweet);

        service.restockSweet(2005, 10, 'secret123'); // correct password

        const updated = service.getAllSweets().find(s => s.id === 2005);
        expect(updated.quantity).toBe(15); // 5 + 10
    });

    test('should throw error when restock with wrong password', () => {
        const sweet = { id: 2006, name: 'No Restock', category: 'Test', price: 25, quantity: 5 };
        service.addSweet(sweet);

        expect(() => {
            service.restockSweet(2006, 10, 'wrongpass');
        }).toThrow('Invalid password');
    });

    test('should search sweets by partial name (case-insensitive)', () => {
        service.addSweet({ id: 2007, name: 'Mango Barfi', category: 'Fruit-Based', price: 40, quantity: 10 });

        const results = service.searchSweets({ name: 'mango' });
        expect(results.length).toBe(1);
        expect(results[0].name).toBe('Mango Barfi');
    });

    test('should search sweets by category', () => {
        service.addSweet({ id: 2008, name: 'Badam Halwa', category: 'Nut-Based', price: 60, quantity: 5 });

        const results = service.searchSweets({ category: 'Nut-Based' });
        expect(results.find(s => s.id === 2008)).toBeDefined();
    });

    test('should search sweets by price range', () => {
        service.addSweet({ id: 2009, name: 'Cheap Sweet', category: 'Simple', price: 15, quantity: 10 });

        const results = service.searchSweets({ minPrice: 10, maxPrice: 20 });
        expect(results.find(s => s.id === 2009)).toBeDefined();
    });

});
