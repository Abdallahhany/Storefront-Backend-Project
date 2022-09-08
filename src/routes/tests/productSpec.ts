import supertest from "supertest";
import {Product, ProductModel} from "../../models/Product";

import app from "../../server";
import client from "../../database/database";
import {User} from "../../models/User";

const productModel = new ProductModel();

const req = supertest(app);
let token: string;
describe('Product API Routes', () => {

    const product: Product = {
        name: "Book",
        price: 200,
        category: "Books"
    }
    const defaultUser: User = {
        firstname: "tester",
        lastname: "tester",
        email: "tester@test.com",
        password: "test@123"
    }
    beforeAll(async () => {
        await productModel.create(product);
        await req.post("/api/users/register")
            .set("Content-type", "application/json")
            .send(defaultUser)
        const response = await req.post('/api/users/login')
            .set("Content-type", "application/json")
            .send(defaultUser)
        token = response.body.token;
    });

    it('should add new product and return it to user', async function () {
        const newProduct: Product = {
            name: "Book new product",
            price: 300,
            category: "BooksNew"
        }
        const response = await req.post('/api/products/add')
            .set("content-type", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .send(newProduct);
        expect(response.statusCode).toEqual(201)
    });

    it('should return all products', async function () {
        const response = await req.get('/api/products/all')
        expect(response.statusCode).toEqual(200)
        expect(response.body.length).toBe(2)
    });

    it('should return single product with id = 5', async function () {
        const response = await req.get(`/api/products/product/5`)
        expect(response.statusCode).toEqual(200)
        expect(response.body).toEqual({id: 5, ...product})
    });

    it('should return products by category', async function () {
        const response = await req.get(`/api/products/product_by_cat/${product.category}`)
        expect(response.statusCode).toEqual(200)
        expect(response.body).toEqual([{id: 5, ...product}])
    });

    it('should update Product and return it', async function () {
        const updatedProduct: Product = {
            name: "updated book",
            price: 250,
            category: "updated Books"
        }
        const response = await req.put(`/api/products/product/5`)
            .set("content-type", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .send(updatedProduct);
        expect(response.body).toEqual({id: 5, ...updatedProduct})
        expect(response.statusCode).toEqual(201)
    });

    it('should delete product with id 5 and return it', async function () {
        const response = await req.delete(`/api/products/product/5`)
            .set("content-type", "application/json")
            .set("Authorization", `Bearer ${token}`)
        expect(response.statusCode).toBe(200)
    });
    afterAll(async () => {
        const conn = await client.connect();

        const sql = 'DELETE FROM order_products;\n DELETE FROM orders;\n DELETE FROM products;\n DELETE FROM users;';

        await conn.query(sql);

        conn.release();
    })
})