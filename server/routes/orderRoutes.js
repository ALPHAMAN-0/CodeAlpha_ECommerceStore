import { Router } from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  getMyOrders,
  getOrderById,
} from '../controllers/orderController.js';
import authGuard from '../middleware/authGuard.js';

const router = Router();

router.use(authGuard);

router.post(
  '/',
  [
    body('items')
      .isArray({ min: 1 })
      .withMessage('Order must contain at least one item'),
    body('items.*.productId').isMongoId().withMessage('Each item must reference a valid product'),
    body('items.*.quantity')
      .isInt({ min: 1 })
      .withMessage('Each item quantity must be a positive integer'),
    body('shippingAddress.fullName').trim().notEmpty().withMessage('Full name is required'),
    body('shippingAddress.addressLine1')
      .trim()
      .notEmpty()
      .withMessage('Address line 1 is required'),
    body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
    body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
    body('shippingAddress.postalCode')
      .trim()
      .notEmpty()
      .withMessage('Postal code is required'),
    body('shippingAddress.country').trim().notEmpty().withMessage('Country is required'),
  ],
  createOrder
);

router.get('/mine', getMyOrders);
router.get('/:id', getOrderById);

export default router;
