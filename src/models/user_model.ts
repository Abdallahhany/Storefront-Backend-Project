import Client from "../database/database";

export type User = {
    id: number;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
};

export class UserModel {
    async index(): Promise<User[]> {
        try {
            // establish connection
            const conn = await Client.connect();

            // write SQL Query
            const sqlQuery = "SELECT * FROM users";

            //run the query in the database
            const result = await conn.query(sqlQuery);

            // close the connection
            conn.release();

            return result.rows;
        } catch (error) {
            throw new Error(`Cannot get Users according to error: ${error}`);
        }
    }

    async show(userId: string): Promise<User> {
        try {
            const conn = await Client.connect();

            const sqlQuery = "SELECT * FROM users WHERE id=($1)";

            const result = await conn.query(sqlQuery, [userId]);

            conn.release();

            return result.rows[0];
        } catch (error) {
            throw new Error(`Cannot get User according to error: ${error}`);
        }
    }

    async Create(u: User): Promise<User> {
        try {
            const sql =
                "INSERT INTO users (firstName, lastName, password, email) VALUES($1, $2, $3, $4) RETURNING *";

            const conn = await Client.connect();

            const result = await conn.query(sql, [
                u.firstName,
                u.lastName,
                u.password,
                u.email,
            ]);

            const user = result.rows[0];

            conn.release();

            return user;
        } catch (err) {
            throw new Error(`Could not add new user ${u.firstName}. Error: ${err}`);
        }
    }
}

export default UserModel;
