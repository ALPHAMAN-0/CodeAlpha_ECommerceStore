import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get products (optionally filtered by category / name search, paginated)
// @route   GET /api/products?category=&search=&page=&limit=
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const { category, search } = req.query;

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (category && category !== 'All') {
    filter.category = category;
  }
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  const [products, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    products,
    page,
    pages: Math.ceil(total / limit) || 1,
    total,
    hasMore: skip + products.length < total,
  });
});

// @desc    Get distinct list of product categories (for filter UI)
// @route   GET /api/products/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');

  res.status(200).json({
    success: true,
    categories: categories.sort(),
  });
});

// @desc    Get a single product by id
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.status(200).json({
    success: true,
    product,
  });
});
