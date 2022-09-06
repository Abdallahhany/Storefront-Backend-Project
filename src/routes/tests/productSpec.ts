import supertest from "supertest";
import {User, UserModel} from "../../models/User";
import {ProductModel, Product} from "../../models/Product";
import app from "../../server";

const userModel = new UserModel();

const req = supertest(app);
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGdtYWlsLmNvbSIsImZpcnN0bmFtZSI6InRlc3QiLCJsYXN0bmFtZSI6InRlc3QiLCJpYXQiOjE2NjI0ODAxNTh9.B0DluHTxRGQVlx2sLes1riTIbc4Xywke92Ol8nKLR1o';

describe('Product API Routes', () => {
    const user: User = {
        firstname: "testProductRoutes",
        lastname: "testProductRoutes",
        password: "testProductRoutes@123456",
        email: "testProductRoutes@test.com",
    };
    const product: Product = {
        name: "Book",
        price: 200,
        category: "Books"
    }

    beforeAll(async () => {
        await userModel.create(user);
    });

    it('should add new product and return it to user', async function () {
        const response = await req.post('/api/products/add')
            .set("content-type", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .send(product);
        expect(response.statusCode).toEqual(201)
    });

    it('should return all products', async function () {
        const response = await req.get('/api/products/all')
        expect(response.statusCode).toEqual(200)
        expect(response.body.length).toBe(2)
    });

    it('should return single product', async function () {
        const response = await req.get(`/api/products/product/3`)
        expect(response.statusCode).toEqual(200)
        expect(response.body).toEqual({id: 3, ...product})
    });

    it('should return products by category', async function () {
        const response = await req.get(`/api/products/product_by_cat/${product.category}`)
        expect(response.statusCode).toEqual(200)
        expect(response.body).toEqual([{id: 3, ...product}])
    });

    it('should update Product and return it', async function () {
        const updatedProduct: Product = {
            name: "updated book",
            price: 250,
            category: "updated Books"
        }
        const response = await req.put(`/api/products/product/3`)
            .set("content-type", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .send(updatedProduct);
        expect(response.body).toEqual({id: 3, ...updatedProduct})
        expect(response.statusCode).toEqual(201)
    });

    it('should delete product with id 3 and return it', async function () {
        const response = await req.delete(`/api/products/product/3`)
            .set("content-type", "application/json")
            .set("Authorization", `Bearer ${token}`)
        expect(response.statusCode).toBe(200)
    });
})