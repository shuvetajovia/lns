# Mother Nature - Premium Native Foods

Mother Nature is a premium e-commerce platform offering native foods from Kanchipuram, including Kuthuravali, Nava Rice, Rock Salt, and more. It emphasizes a healthy, traditional lifestyle ("The First Step in Health").

## Project Structure

The repository contains two main components:
1. **Storefront (`/`)**: A modern React-based web application (powered by Vite) that serves as the customer-facing e-commerce store. It includes product browsing, a shopping cart, pincode validation for delivery, and Razorpay integration for checkout.
2. **Admin Portal (`/admin-portal`)**: An Electron-based desktop application for store administrators to manage products, orders, and inventory.

## Features

- **Responsive Web Design**: Built with React, featuring a clean UI with modern fonts (Outfit, Playfair Display).
- **Smooth Animations**: Utilizes Framer Motion for delightful user interactions.
- **Pincode Validation**: Checks delivery availability using a comprehensive Indian pincodes database (`pincode.csv` / `pincodes.json`).
- **Razorpay Checkout**: Integrated payment gateway for secure and seamless transactions.
- **Admin Management**: Dedicated Electron app for store management.

## Getting Started

### Storefront

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. **Build for production:**
   ```bash
   npm run build
   ```

### Admin Portal

1. Navigate to the admin portal directory:
   ```bash
   cd admin-portal
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the desktop app:**
   ```bash
   npm start
   ```

## Technologies Used

- **Frontend:** React, Vite, Framer Motion, Lucide React
- **Admin:** Electron, React, Vite
- **Data/Services:** PapaParse (for CSV processing), Razorpay
- **Styling:** Vanilla CSS with custom design tokens

## License

Private repository. All rights reserved.
