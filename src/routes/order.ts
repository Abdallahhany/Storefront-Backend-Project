import express, {Request, Response} from "express";
import {Order, OrderModel, OrderProduct} from "../models/Order";
import verifyAuthToken from "../middellwares/auth";


const orderModel = new OrderModel();

const orderRouter = express.Router();

const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await orderModel.displayAllOrders();
        if (!orders) {
            throw new Error("there is no orders found")
        }
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
        res.status(200).json(order);
    } catch (e) {
        // @ts-ignore
        res.status(500).send(e.message);
    }
};

const getAllUserOrders = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.id, 10)
        const orders: Order[] = await orderModel.getOrdersByUser(userId);
        if (!orders) {
            throw new Error("cant get order by user id, id is not found")
        }
        res.status(200).json(orders);
    } catch (error) {
        // @ts-ignore
        res.status(500).send(error.message);
    }
};

const createOrder = async (req: any, res: Response,) => {
    try {
        if (!req.body.quantity || !req.body.product_id) {
            throw new Error('Please enter product quantity and id ')
        }
        const order: Order = {
            id: req.body.order_id ? req.body.order_id : 0,
            status: req.body.status ? req.body.status : "Started",
            user_id: req.user.id,
        }
        const orderProduct: OrderProduct = {
            quantity: req.body.quantity,
            product_id: req.body.product_id
        }
        await orderModel.createNewOrder(order, orderProduct);
        res.status(201).json({msg: "Success"})
    } catch (error) {
        console.log(error)
        // @ts-ignore
        res.status(500).send(error.message);
    }
};

const updateOrder = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            throw new Error('order id is not sent in params')
        }
        const orderId = parseInt(req.params.id, 10);

        if (!req.body.status) {
            throw new Error('Please enter product status and user id')
        }
        const order = await orderModel.updateOrderStatus(orderId, req.body.status);
        res.status(201).json(order)
    } catch (error) {
        // @ts-ignore
        res.status(500).send(error.message);
    }
};

const deleteFullOrder = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            throw new Error('order id is not sent in params')
        }
        const orderId = parseInt(req.params.id, 10);
        const order = await orderModel.deleteFullOrder(orderId);
        if (!order) {
            throw new Error("Order with that id not found");
        }
        res.status(200).json({msg: "Order Deleted Successfully"})
    } catch (error) {
        // @ts-ignore
        res.status(500).send(error.message);
    }
};

orderRouter.get("/all", verifyAuthToken, getAllOrders);
orderRouter.get("/order/:id", verifyAuthToken, getSingleOrder);
orderRouter.get("/order_by_user/:id", verifyAuthToken, getAllUserOrders);
orderRouter.post("/add", verifyAuthToken, createOrder);
orderRouter.put("/order/:id", verifyAuthToken, updateOrder);
orderRouter.delete("/order/:id", verifyAuthToken, deleteFullOrder);

export default orderRouter;