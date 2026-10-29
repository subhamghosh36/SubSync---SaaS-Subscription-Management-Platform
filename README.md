# SubSync — Enterprise SaaS Subscription & Usage Management Platform

![SubSync Platform](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80)

> **SubSync** is a production-ready, full-stack SaaS Subscription Management Platform engineered with **Next.js 14**, **Node.js**, **PostgreSQL (Prisma ORM)**, and the **Stripe API**. It features real-time telemetry quota tracking, automated Stripe webhooks, client/server PDF invoice downloads, and an enterprise Role-Based Access Control (RBAC) control plane.

---

## ⚡ Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14 (App Router)** | Modern React 18, Tailwind CSS, Lucide Icons, Recharts, Canvas Confetti |
| **Backend** | **Node.js Server Runtime** | High-performance API Route handlers, Edge runtime compatibility |
| **Database** | **PostgreSQL 18 & Prisma ORM** | Relational data model with fallback JSON/SQLite persistence |
| **Payments** | **Stripe API (v2024-06-20)** | Checkout Sessions, Customer Portal, Webhook Handlers & Sandbox Simulator |
| **Invoicing** | **jsPDF & autoTable** | Itemized vector PDF generation, VAT/tax calculation, and instant download |

---

## 🚀 Core Features

### 1. Subscription Plans & Dynamic Upgrades (`/pricing`)
- **Three Tiers**:
  - **Developer Free ($0/mo)**: 10,000 API requests, 1 Seat, 5 GB Bandwidth, 60 req/min.
  - **Growth Pro ($29/mo or $24/mo annual)**: 500,000 API requests, 5 Seats, 50 GB Bandwidth, 600 req/min, automated PDF invoices, Stripe webhooks.
  - **Scale Enterprise ($99/mo or $82/mo annual)**: 10,000,000 API requests, 25+ Seats, 500 GB Bandwidth, 3,000 req/min, dedicated support SLA.
- **Flexible Billing Cycles**: Monthly & Yearly toggle with **20% savings badge** ($58 - $198 annual savings).
- **Interactive Upgrade Flow**: Instant upgrade triggers with celebratory canvas confetti and automated proration calculations.
- **Graceful Cancellation**: Voluntary cancellation dialog with retention survey and access retention until the end of the billing period.

### 2. Automated Billing & Invoices (`/billing`)
- **Stripe Webhook Listener (`/api/webhooks/stripe`)**:
  - `checkout.session.completed`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- **Interactive Webhook Simulator**: Developer console on `/billing` allowing 1-click transmission of realistic Stripe webhook events with live JSON inspection.
- **Itemized PDF Invoices**: Instant vector-rendered PDF downloads with custom SubSync branding, invoice numbers, tax IDs, itemized breakdowns, and payment method chips.
- **Payment Method Management**: Credit card vaulting with brand detection (Visa, Mastercard, Amex).

### 3. Usage Analytics Dashboard (`/dashboard`)
- **Real-Time Quota Telemetry**:
  - **API Invocations**: Live count vs monthly tier limit with rate limit warnings.
  - **Workspace Seats**: Team member allocation vs allocated capacity.
  - **CDN Bandwidth**: Data transfer meter with threshold alerts (>85% capacity warning banner).
  - **Database Storage**: Storage footprint tracking.
- **Billing Renewal Countdown**:
  - Live ticking timer displaying **Days : Hours : Minutes : Seconds** until next renewal or cycle completion.
  - Visual circular/progress bar depicting cycle elapsed percentage.
- **Interactive Traffic Simulation**: Click buttons directly on metrics (`+1,000 API Calls`, `+512 MB Bandwidth`, `+1 Seat`) to test real-time quota consumption without page refresh.
- **Traffic Throughput Chart**: Interactive Recharts Area Chart displaying hourly API requests, response latency, and network throughput.

### 4. Role-Based Admin Panel (`/admin`)
- **Three-Tier RBAC Architecture**:
  - **Super Admin (`SUPER_ADMIN`)**: Unrestricted access, global MRR/ARR oversight, manual plan overrides, account suspension, and audit logs.
  - **Manager (`MANAGER`)**: Workspace management, seat invitations, and usage metrics inspection.
  - **User (`USER`)**: Personal dashboard and invoice access with an active RBAC access restriction gate on admin routes.
- **Role Impersonation Switcher**: 1-click persona switcher in the navigation bar to test the platform as **Alex Vance (Super Admin)**, **Sarah Chen (Manager)**, or **David Miller (User)**.
- **Global Financial Analytics**:
  - Monthly Recurring Revenue (MRR) & Annual Run-Rate (ARR)
  - Gross Churn Rate meter & Month-over-Month growth
  - Average Revenue Per User (ARPU) & Customer Lifetime Value (LTV)
  - Subscriber tier distribution bar (Free vs Pro vs Enterprise)
- **Manual Plan Overrides**: Super Admins can override any tenant's tier directly from the UI, updating quotas and recording an immutable audit log.
- **Security & Audit Event Stream**: Live audit log tracker recording actor email, IP address, timestamp, and JSON payloads.

---

## 🛠️ Getting Started

### 1. Installation & Setup
```bash
# Clone or navigate to the workspace
cd "SubSync - SaaS Subscription Management Platform"

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```env
# Database (PostgreSQL URL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/subsync_db?schema=public"

# Stripe API Keys (Live or Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_key_here"
STRIPE_SECRET_KEY="sk_test_your_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"

# Application Base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Mock/Sandbox Mode (Runs immediately without Stripe credentials)
NEXT_PUBLIC_ENABLE_MOCK_FALLBACK="true"
```

### 3. Running the Server
```bash
# Development mode
npm run dev

# Production build & start
npm run build
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 Testing the Platform

1. **Role Switching**: Click the user profile in the top-right navbar to switch between **Super Admin**, **Manager**, and **User**.
2. **Upgrade / Checkout**: Navigate to `/pricing`, toggle Annual Billing, and click "Upgrade to Pro" or "Scale with Enterprise" to watch confetti fire and invoices generate.
3. **Simulate Live Traffic**: Navigate to `/dashboard` and click "+1k Calls" or "+512 MB" to watch the quota bars advance and threshold warnings activate.
4. **Download PDF Invoice**: Navigate to `/billing` and click "Download PDF" on any invoice in the history table.
5. **Dispatch Stripe Webhooks**: On `/billing`, use the Stripe Webhook Simulator to dispatch `invoice.payment_succeeded` or `invoice.payment_failed`.
6. **Admin Manual Override**: As Super Admin on `/admin`, click "Override Plan" on any user to change their tier instantly.

---

## 📄 License
MIT © SubSync Technologies Inc.
