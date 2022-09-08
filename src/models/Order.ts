import client from "../database/database";

export type Order = {
    id?: number;
    status: string;
    user_id: number;
};

export type OrderProduct = {
    id?: number;
    quantity: number;
    order_id?: number;
    product_id: number;
};

export class OrderModel {
    // create order done successfully
    async createNewOrder(order: Order, orderProduct: OrderProduct) {
        try {
            const conn = await client.connect();
            let sql: string;
            let result;

            //add product to specific order
            if (order.id !== 0) {
                orderProduct.order_id = order.id;
            }
            //case new order
            else {

                sql = `INSERT INTO orders(status, user_id)
                       VALUES ($1, $2) RETURNING *;`;
                result = await conn.query(sql, [order.status, order.user_id]);
                orderProduct.order_id = result.rows[0].id;

            }
            // get id of created order
            sql = "INSERT INTO order_products(quantity, order_id, product_id) VALUES ($1, $2, $3) RETURNING *;";
            result = await conn.query(sql, [orderProduct.quantity, orderProduct.order_id, orderProduct.product_id]);
            conn.release()
            return result.rows;
        } catch (e) {
            console.log(e)
            throw new Error(`Cannot create order, Error${e}`);
        }

    }

    async displayAllOrders() {
        try {
            const conn = await client.connect();
            let sql =
                'SELECT o.id as "order id", op.quantity as "quantity", o.status as "Order Status",u.firstname as "user first name",u.lastname as "user last name", p.name as "Product Name",p.category as "Product Category" FROM order_products AS op INNER JOIN orders as o ON op.order_id=o.id INNER JOIN users as u ON u.id=o.user_id INNER JOIN products as p ON op.product_id=p.id';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (e) {
            throw new Error(`Cannot display all orders, Error${e}`);
        }
    }

    async getOrderById(orderId: number) {
        try {
            const conn = await client.connect();
            const sql =
                'SELECT o.id as "order id", op.quantity as "quantity", o.status as "Order Status",u.firstname as "user first name",u.lastname as "user last name", p.name as "Product Name",p.category as "Product Category" FROM order_products AS op INNER JOIN orders as o ON op.order_id=o.id INNER JOIN users as u ON u.id=o.user_id INNER JOIN products as p ON op.product_id=p.id WHERE o.id=($1)';
            const result = await conn.query(sql, [orderId]);
            conn.release();
            return result.rows[0];
        } catch (e) {
            throw new Error(`Cannot get order, Error${e}`);
        }
    }

    async getOrdersByUser(userId: number) {
        try {
            const conn = await client.connect();
            const sql =
                'SELECT o.id as "order id", op.quantity as "quantity", o.status as "Order Status",u.firstname as "user first name",u.lastname as "user last name", p.name as "Product Name", p.category as "Product Category" FROM order_products AS op INNER JOIN orders as o ON op.order_id=o.id INNER JOIN users as u ON u.id=o.user_id INNER JOIN products as p ON op.product_id=p.id WHERE u.id=($1);';
            const result = await conn.query(sql, [userId]);
            conn.release();
            return result.rows;
        } catch (e) {
            throw new Error(`Cannot get order, Error${e}`);
        }
    }

    async updateOrderStatus(orderId: number, status: string) {
        try {
            const conn = await client.connect();
            const sql = `UPDATE orders
                         SET status=($1)
                         WHERE id = ($2) RETURNING *;`
            const result = await conn.query(sql, [status, orderId]);
            conn.release();
            return result.rows[0];
        } catch (e) {
            throw new Error(`Cannot update order, Error${e}`);
        }
    }

    async deleteFullOrder(orderId: number) {
        try {
            const conn = await client.connect();
            //delete order from product orders first
            let sql = `DELETE
                       FROM order_products
                       WHERE order_id = ($1);`
            await conn.query(sql, [orderId]);

            //delete order from orders

            sql = 'DELETE FROM orders WHERE id = ($1);'
            let result = await conn.query(sql, [orderId]);

            conn.release();
            return result.rows;
        } catch (e) {
            throw new Error(`Cannot delete order, Error${e}`);
        }
    }
}
