import { Request, Response } from 'express';
import { AppDataSource } from '../ormconfig';
import { Product } from '../entity/Product';

const repo = AppDataSource.getRepository(Product);

export const getProducts = async (req: Request, res: Response) => {
    const products = await repo.find();
    res.json(products);
};

export const getProduct = async (req: Request, res: Response) => {
    const product = await repo.findOneBy({ sku: req.params.sku });
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Product not found');
    }
};

export const addProduct = async (req: Request, res: Response): Promise<void> => {
    const productData = req.body;
    
    const existingProduct = await repo.findOneBy({ sku: productData.sku });
    if (existingProduct) {
        res.status(400).send('Product with this SKU already exists');
        return;
    }

    if (req.files) {
        const files = req.files as Express.Multer.File[];
        productData.images = files.map(file => file.path.replace(/\\/g, '/'));
    } else {
        productData.images = [];
    }
    const product = repo.create(productData);
    const result = await repo.save(product);
    res.json(result);
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    const product = await repo.findOneBy({ sku: req.params.sku });
    if (!product) {
        res.status(404).send('Product not found');
        return;
    }
    const productData = req.body;
    delete productData.sku; // Prevent changing the SKU

    let finalImages: string[] = [];
    if (productData.existingImages) {
        try {
            finalImages = JSON.parse(productData.existingImages);
        } catch (e) {
            console.error("Failed to parse existingImages", e);
        }
    }

    if (req.files) {
        const files = req.files as Express.Multer.File[];
        const newImagePaths = files.map(file => file.path.replace(/\\/g, '/'));
        finalImages.push(...newImagePaths);
    }

    productData.images = finalImages;
    delete productData.existingImages;

    repo.merge(product, productData);
    const result = await repo.save(product);
    res.json(result);
};

export const deleteProduct = async (req: Request, res: Response) => {
    const result = await repo.delete(req.params.sku);
    res.json(result);
};
