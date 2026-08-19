import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';

// Re-increments stock for every line item that was already successfully
// decremented earlier in the same order, so a failure partway through a
// multi-item order never leaves the catalog with lost stock.
const rollbackStock = async (processedItems) => {
  await Promise.all(
    processedItems.map(({ productId, quantity }) =>
      Product.findByIdAndUpdate(productId, { $inc: { stock: quantity } })
    )
  );
};

// @desc    Create a new order (server re-derives price/name, decrements stock)
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { items, shippingAddress } = req.body;

  const processedItems = []; // line items already decremented — used for rollback
  const orderItems = []; // server-derived snapshot for the Order document

  try {
    for (const { productId, quantity } of items) {
      // Guarded update: only succeeds if the product exists AND has enough
      // stock, decrementing atomically in the same query to prevent
      // overselling under concurrent requests.
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true }
      );

      if (!updatedProduct) {
        const existingProduct = await Product.findById(productId);
        const error = new Error(
          existingProduct
            ? `Insufficient stock for "${existingProduct.name}" (requested ${quantity}, available ${existingProduct.stock})`
            : `Product not found: ${productId}`
        );
        error.statusCode = existingProduct ? 409 : 404;
        throw error;
      }

      processedItems.push({ productId, quantity });
      // Price/name are re-derived from the just-updated DB document —
      // the client-submitted price (if any) is never trusted.
      orderItems.push({
        product: updatedProduct._id,
        name: updatedProduct.name,
        price: updatedProduct.price,
        quantity,
      });
    }
  } catch (error) {
    await rollbackStock(processedItems);
    res.status(error.statusCode || 400);
    throw error;
  }

  const itemsPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let order;
  try {
    order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      itemsPrice,
      totalPrice: itemsPrice,
      status: 'pending',
    });
  } catch (error) {
    // Stock was already decremented above; if persisting the order fails
    // (e.g. a transient DB error) put the stock back so it isn't silently lost.
    await rollbackStock(processedItems);
    throw error;
  }

  res.status(201).json({
    success: true,
    order,
  });
});

// @desc    Get the logged-in user's orders, newest first
// @route   GET /api/orders/mine
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    orders,
  });
});

// @desc    Get a single order by id (owner only)
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error(`Invalid order id: ${req.params.id}`);
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this order');
  }

  res.status(200).json({
    success: true,
    order,
  });
});
