# uPVC Doors & Windows Business Website

A premium, modern, mobile-first website for a uPVC manufacturing, supply, and installation company. Features an interactive smart quotation calculator, multi-language support (English + Tamil), an admin dashboard, lead persistence, and and automated fallback database for easy development testing.

---

## Getting Started

Since Node.js v22 and NPM are installed locally in the workspace under `/home/sanjay/.gemini/antigravity-ide/scratch/node-env`, please use the local binaries to execute project scripts.

### 1. Running the Backend
The backend operates on port `5000`. If a PostgreSQL database connection (`DATABASE_URL`) is not specified in the environment variables, the backend will automatically initialize and connect to a local, zero-config JSON database under `backend/database/db.json`.

```bash
# Navigate to backend
cd backend

# Start the hot-reloading development server
export PATH="/home/sanjay/.gemini/antigravity-ide/scratch/node-env/bin:$PATH"
npm run dev
```

### 2. Running the Frontend
The Next.js 15 frontend operates on port `3000`.

```bash
# Navigate to frontend
cd frontend

# Start the Next.js development server
export PATH="/home/sanjay/.gemini/antigravity-ide/scratch/node-env/bin:$PATH"
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## Default Credentials

For testing the **Admin Dashboard** (available at [http://localhost:3000/admin](http://localhost:3000/admin)):
* **Username**: `admin`
* **Password**: `AdminPass123`

---

## Project Structure & Architecture

### Backend APIs (`port 5000`)
* **Health Check**: `GET /api/health`
* **Submit Inquiry**: `POST /api/inquiries` - public lead submit
* **Submit Quote**: `POST /api/quotes` - calculates and saves quotes
* **Login**: `POST /api/auth/login` - signs JWT
* **Export Leads**: `GET /api/quotes/export` - compiles and sends a formatted Excel spreadsheet containing all quotes and inquiries.
* **Pricing Config**: `GET /api/config` & `PUT /api/config` - public config retrieval and admin adjustment updates.

### Frontend Pages (`port 3000`)
* **Home (`/`)**: Hero carousel, Why Choose Us, product grid, interactive before/after transformation slider, and FAQs.
* **Products (`/products`)**: Filterable catalog of uPVC doors and windows with size guides, features, and direct quotation triggers.
* **Services (`/services`)**: Outline of services (measurement, installation, dismantling) and custom timeline roadmap.
* **Smart Quotation (`/quote`)**: Multi-step configuration form providing instant cost estimates (including product fabrication, installation rates, and GST) with dynamic URL pre-fills.
* **Gallery (`/gallery`)**: Filterable project gallery of completed villa, commercial, and apartment installations.
* **Admin Dashboard (`/admin`)**: Secure gateway to manage leads, change pricing calculators, and export database tables to Excel.

---

## Environment Variables Configuration

Create a `.env` file inside the `backend/` directory for production configurations:

```env
PORT=5000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_custom_secure_secret_key
ADMIN_EMAIL=admin@upvcwebsite.com

# PostgreSQL Connection (Optional fallback to local JSON DB if omitted)
DATABASE_URL=postgresql://username:password@localhost:5432/upvc_db

# SMTP Configuration for Email Notifications (Optional fallback to console logging if omitted)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM=uPVC Doors & Windows <no-reply@upvcwebsite.com>
```
