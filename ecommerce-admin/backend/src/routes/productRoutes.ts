import express from 'express';
import { getProducts, addProduct, updateProduct, deleteProduct, getProduct } from '../controller/ProductController';
import upload from '../middleware/multer';

const router = express.Router();

router.get('/', getProducts);
router.get('/:sku', getProduct);
router.post('/', upload.array('images'), addProduct);
router.put('/:sku', upload.array('images'), updateProduct);
router.delete('/:sku', deleteProduct);

export default router;
