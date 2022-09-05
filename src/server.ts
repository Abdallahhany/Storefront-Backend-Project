import express, {Request, Response} from "express";
import bodyParser from "body-parser";
import productRouter from "./routes/product";
import userRouter from "./routes/user";

const app: express.Application = express();
const address: string = "0.0.0.0:3000";

// middlewares
app.use(bodyParser.json());

// application middlewares
app.use('/api/products', productRouter)
app.use('/api/users', userRouter)


//default middleware
app.get("/", function (req: Request, res: Response) {
    res.send("Hello World!");
});

app.listen(3000, function () {
    console.log(`starting app on: ${address}`);
});
