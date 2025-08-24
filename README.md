# Multi Electric Supply - E-commerce Platform

A comprehensive e-commerce platform built with Next.js, MongoDB, and Stripe for Multi Electric Supply.

## Features

### Customer Storefront
- Product browsing and search
- Shopping cart with persistence
- Secure checkout with Stripe
- Order tracking and status updates
- User account management

### Employee Portal
- Order fulfillment management
- Inventory adjustments
- Pickup verification
- Order preparation workflow

### Admin Portal
- Complete catalog management
- User and role management
- Sales analytics and reporting
- System settings and configuration

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Authentication**: JWT with role-based access control (RBAC)
- **Payments**: Stripe with webhook integration
- **Email**: Nodemailer for notifications
- **File Storage**: Local storage with Sharp for image processing

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env.local`:
   - MongoDB connection string
   - Stripe API keys
   - JWT secrets
   - Email service credentials

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router
├── components/            # Reusable UI components
├── lib/                   # Utilities and configurations
├── models/               # MongoDB models
├── middleware/           # Authentication and RBAC middleware
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## User Roles

- **Customer**: Browse products, place orders, track deliveries
- **Employee**: Fulfill orders, manage inventory, verify pickups
- **Admin**: Full system access, analytics, user management

## Security Features

- JWT authentication with refresh tokens
- Role-based access control (RBAC)
- Stripe webhook signature verification
- Input validation and sanitization
- Rate limiting on sensitive endpoints
- Audit logging for all admin/employee actions

## License

Private - Multi Electric Supply
