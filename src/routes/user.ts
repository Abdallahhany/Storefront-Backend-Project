import express, {Request, Response} from 'express';
import {User, UserModel} from "../models/User";
import jwt from 'jsonwebtoken';
import verifyAuthToken from "../middellwares/auth";

const userModel = new UserModel();
const userRouter = express.Router();

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users: User[] = await userModel.index();
        res.json(users);
    } catch (e) {
        res.status(500).send(e);
    }
};

const getMyAccount = async (req: any, res: Response): Promise<void> => {
    try {
        const user: User = await req.user;
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

        if (!newUser.firstname || !newUser.lastname || !newUser.email || !newUser.password) {
            throw new Error('Please fill all user requirements');
        }

        const registeredUser: User = await userModel.create(newUser);

        res.status(201).json(registeredUser);
    } catch (e) {
        console.log(e)
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

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error('ENV Variable JWT_SECRET is Missing ');
        }

        const token = jwt.sign(user, JWT_SECRET);

        res.status(200).json({user, token});
    } catch (e) {
        // @ts-ignore
        res.status(500).send(e.message);
    }
}

const updateUser = async (req: any, res: Response): Promise<void> => {
    try {
        // const userId = parseInt(req.params['id'], 10);
        const userId = req.user.id;
        const newUserData: User = req.body;

        if (!newUserData.firstname || !newUserData.lastname || !newUserData.email) {
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

const changePassword = async (req: any, res: Response): Promise<void> => {
    try {
        // const userId = parseInt(req.params['id'], 10);
        const userId = req.user.id;
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

        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            throw new Error('ENV Variable JWT_SECRET is Missing ');
        }
        const token = jwt.sign(updatedUser, JWT_SECRET);


        res.status(201).json({user: updatedUser, token});

    } catch (e) {
        // @ts-ignore
        res.status(500).send(e.message);
    }
};

const deleteUser = async (req: any, res: Response): Promise<void> => {
    try {
        const userId = req.user.id;

        // const userId = parseInt(req.params['id'], 10);

        const userToDelete: User = await userModel.show(userId);

        if (!userToDelete) {
            res.status(404).send('There is no User To delete.');
            return;
        }

        const deleteUser = await userModel.deleteUser(userId);

        res.status(200).json(deleteUser);
    } catch (e) {
        // @ts-ignore
        res.status(500).send(e.message);
    }
};

userRouter.post('/register', register);
userRouter.post('/login', loginUser);
userRouter.get('/all', verifyAuthToken, getAllUsers);
userRouter.get('/me', verifyAuthToken, getMyAccount);
userRouter.get('/user/:id', verifyAuthToken, getSingleUser);
userRouter.put('/user', verifyAuthToken, updateUser);
userRouter.put('/user_password', verifyAuthToken, changePassword);
userRouter.delete('/user', verifyAuthToken, deleteUser);


export default userRouter;