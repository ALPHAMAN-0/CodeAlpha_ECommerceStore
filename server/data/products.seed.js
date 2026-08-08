// 24 realistic catalog products spread across 6 categories, used by seed.js.
// Images use picsum.photos with a unique deterministic seed slug per product
// (https://picsum.photos/seed/<slug>/600/600) instead of source.unsplash.com,
// which is deprecated/unreliable — this keeps demo images always available.
const products = [
  // Electronics
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description:
      'Over-ear Bluetooth headphones with active noise cancellation, 30-hour battery life, and plush memory-foam ear cushions for all-day comfort.',
    price: 129.99,
    imageUrl: 'https://picsum.photos/seed/anc-headphones-x1/600/600',
    category: 'Electronics',
    stock: 45,
  },
  {
    name: 'Smart Fitness Watch',
    description:
      'Waterproof fitness tracker with heart-rate monitoring, GPS, sleep tracking, and a 7-day battery life. Syncs with iOS and Android.',
    price: 89.5,
    imageUrl: 'https://picsum.photos/seed/smart-fitness-watch/600/600',
    category: 'Electronics',
    stock: 60,
  },
  {
    name: 'Portable Bluetooth Speaker',
    description:
      'Compact IPX7 waterproof speaker with 360-degree sound, 12-hour playtime, and built-in microphone for hands-free calls.',
    price: 45.0,
    imageUrl: 'https://picsum.photos/seed/portable-speaker-v2/600/600',
    category: 'Electronics',
    stock: 80,
  },
  {
    name: '4K Action Camera',
    description:
      'Compact action camera with 4K video recording, image stabilization, and a waterproof housing rated to 30 meters.',
    price: 159.99,
    imageUrl: 'https://picsum.photos/seed/4k-action-cam-pro/600/600',
    category: 'Electronics',
    stock: 25,
  },

  // Clothing
  {
    name: "Men's Classic Denim Jacket",
    description:
      'Timeless mid-wash denim jacket with a relaxed fit, button front, and durable cotton construction for everyday wear.',
    price: 64.99,
    imageUrl: 'https://picsum.photos/seed/mens-denim-jacket-01/600/600',
    category: 'Clothing',
    stock: 40,
  },
  {
    name: "Women's Ribbed Knit Sweater",
    description:
      'Soft ribbed-knit pullover sweater with a relaxed silhouette, crew neckline, and breathable cotton-blend fabric.',
    price: 42.0,
    imageUrl: 'https://picsum.photos/seed/womens-knit-sweater-02/600/600',
    category: 'Clothing',
    stock: 55,
  },
  {
    name: 'Unisex Performance Joggers',
    description:
      'Lightweight moisture-wicking joggers with a tapered fit, zip pockets, and an adjustable drawstring waistband.',
    price: 38.5,
    imageUrl: 'https://picsum.photos/seed/performance-joggers-03/600/600',
    category: 'Clothing',
    stock: 70,
  },
  {
    name: 'Everyday Cotton T-Shirt (3-Pack)',
    description:
      'Pre-shrunk 100% combed cotton crew-neck t-shirts in a versatile 3-pack, built for daily wear and easy washing.',
    price: 29.99,
    imageUrl: 'https://picsum.photos/seed/cotton-tshirt-3pack/600/600',
    category: 'Clothing',
    stock: 90,
  },

  // Home & Kitchen
  {
    name: 'Stainless Steel French Press',
    description:
      '34oz double-walled stainless steel French press that keeps coffee hot longer, with a fine-mesh filter for a smooth brew.',
    price: 32.99,
    imageUrl: 'https://picsum.photos/seed/french-press-steel-34oz/600/600',
    category: 'Home & Kitchen',
    stock: 50,
  },
  {
    name: 'Non-Stick Ceramic Cookware Set (10-Piece)',
    description:
      'PFOA-free ceramic non-stick cookware set including frying pans, saucepans, and a stockpot with tempered glass lids.',
    price: 149.0,
    imageUrl: 'https://picsum.photos/seed/ceramic-cookware-10pc/600/600',
    category: 'Home & Kitchen',
    stock: 20,
  },
  {
    name: 'Robot Vacuum Cleaner',
    description:
      'Smart robot vacuum with app control, mapping navigation, automatic charging, and strong suction for pet hair and debris.',
    price: 219.99,
    imageUrl: 'https://picsum.photos/seed/robot-vacuum-smart/600/600',
    category: 'Home & Kitchen',
    stock: 18,
  },
  {
    name: 'Memory Foam Pillow (2-Pack)',
    description:
      'Contoured memory foam pillows with a breathable cooling cover, designed to support proper neck and spine alignment.',
    price: 39.99,
    imageUrl: 'https://picsum.photos/seed/memory-foam-pillow-2pk/600/600',
    category: 'Home & Kitchen',
    stock: 65,
  },

  // Books
  {
    name: 'The Midnight Library (Novel)',
    description:
      'A thought-provoking bestselling novel about the choices that make up a life, and the infinite library between life and death.',
    price: 14.99,
    imageUrl: 'https://picsum.photos/seed/midnight-library-novel/600/600',
    category: 'Books',
    stock: 75,
  },
  {
    name: 'Atomic Habits (Self-Help)',
    description:
      'A practical guide to building good habits and breaking bad ones, backed by proven strategies for lasting behavior change.',
    price: 16.99,
    imageUrl: 'https://picsum.photos/seed/atomic-habits-book/600/600',
    category: 'Books',
    stock: 85,
  },
  {
    name: 'Clean Code: A Handbook (Programming)',
    description:
      'A software engineering classic on writing readable, maintainable code, with practical examples and refactoring techniques.',
    price: 34.99,
    imageUrl: 'https://picsum.photos/seed/clean-code-handbook/600/600',
    category: 'Books',
    stock: 30,
  },
  {
    name: 'World Atlas & Almanac (Reference)',
    description:
      'An up-to-date world atlas with detailed maps, country profiles, and statistical data for students and travelers alike.',
    price: 24.99,
    imageUrl: 'https://picsum.photos/seed/world-atlas-almanac/600/600',
    category: 'Books',
    stock: 22,
  },

  // Sports & Outdoors
  {
    name: 'Yoga Mat with Carrying Strap',
    description:
      'Extra-thick 6mm non-slip yoga mat made from eco-friendly TPE material, includes a carrying strap for easy transport.',
    price: 27.99,
    imageUrl: 'https://picsum.photos/seed/yoga-mat-6mm-strap/600/600',
    category: 'Sports & Outdoors',
    stock: 60,
  },
  {
    name: '2-Person Camping Tent',
    description:
      'Lightweight waterproof camping tent with quick-setup poles, a rainfly, and mesh windows for ventilation on the trail.',
    price: 89.99,
    imageUrl: 'https://picsum.photos/seed/camping-tent-2person/600/600',
    category: 'Sports & Outdoors',
    stock: 15,
  },
  {
    name: 'Adjustable Dumbbell Set',
    description:
      'Space-saving adjustable dumbbells with a quick-select dial, ranging from 5 to 52.5 lbs per hand for progressive training.',
    price: 249.0,
    imageUrl: 'https://picsum.photos/seed/adjustable-dumbbell-set/600/600',
    category: 'Sports & Outdoors',
    stock: 12,
  },
  {
    name: 'Insulated Stainless Steel Water Bottle',
    description:
      '32oz double-wall vacuum-insulated water bottle that keeps drinks cold for 24 hours or hot for 12, leak-proof lid included.',
    price: 22.5,
    imageUrl: 'https://picsum.photos/seed/insulated-bottle-32oz/600/600',
    category: 'Sports & Outdoors',
    stock: 100,
  },

  // Beauty
  {
    name: 'Vitamin C Brightening Serum',
    description:
      'Antioxidant-rich facial serum with vitamin C and hyaluronic acid to brighten skin tone and reduce the look of fine lines.',
    price: 24.99,
    imageUrl: 'https://picsum.photos/seed/vitamin-c-serum-30ml/600/600',
    category: 'Beauty',
    stock: 70,
  },
  {
    name: 'Ceramic Hair Straightener',
    description:
      'Fast-heating ceramic flat iron with adjustable temperature settings and a slim design for precise, frizz-free styling.',
    price: 44.99,
    imageUrl: 'https://picsum.photos/seed/ceramic-straightener-pro/600/600',
    category: 'Beauty',
    stock: 35,
  },
  {
    name: 'Natural Bristle Makeup Brush Set',
    description:
      '12-piece makeup brush set with soft synthetic bristles and ergonomic handles, includes a travel-friendly storage case.',
    price: 19.99,
    imageUrl: 'https://picsum.photos/seed/makeup-brush-set-12pc/600/600',
    category: 'Beauty',
    stock: 55,
  },
  {
    name: 'Hydrating Facial Sheet Masks (10-Pack)',
    description:
      'Deeply hydrating sheet masks infused with aloe vera and green tea extract, formulated for all skin types.',
    price: 15.99,
    imageUrl: 'https://picsum.photos/seed/sheet-masks-10pack/600/600',
    category: 'Beauty',
    stock: 90,
  },
];

export default products;
