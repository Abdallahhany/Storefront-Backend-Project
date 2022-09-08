import supertest from "supertest";
import {Product, ProductModel} from "../../models/Product";
import {User, UserModel} from "../../models/User"
import app from "../../server";
import client from "../../database/database";
import {Order, OrderProduct} from "../../models/Order";

const productModel = new ProductModel();
const userModel = new UserModel();

const req = supertest(app);
let token: string;

describe('Order API Routes', () => {

    const product: Product = {
        name: "Book",
        price: 200,
        category: "Books"
    }

    const user: User = {
        firstname: "userTestOrderRoute",
        lastname: "userTestOrderRoute",
        email: "userTestOrderRoute@test.com",
        password: "userTestOrderRoute@123"
    }

    const defaultOrder: Order = {
        status: "STARTED",
        user_id: 4,
        id: 0
    }
    const orderProduct: OrderProduct = {
        product_id: 4,
        quantity: 3,
    }

    beforeAll(async () => {
        await productModel.create(product)
        await userModel.create(user)
        const response = await req.post('/api/users/login')
            .send(user)
        token = response.body.token;
    });

    it('should create new order', async function () {
        const response = await req.post('/api/orders/add')
            .set("content-type", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .send(orderProduct)
            .send(defaultOrder)
        expect(response.body).toEqual({msg: 'Success'})
        expect(response.statusCode).toEqual(201)

    });

    it('should get all orders', async function () {
        const response = await req.get('/api/orders/all')
            .set("content-type", "application/json")
            .set("Authorization", `Bearer ${token}`)
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual([{
            'order id': 2,
            'quantity': orderProduct.quantity,
            'Order Status': defaultOrder.status,
            'user first name': user.firstname,
            'user last name': user.lastname,
            'Product Name': product.name,
            'Product Category': product.category
        }])
        expect(response.body.length).toEqual(1)
    });

    it('should get order by id', async function () {
        const response = await req.get('/api/orders/order/2')
            .set("content-type", "application/json")
            .set("Authorization", `Bearer ${token}`)
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            'order id': 2,
            'quantity': orderProduct.quantity,
            'Order Status': defaultOrder.status,
            'user first name': user.firstname,
            'user last name': user.lastname,
            'Product Name': product.name,
            'Product Category': product.category
        })
    });

    it('should return all user orders', async function () {
        const response = await req.get('/api/orders/order_by_user/4')
            .set("content-type", "application/json")
            .set("Authorization", `Bearer ${token}`)
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual([{
            'order id': 2,
            'quantity': orderProduct.quantity,
            'Order Status': defaultOrder.status,
            'user first name': user.firstname,
            'user last name': user.lastname,
            'Product Name': product.name,
            'Product Category': product.category
        }])
    });

    it('should update order status', async function () {
        const response = await req.put('/api/orders/order/2')
            .set("content-type", "application/json")
            .set("Authorization", `Bearer ${token}`)
            .send({status: "delivered"})
        expect(response.body).toEqual({id: 2, status: 'delivered', user_id: `${defaultOrder.user_id}`})
        expect(response.statusCode).toBe(201)

    });

    it('should delete full order', async function () {
        const response = await req.delete('/api/orders/order/2')
            .set("content-type", "application/json")
            .set("Authorization", `Bearer ${token}`)

        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({msg: "Order Deleted Successfully"});

    });

    afterAll(async () => {
        const conn = await client.connect();

        const sql = 'DELETE FROM order_products;\n DELETE FROM orders;\n DELETE FROM products;\n DELETE FROM users;';

        await conn.query(sql);

        conn.release();
    })
})
