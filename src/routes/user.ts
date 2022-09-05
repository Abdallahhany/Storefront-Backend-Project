import express, {Request, Response} from 'express';
import {User, UserModel} from "../models/User";

const userModel = new UserModel();
const userRouter = express.Router();

const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users: User[] = await userModel.index();
        res.json(users);
    } catch (e) {
        res.status(500).send(e);
    }
};

const getSingleUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user: User = await userModel.show(parseInt(req.params['id'], 10));
        if (!user) {
            res.status(404).send('User not found.');
            return;
        }
        res.status(200).json(user);

    } catch (e) {
        // @ts-ignore
        res.status(500).send(e.message);
    }
};

const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const newUser: User = req.body;

        if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password) {
            throw new Error('Please fill all user requirements');
        }

        const registeredUser: User = await userModel.create(newUser);

        res.status(201).json(registeredUser);
    } catch (e) {
        // @ts-ignore
        res.status(500).send(e.message);
    }
}

const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            throw new Error('Make sure that you entered email and password');
        }
        const user: User = await userModel.authenticate(email, password);

        res.status(200).json(user);
    } catch (e) {
        // @ts-ignore
        res.status(500).send(e.message);
    }
}

const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = parseInt(req.params['id'], 10);
        const newUserData: User = req.body;

        if (!newUserData.firstName || !newUserData.lastName || !newUserData.email) {
            throw new Error('Please fill all User requirements');

        }

        const currentUser: User = await userModel.show(userId);

        if (!currentUser) {
            res.status(404).send('There is no User with that id.');
            return;
        }
        const updatedUser = await userModel.updateUser(userId, newUserData);
        res.status(201).json(updatedUser);
    } catch (e) {
        // @ts-ignore
        res.status(500).send(e.message);
    }
};

const changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = parseInt(req.params['id'], 10);
        const {oldPassword, newPassword} = req.body;

        if (!oldPassword || !newPassword) {
            throw new Error('Please enter old and new password');

        }

        const currentUser: User = await userModel.show(userId);

        if (!currentUser) {
            res.status(404).send('There is no User with that id.');
            return;
        }

        const updatedUser = await userModel.updateUserPassword(userId, oldPassword, newPassword);

        res.status(200).json(updatedUser);

    } catch (e) {
        // @ts-ignore
        res.status(500).send(e.message);
    }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = parseInt(req.params['id'], 10);

        const userToDelete: User = await userModel.show(userId);

        if (!userToDelete) {
            res.status(404).send('There is no User with that id To delete.');
            return;
        }

        const deleteUser = await userModel.deleteUser(userId);

        res.status(200).json(deleteUser);
    } catch (e) {
        // @ts-ignore
        res.status(500).send(e.message);
    }
};

userRouter.get('/all', getAllUsers);
userRouter.get('/user/:id', getSingleUser);
userRouter.post('/register', register);
userRouter.post('/login', loginUser);
userRouter.put('/user/:id', updateUser);
userRouter.put('/user_password/:id', changePassword);
userRouter.delete('/user/:id', deleteUser);


export default userRouter;