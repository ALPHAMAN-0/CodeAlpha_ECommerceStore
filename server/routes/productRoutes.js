import { Router } from 'express';
import {
  getProducts,
  getCategories,
  getProductById,
} from '../controllers/productController.js';

const router = Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

export default router;
