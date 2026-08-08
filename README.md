# CodeAlpha_E-Commerce_Store

A full-stack e-commerce store built for the CodeAlpha Full Stack Development internship (Task 1).

Browse a product catalog, filter/search, add items to a cart, check out, and view order history — built with the MERN stack.

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS + React Router
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose (runs locally via Docker)
- **Auth:** JWT + bcrypt

## Features

- Product catalog with category filter, search, and pagination
- Product detail pages
- Shopping cart (persisted across refreshes)
- User registration/login
- Checkout with order processing (shipping details + order confirmation — no real payment gateway is used; the payment section is illustrative only)
- Order history per user

## Getting Started

### Prerequisites
- Node.js 18+
- Docker Desktop (for MongoDB)

### 1. Start the database
```bash
docker compose up -d
```

### 2. Set up the backend
```bash
cd server
cp .env.example .env
npm install
npm run seed   # populates the product catalog
npm run dev    # starts the API on http://localhost:5001
```

### 3. Set up the frontend
```bash
cd client
cp .env.example .env
npm install
npm run dev    # starts the app on http://localhost:5173
```

### 4. Open the app
Visit `http://localhost:5173`.

## Notes

- Password reset / email verification is out of scope for this project.
- The checkout payment form is cosmetic only — no card details are validated or transmitted; order processing is real (stock is decremented and orders are persisted).
- Deployment (MongoDB Atlas + a hosted backend/frontend) is a later phase once the local build is verified end-to-end.

## License

Built for educational purposes as part of the CodeAlpha internship program.
