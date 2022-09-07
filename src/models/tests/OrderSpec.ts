import {Order, OrderModel, OrderProduct} from "../Order";
import client from "../../database/database";
import {Product, ProductModel} from "../Product";
import {User, UserModel} from "../User";


const orderModel = new OrderModel();
const productModel = new ProductModel();
const userModel = new UserModel();


describe("Test Order Model", () => {
    const user: User = {
        firstname: "userTestOrder",
        lastname: "userTestOrder",
        email: "userTestOrder@test",
        password: "userTestOrder@123"
    }
    const defaultOrder: Order = {
        status: "STARTED",
        user_id: 1,
        id: 0
    }
    const orderProduct: OrderProduct = {
        product_id: 1,
        quantity: 3,
    }
    const product: Product = {
        name: "book",
        price: 40,
        category: "Books"
    }
    beforeAll(async () => {
        await productModel.create(product);
        await userModel.create(user);
    })
    it('should Create New Order', async function () {
        const response = await orderModel.createNewOrder(defaultOrder, orderProduct);
        expect(response.length).toEqual(1);
        expect(response).toBeDefined();
    });

    it('should display all orders', async function () {
        const response = await orderModel.displayAllOrders();
        expect(response).toBeDefined()
        expect(response.length).toEqual(1)
        expect(response[0]).toEqual({
            'order id': 1,
            'quantity': orderProduct.quantity,
            'Order Status': defaultOrder.status,
            'user first name': user.firstname,
            'user last name': user.lastname,
            'Product Name': product.name,
            'Product Category': product.category
        });
    });

    it('should return order by its id', async function () {
        const response = await orderModel.getOrderById(1);
        expect(response).toBeDefined();
        expect(response).toEqual({
            'order id': 1,
            'quantity': orderProduct.quantity,
            'Order Status': defaultOrder.status,
            'user first name': user.firstname,
            'user last name': user.lastname,
            'Product Name': product.name,
            'Product Category': product.category
        });
    });

    it('should return all orders by user id', async function () {
        const response = await orderModel.getOrdersByUser(1);
        expect(response).toBeDefined()
        expect(response.length).toEqual(1)
        expect(response[0]).toEqual({
            'order id': 1,
            'quantity': orderProduct.quantity,
            'Order Status': defaultOrder.status,
            'user first name': user.firstname,
            'user last name': user.lastname,
            'Product Name': product.name,
            'Product Category': product.category
        });
    });

    it('should update order status', async function () {
        const response = await orderModel.updateOrderStatus(1, "delivered");
        expect(response).toBeDefined()
        expect(response.status).toBe("delivered");
    });

    it('should Delete Full Order', async function () {
        const response = await orderModel.deleteFullOrder(1);
        expect(response).toEqual([]);
        expect(response.length).toEqual(0)
    });

    afterAll(async () => {
        const conn = await client.connect();

        const sql = 'DELETE FROM order_products;\n DELETE FROM orders;\n DELETE FROM products;\n DELETE FROM users;';

        await conn.query(sql);

        conn.release();
    })
})