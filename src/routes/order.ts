import express, {Request, Response} from "express";
import {Order, OrderModel} from "../models/Order";
import verifyAuthToken from "../middellwares/auth";


const orderModel = new OrderModel();

const orderRouter = express.Router();

const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders: Order[] = await orderModel.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        // @ts-ignore
        res.status(500).send(error.message)
    }
};

const getSingleOrder = async (req: Request, res: Response): Promise<void> => {
    const order_id: number = parseInt(req.params['id'], 10);
    try {
        const order: Order = await orderModel.getOrderById(order_id);
        if (!order) {
            res.status(404).send(`Could not find order ${order_id}`);
            return;
        }
        res.json(order);
    } catch (e) {
        // @ts-ignore
        res.status(500).send(e.message);
    }
};

const getOrdersByUserId = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id, 10)
        const orders: Order[] = await orderModel.getOrdersByUserId(userId);
        if (!orders) {
            throw new Error("cant get order by user id, id is not found")
        }
        res.status(200).json(orders);
    } catch (error) {
        // @ts-ignore
        res.status(500).send(error.message);
    }
};

const createOrder = async (req: Request, res: Response,) => {
    try {
        if (!req.body.status || !req.body.user_id) {
            throw new Error('Please enter product status and user id')
        }
        const order = await orderModel.createOrder(req.body);
        res.status(201).json(order)
    } catch (error) {
        // @ts-ignore
        res.status(500).send(error.message);
    }
};

const updateOrder = async (req: Request, res: Response) => {
    try {
        if (!req.body.status || !req.body.user_id) {
            throw new Error('Please enter product status and user id')
        }
        req.body.id = req.params.id;
        const order = await orderModel.updateOrder(req.body);
        res.status(201).json(order)
    } catch (error) {
        // @ts-ignore
        res.status(500).send(error.message);
    }
};

const deleteOrder = async (req: Request, res: Response) => {
    try {
        const orderId = parseInt(req.params.id, 10)
        const order = await orderModel.deleteOrder(orderId);
        if (!order) {
            throw new Error("Order with that id not found");
        }
        res.status(200).json(order)
    } catch (error) {
        // @ts-ignore
        res.status(500).send(error.message);
    }
};

orderRouter.get("/all", verifyAuthToken, getAllOrders);
orderRouter.get("/order/:id", verifyAuthToken, getSingleOrder);
orderRouter.get("/order_by_user/:id", verifyAuthToken, getOrdersByUserId);
orderRouter.post("/add", verifyAuthToken, createOrder);
orderRouter.put("/order/:id", verifyAuthToken, updateOrder);
orderRouter.delete("/order/:id", verifyAuthToken, deleteOrder);

export default orderRouter;