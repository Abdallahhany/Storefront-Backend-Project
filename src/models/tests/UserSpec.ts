import {User, UserModel} from "../User";
import client from "../../database/database";

const userModel = new UserModel();

describe("Test User Model", () => {
    const defaultUser: User = {
        firstname: "test_f",
        lastname: "test_l",
        email: "test@test.com",
        password: "123456"
    }
    beforeAll(async () => {
        await userModel.create(defaultUser);
    })
    it("should add new user", async () => {
        const user: User = {
            firstname: "testUserModel",
            lastname: "testUserModel",
            email: "testUserModel@test.com",
            password: "testUserModel"
        }

        const result = await userModel.create(user);
        expect(result.firstname).toEqual(user.firstname)
        expect(result.lastname).toEqual(user.lastname)
        expect(result.email).toEqual(user.email)

    })

    it('should return all users', async () => {
        const result = await userModel.index();
        expect(result.length).toBe(2)
    });

    it('should return user if entered email and password are correct', async function () {
        const result = await userModel.authenticate(defaultUser.email, defaultUser.password);
        expect(result.firstname).toEqual(defaultUser.firstname)
        expect(result.lastname).toEqual(defaultUser.lastname)
        expect(result.email).toEqual(defaultUser.email)
    });

    it('should update my password case entered password is correct', async function () {
        const oldPassword = defaultUser.password;
        const newPassword = "123456789";
        const result = await userModel.updateUserPassword(2, oldPassword, newPassword);
        expect(result.firstname).toEqual(defaultUser.firstname)
        expect(result.lastname).toEqual(defaultUser.lastname)
        expect(result.email).toEqual(defaultUser.email)
    });

    it('should update my new data', async function () {
        const newUser: User = {
            firstname: "updated test_f1",
            lastname: "updated test_l1",
            email: "testupdate@test.com",
            password: "123456"
        }
        const result = await userModel.updateUser(2, newUser);
        expect(result.firstname).toEqual(newUser.firstname)
        expect(result.lastname).toEqual(newUser.lastname)
        expect(result.email).toEqual(newUser.email)
    });

    it('should delete user and return him', async function () {
        await userModel.deleteUser(2);
        const result = await userModel.show(2);
        expect(result).toBeUndefined()
    });
    afterAll(async () => {
        const conn = await client.connect();

        const sql = 'DELETE FROM order_products;\n DELETE FROM orders;\n DELETE FROM products;\n DELETE FROM users;';

        await conn.query(sql);

        conn.release();
    })
})