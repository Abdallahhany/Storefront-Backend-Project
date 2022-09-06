import {ProductModel} from "../Product";
import client from "../../database/database";

const productModel = new ProductModel();

const product: { price: number; name: string; category: string } = {
    name: "book",
    price: 1500,
    category: "books"
}


describe("Test Product Model", () => {
    beforeAll(async () => {
        await productModel.create(product);
    })
    it("should add new Product", async () => {
        const result = await productModel.create(product);
        expect(result.name).toEqual(product.name)
        expect(result.price).toEqual(product.price)
        expect(result.category).toEqual(product.category)
    })

    it('should return all products', async () => {
        const result = await productModel.index();
        expect(result.length).toBe(2)
    });

    it('should return product with 1 id', async () => {
        const result = await productModel.show(1);
        expect(result.name).toEqual(product.name)
        expect(result.price).toEqual(product.price)
        expect(result.category).toEqual(product.category)
    });

    it('should return product by category', async () => {
        const result = await productModel.getProductsByCat(product.category);
        expect(result[0].name).toEqual(product.name)
        expect(result[0].price).toEqual(product.price)
        expect(result[0].category).toEqual(product.category)
    });

    it('should update product with id = 1', async function () {
        const updatedProduct = {name: 'good book', price: 2000, category: "good books"};
        const result = await productModel.update(1, updatedProduct);
        expect(result.name).toEqual(updatedProduct.name)
        expect(result.price).toEqual(updatedProduct.price)
        expect(result.category).toEqual(updatedProduct.category)
    });
    it('should delete product with id = 1 and  return it', async function () {
        await productModel.deleteProduct(1);
        const result = await productModel.show(1);
        expect(result).toBeUndefined()
    });

    afterAll(async () => {
        const conn = await client.connect();

        const sql = 'DELETE FROM order_products;\n DELETE FROM orders;\n DELETE FROM products;\n DELETE FROM users;';

        await conn.query(sql);

        conn.release();
    })
})