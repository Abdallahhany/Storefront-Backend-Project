import express, {Request, Response} from 'express';
import {Product, ProductModel} from "../models/Product";

const productModel = new ProductModel();
const productRouter = express.Router();

const getAllProducts = async (_req: Request, res: Response): Promise<void> => {
    try {
        const products: Product[] = await productModel.index();
        res.json(products);
    } catch (e) {
        res.status(500).send(e);
    }
};

const getSingleProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const product: Product = await productModel.show(parseInt(req.params['id'], 10));
        if (!product) {
            res.status(404).send('Product not found.');
            return;
        }
        res.status(200).json(product);

    } catch (e) {
        // @ts-ignore
        res.status(500).send(e.message);
    }
};

const addProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const newProduct: Product = req.body;

        if (!newProduct.category || !newProduct.name || !newProduct.price) {
            throw new Error('Please fill all product requirements');
        }

        const createdProduct: Product = await productModel.create(newProduct);

        res.status(201).json(createdProduct);
    } catch (e) {
        // @ts-ignore
        res.status(500).send(e.message);
    }
}

const getProductsByCat = async (req: Request, res: Response): Promise<void> => {
    try {
        const product: Product[] = await productModel.getProductsByCat(req.params['cat']);
        if (!product) {
            res.status(404).send('No Products found with that category');
            return;
        }
        res.status(200).json(product);

    } catch (e) {
        res.status(500).send(e);
    }
}

const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const prodId = parseInt(req.params['id'], 10);

        const productToDelete: Product = await productModel.show(prodId);

        if (!productToDelete) {
            res.status(404).send('There is no product with that id To delete.');
            return;
        }
        const deletedProduct = await productModel.deleteProduct(prodId)

        res.status(200).json(deletedProduct);
    } catch (e) {
        // @ts-ignore
        res.status(500).send(e.message);
    }
};

const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const prodId = parseInt(req.params['id'], 10);
        const newProduct: Product = req.body;

        if (!newProduct.category || !newProduct.name || !newProduct.price) {
            throw new Error('Please fill all product requirements');
        }

        const currentProduct: Product = await productModel.show(prodId);

        if (!currentProduct) {
            res.status(404).send('There is no product with that id.');
            return;
        }
        const updatedProduct = await productModel.update(prodId, newProduct);
        res.status(200).json(updatedProduct);
    } catch (e) {
        // @ts-ignore
        res.status(500).send(e.message);
    }
};

productRouter.get('/all', getAllProducts);
productRouter.get('/product/:id', getSingleProduct);
productRouter.post('/add', addProduct);
productRouter.get('/product_by_cat/:cat', getProductsByCat);
productRouter.delete('/product/:id', deleteProduct);
productRouter.put('/product/:id', updateProduct);

export default productRouter;