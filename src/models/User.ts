import Client from "../database/database";
import bcrypt, {hash} from 'bcrypt';

export type User = {
    id: number;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
};
const bcryptKey = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS;

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

    async show(userId: number): Promise<User> {
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

    async create(u: User): Promise<User> {
        try {
            const sql =
                "INSERT INTO users (firstName, lastName, password, email) VALUES($1, $2, $3, $4) RETURNING id, firstName, lastName, email";

            const conn = await Client.connect();

            const hashedPassword = await hashPassword(u.password);

            const result = await conn.query(sql, [
                u.firstName,
                u.lastName,
                hashedPassword,
                u.email,
            ]);

            const user = result.rows[0];

            conn.release();

            return user;
        } catch (err) {
            throw new Error(`Could not add new user ${u.firstName}. Error: ${err}`);
        }
    }

    async authenticate(email: string, password: string): Promise<User> {
        try {
            const conn = await Client.connect();
            let sql = 'SELECT password FROM users WHERE email=($1);'
            const result = await conn.query(sql, [email]);
            if (!result.rows.length) {
                conn.release();
                throw new Error('Invalid Email or Password.');
            }
            const realPassword = result.rows[0]['password'];

            if(!bcryptKey){
                throw new Error('Missing env variable: bcryptKey')
            }

            const isMatched = await bcrypt.compare(`${password}${bcryptKey}`, realPassword);
            if (!isMatched) {
                conn.release();
                throw new Error('Invalid Email or Password.');
            }
            sql = 'SELECT id, email, firstName, lastName FROM users WHERE email=($1)';
            const userInformation = await conn.query(sql, [email]);

            const user = userInformation.rows[0];

            conn.release();

            return user;
        } catch (e) {

            // @ts-ignore
            throw new Error(`Login Filed according to ERROR: ${e.message}`);
        }
    }

    async updateUser(id: number, u: User): Promise<User> {
        try {
            const sql = 'UPDATE users SET firstName=($1), lastName=($2), email=($3) WHERE id=($4) RETURNING *';

            const conn = await Client.connect();

            const result = await conn.query(sql, [
                u.firstName,
                u.lastName,
                u.email,
                id
            ]);

            const user = result.rows[0];

            conn.release();

            return user;
        } catch (e) {
            // @ts-ignore
            throw new Error(`Can't Update user ${u.firstName} ,error is: ${e.message}`);
        }

    }

    async updateUserPassword(id: number, oldPassword: string, newPassword: string): Promise<User> {
        try {
            const sql = 'SELECT password FROM users WHERE id=($1)';

            const conn = await Client.connect();

            let result = await conn.query(sql, [id]);

            const password = result.rows[0]["password"];
            if(!bcryptKey){
                throw new Error('Missing env variable: bcryptKey')
            }

            const isMatched = await bcrypt.compare(`${oldPassword}${bcryptKey}`, password);

            if (!isMatched) {
                conn.release();
                throw new Error(`password is not matched, Please enter correct password`);
            }
            const sqlUpdate = `UPDATE users
                               SET password =($1)
                               WHERE id = ($2) RETURNING *`;

            const hashedPassword = await hashPassword(newPassword);

            result = await conn.query(sqlUpdate, [hashedPassword, id]);

            const user = result.rows[0];

            conn.release();

            return user;
        } catch (e: any) {
            throw new Error(
                `Can't Update user password, error is: ${e.message}`
            );
        }
    }

    async deleteUser(userId: number): Promise<User> {
        try {
            const conn = await Client.connect();

            const sqlQuery = "DELETE FROM users WHERE id=($1) RETURNING *";

            const result = await conn.query(sqlQuery, [userId]);

            conn.release();

            return result.rows[0];
        } catch (e) {
            // @ts-ignore
            throw new Error(`Cannot Delete User according to error: ${e.message}`);
        }
    }


}

const hashPassword = async (password: string) => {
    if (!saltRounds || !bcryptKey) {
        return new Error('Missing ENV variables')
    }
    const salt = await bcrypt.genSalt(parseInt(saltRounds!, 10));
    return await bcrypt.hash(`${password}${bcryptKey}`, salt);
};
export default UserModel;
