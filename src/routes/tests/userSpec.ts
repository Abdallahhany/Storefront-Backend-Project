import supertest from "supertest";
import {User, UserModel} from "../../models/User";
import app from "../../server";

const userModel = new UserModel();

const req = supertest(app);

describe('Test User Routes', () => {
    const defaultUser: User = {
        firstname: "tester",
        lastname: "tester",
        email: "tester@test.com",
        password: "test@123"
    }
    beforeAll(async () => {
        await userModel.create(defaultUser);
    })
    let defaultUserTokenAfterLogin: string;

    it('should return user and token if email and password is correct', async function () {
        const response = await req.post('/api/users/login')
            .send(defaultUser)
        expect(response.statusCode).toEqual(200)
        expect(response.body.token).toBeDefined()
        defaultUserTokenAfterLogin = response.body.token;
        expect(response.body.user).toBeDefined()
    });

    it('should return all users', async function () {
        const response = await req.get("/api/users/all")
            .set("Authorization", `Bearer ${defaultUserTokenAfterLogin}`)
        expect(response.body.length).toEqual(1);
        expect(response.statusCode).toBe(200)
    });
    it('should register new user', async function () {
        const newUser: User = {
            firstname: "tester_register",
            lastname: "tester_register",
            email: "tester_register@test.com",
            password: "tester@123"
        }
        const response = await req.post("/api/users/register")
            .set("Content-type", "application/json")
            .send(newUser)
        expect(response.body).toEqual({
            id: 7,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            email: newUser.email
        })
        expect(response.statusCode).toEqual(201)
    });

    it('should return my account', async function () {
        const response = await req.get("/api/users/me")
            .set("Authorization", `Bearer ${defaultUserTokenAfterLogin}`)

        expect(response.statusCode).toEqual(200)
    });

    it('should return user with id 6', async function () {
        const response = await req.get('/api/users/user/6')
            .set("Authorization", `Bearer ${defaultUserTokenAfterLogin}`)
        expect(response.body.firstname).toEqual(defaultUser.firstname)
        expect(response.body.lastname).toEqual(defaultUser.lastname)
        expect(response.body.email).toEqual(defaultUser.email)
        expect(response.body.password).not.toEqual(defaultUser.password)
        expect(response.statusCode).toBe(200)
    });


    it('should update user data with new one', async function () {
        const newUser = {
            firstname: "test update",
            lastname: "test update",
            email: "testupdate@test.com"
        }
        const response = await req.put('/api/users/user')
            .set("Authorization", `Bearer ${defaultUserTokenAfterLogin}`)
            .set("Content-type", "application/json")
            .send(newUser)
        expect(response.body.firstname).toEqual(newUser.firstname)
        expect(response.body.lastname).toEqual(newUser.lastname)
        expect(response.body.email).toEqual(newUser.email)
        expect(response.statusCode).toEqual(201)
    });
    let newTokenAfterChangePassword: string;
    it('should change user password', async function () {
        const oldPassword = defaultUser.password;
        const newPassword = "newPassword";
        const response = await req.put('/api/users/user_password')
            .set("Authorization", `Bearer ${defaultUserTokenAfterLogin}`)
            .set("Content-type", "application/json")
            .send({oldPassword, newPassword})
        expect(response.body.user).toBeDefined();
        expect(response.body.token).toBeDefined();
        newTokenAfterChangePassword = response.body.token;
        expect(response.statusCode).toEqual(201)
    });

    it('should delete user account', async function () {
        let response = await req.delete('/api/users/user')
            .set("Authorization", `Bearer ${newTokenAfterChangePassword}`)
        expect(response.statusCode).toEqual(200)
        response = await req.get('/api/users/user/6')
            .set("Authorization", `Bearer ${newTokenAfterChangePassword}`)
        expect(response.body).toEqual({})
    });

})