import jwt from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('Missing env variable: JWT_SECRET')
}

const verifyAuthToken = (req: any, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.header("Authorization");
        if (!authorizationHeader) {
            throw new Error("Token is not provided with headers")
        }
        const token = authorizationHeader.split(' ')[1];

        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            throw new Error("Token is invalid")
        }
        req.user = decoded;
        next();
    } catch (error) {
        // @ts-ignore
        res.status(401).send(error.message)
    }
}
export default verifyAuthToken;