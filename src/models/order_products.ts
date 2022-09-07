import client from "../database/database";

export type OrderProduct = {
    id?: number;
    quantity: number;
    order_id: number;
    product_id: number;
};

export class OrderProductsModel {
    async create(OP: OrderProduct): Promise<OrderProduct> {
        try {
            const conn = await client.connect();
            const sql =
                "INSERT INTO order_products (quantity,order_id,product_id) VALUES ($1,$2,$3) RETURNING *";
            const result = await conn.query(sql, [
                OP.quantity,
                OP.order_id,
                OP.product_id,
            ]);
            conn.release();
            return result.rows[0];
        } catch (error: any) {
            throw new Error(`can't add new order products ${error.message}`);
        }
    }

    async getProductFromOrder(orderId: number, productId: number): Promise<OrderProduct> {
        try {
            const conn = await client.connect();
            const sql =
                'SELECT op.order_id as id, op.order_id as "orderId", op.product_id as "productId", op.quantity as "quantity", p.price as "price", p.name as "name", p.description as "description" from order_products as op JOIN products AS p ON p.id=op.product_id WHERE order_id=($1) AND product_id=($2)';
            const result = await conn.query(sql, [orderId, productId]);
            conn.release();
            return result.rows[0];
        } catch (error: any) {
            throw new Error(`can't get product id ${productId} in order ${orderId}`);
        }
    }

    async getOrderById(orderId: number): Promise<OrderProduct[]> {
        try {
            const connection = await client.connect();
            const sql =
                "SELECT o.id as id, op.order_id as order_id, op.product_id as product_id, JSON_AGG(JSONB_BUILD_OBJECT('productId', p.id, 'name', p.name, 'description', p.description,'category', p.category, 'price', p.price, 'quantity', op.quantity)) as products FROM orders AS o LEFT JOIN order_products as op ON o.id = op.order_id LEFT JOIN products AS p ON op.product_id = p.id WHERE o.id=$1 GROUP BY o.id, op.order_id, op.product_id";
            const result = await connection.query(sql, [orderId]);
            connection.release();
            return result.rows;
        } catch (error) {
            // @ts-ignore
            throw new Error(`can't get all products by id ${orderId} ${error.message}`);
        }
    }

    async deleteProductFromOrder(
        orderId: number,
        productId: number
    ): Promise<OrderProduct> {
        try {
            const connection = await client.connect();
            const sql =
                "DELETE FROM order_products WHERE order_id=($1) AND product_id=($2) RETURNING *;";
            const result = await connection.query(sql, [orderId, productId]);
            connection.release();
            return result.rows[0];
        } catch (error) {
            // @ts-ignore
            throw new Error(`Can't remove product id ${productId} From order id : ${orderId}:Error ${error.message}`);
        }
    }
}