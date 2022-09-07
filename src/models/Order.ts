import client from "../database/database";

export type Order = {
    id?: number;
    status: string;
    user_id: number;
};

export class OrderModel {
    async getAllOrders(): Promise<Order[]> {
        try {
            const conn = await client.connect();
            const sql = "SELECT * FROM orders";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (error) {
            // @ts-ignore
            throw new Error(`can't get all Order ${error.message}`);
        }
    }

    async getOrderById(id: number): Promise<Order> {
        try {
            const conn = await client.connect();
            const sql = "SELECT * FROM orders WHERE id=($1)";
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (error: any) {
            throw new Error(`can't get order id: ${id}`);
        }
    }

    async getOrdersByUserId(id: number): Promise<Order[]> {
        try {
            const conn = await client.connect();
            const sql = "SELECT * FROM orders WHERE user_id=($1)";
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows;
        } catch (error: any) {
            throw new Error(`Can't get Order by user Id: ${id}`);
        }
    }

    async createOrder(order: Order): Promise<Order> {
        try {
            const conn = await client.connect()
            const sql =
                "INSERT INTO orders (status, user_id) values($1, $2) RETURNING *";
            const result = await conn.query(sql, [order.status, order.user_id]);
            conn.release()
            return result.rows[0]
        } catch (error) {
            // @ts-ignore
            throw new Error(`Can't create Order ${error.message}`);
        }
    }

    async updateOrder(order: Order): Promise<Order> {
        try {
            const conn = await client.connect();
            const sql =
                "UPDATE orders SET status=($1), user_id=($2) WHERE id=($3) RETURNING *";
            const result = await conn.query(sql, [
                order.status,
                order.user_id,
                order.id,
            ]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            // @ts-ignore
            throw new Error(`can't update order Error: ${error.message}`);
        }
    }

    async deleteOrder(id: number): Promise<Order> {
        try {
            const conn = await client.connect();
            const sql = "DELETE FROM orders WHERE id=($1) RETURNING *";
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (error: any) {
            throw new Error(`can't delete Order Id ${id}`);
        }
    }
}
