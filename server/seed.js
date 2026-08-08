// Must be the first import — see server.js for why dotenv's side-effect
// entrypoint needs to run before any module that reads process.env at
// module-evaluation time.
import 'dotenv/config';

import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Product from './models/Product.js';
import products from './data/products.seed.js';

const seed = async () => {
  await connectDB();

  try {
    const deleted = await Product.deleteMany({});
    console.log(`Cleared ${deleted.deletedCount} existing product(s)`);

    const inserted = await Product.insertMany(products);
    console.log(`Inserted ${inserted.length} products across ${
      new Set(inserted.map((p) => p.category)).size
    } categories`);

    console.log('Seeding complete.');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seed();
