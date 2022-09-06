import {User, UserModel} from "../User";

const userModel = new UserModel();

describe("Test User Model", () => {
    const defaultUser: User = {
        firstname: "test_f",
        lastname: "test_l",
        email: "test@test.com",
        password: "123456"
    }
    it("should add new user", async () => {

        const result = await userModel.create(defaultUser);
        expect(result.firstname).toEqual(defaultUser.firstname)
        expect(result.lastname).toEqual(defaultUser.lastname)
        expect(result.email).toEqual(defaultUser.email)

    })

    it('should return all users', async () => {
        const newUser: User = {
            firstname: "test_f1",
            lastname: "test_l1",
            email: "test1@test.com",
            password: "1234567"
        }
        await userModel.create(newUser);
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
        const result = await userModel.updateUserPassword(1, oldPassword, newPassword);
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
        const result = await userModel.updateUser(1, newUser);
        expect(result.firstname).toEqual(newUser.firstname)
        expect(result.lastname).toEqual(newUser.lastname)
        expect(result.email).toEqual(newUser.email)
    });

    it('should delete user and return him',async function () {
        await userModel.deleteUser(1);
        const result = await userModel.show(1);
        expect(result).toBeUndefined()
    });
})