# Ganesh Idol Booking using WhatsApp Booking Website

A complete, production-ready full-stack website for local Ganesh idol manufacturing businesses. This application allows customers to browse handcrafted Ganesha models, view detailed specifications (size, materials, organic coloring highlights), and prepare a booking request that transfers directly to WhatsApp. 

Administrators are equipped with a secured control panel to manage Ganesha records, upload multiple photos (statically served locally, with optional auto-upload to Cloudinary), and modify shop attributes dynamically.

---

## ⚡ Technology Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router (v6)
- **API Client**: Axios
- **Icon Set**: Lucide React

### Backend & Database
- **Server**: Node.js & Express.js
- **Database**: MongoDB & Mongoose
- **Security**: JWT tokens, Bcryptjs password hashing, Helmet headers, Rate limiting

---

## 📂 Project Architecture

```text
GaneshaBooking-by-Shridhar7m/
├── backend/                  # Node.js + Express Server
│   ├── config/               # Database setup
│   ├── controllers/          # Business logic controllers
│   ├── middleware/           # JWT authenticators, rate limiters
│   ├── models/               # Mongoose schemas (Idol, Admin, Setting)
│   ├── routes/               # API Router
│   ├── services/             # File upload handler (Multer + Cloudinary)
│   ├── scripts/              # DB Seed helpers
│   ├── uploads/              # Local storage for Ganesha pictures
│   └── server.js             # Main server entrypoint
│
└── frontend/                 # React client SPA (Vite)
    ├── src/
    │   ├── assets/           # Design files
    │   ├── components/       # Custom cards, carousels, toasts, navbar
    │   ├── context/          # State providers (AuthContext, SettingsContext)
    │   ├── pages/            # Client catalog views & Admin Dashboard portals
    │   ├── index.css         # Google Fonts, Tailwind, custom shimmers
    │   ├── App.jsx           # Routers & Protected layouts
    │   └── main.jsx          # Entrypoint loader
    ├── index.html            # Core template with SEO headers
    └── tailwind.config.js    # Festival color palettes & font families
```

## 🚀 Quick Setup & Installation

### Prerequisites
- **Node.js** installed (v18+)
- **MongoDB** running locally (`mongodb://127.0.0.1:27017/`) or a **MongoDB Atlas** connection string.

---

### Step 1: Backend Setup & Run

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` configuration file from the template:
   ```bash
   copy .env.example .env
   ```
   *Note: Open `.env` and set your `MONGODB_URI` connection string.*
4. Start the backend developer server:
   ```bash
   npm run dev
   ```
   *The server will boot on `http://localhost:5000`.*

---

### Step 2: Frontend Setup & Run

1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client application will run at `http://localhost:5173`.*

---

## 🛡️ Admin Portal Access
To manage settings, upload images, and add/edit Ganesha idols:
- **URL**: `http://localhost:5173/admin` (or `/admin` in production)
- **Default Email**: `admin@ganeshabooking.com`
- **Default Password**: `admin123`

---

## ✨ Features Highlight

- **Eco-Friendly Theme**: Vibrant champagne (`#FAF7F2`), royal burgundy (`#5C0612`), and warm gold (`#C5A028`) design system using Adobe **IvyOra Display** serif fonts for traditional typography.
- **WhatsApp Checkout**: Customers configure booking dates, quantities, and instructions in a responsive form which automatically compiles a URL-encoded template to open WhatsApp with the business.
- **Auto-Generated Model Codes**: Ganesha idols are assigned unique sequential codes automatically on creation (starting from `0001`, e.g. `0001`, `0002`, `0003`...). The customer and admin search bars support instant filtering by these codes.
- **High-Performance WebP Compression**: Images uploaded by the admin are automatically resized and converted to optimized `.webp` format on the server side, saving 80%+ bandwidth and disk storage.
- **Strong Browser Caching**: Static uploads are configured with a 30-day cache control header to guarantee instant return visits.

## 🔌 API Endpoints Documentation

### Public Endpoints
- `GET /api/idols`: Fetch Ganesha catalog. Supports queries:
  - `search` (filter by name string)
  - `availability` (`true` / `false`)
  - `featured` (`true` for spotlight)
  - `sort` (`priceAsc`, `priceDesc`, `newest`)
- `GET /api/idols/:id`: Fetch specific Ganesha details (by MongoDB ID or Slug).
- `GET /api/settings`: Read dynamic workshop address, WhatsApp lines, and instructions.

### Admin Console Endpoints (Protected by JWT Bearer token)
- `POST /api/admin/login`: Admin auth credentials route. Returns JWT token.
- `GET /api/admin/dashboard`: Returns summary stats counts.
- `PUT /api/admin/settings`: Modifies dynamic business configurations.
- `POST /api/admin/idols`: Creates a Ganesha idol record.
- `PUT /api/admin/idols/:id`: Updates Ganesha idol fields.
- `DELETE /api/admin/idols/:id`: Deletes Ganesha idol record and unlinks its image files from the backend disk storage.
- `PATCH /api/admin/idols/:id/status`: Patches Ganesha spotlight or booking availability statuses.
- `POST /api/admin/upload`: Multi-file photo uploader. Returns resolved asset URLs.

---

## 📦 Production Bundling & Deployment

To build a single bundled package where the Express server serves both the APIs and the compiled React assets:

1. Inside the `frontend/` folder, generate production files:
   ```bash
   cd frontend
   npm run build
   ```
   *This outputs compiled assets to `frontend/dist/`.*

2. Set the Environment variable in `backend/.env`:
   ```env
   NODE_ENV=production
   ```

3. Boot the Express backend server from the `backend/` directory:
   ```bash
   cd backend
   npm start
   ```
   *Express will now serve the complete system on `http://localhost:5000`.*

---

## ☁️ Vercel Deployment (One-Click Serverless)

The project is pre-configured with `vercel.json` and a root `package.json` to deploy seamlessly to Vercel as a single serverless monorepo application:

1. Import your project repository into your **Vercel Dashboard**.
2. **Environment Variables**: In your Vercel project settings, configure:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `mongodb+srv://...` (your MongoDB Atlas connection string)
   - `JWT_SECRET`: `your_jwt_secret_phrase`
   - `WHATSAPP_NUMBER`: `91XXXXXXXXXX` (with country code)
   - *(Optional)* Cloudinary keys: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
3. Click **Deploy**. Vercel will automatically run the build orchestration, compile the frontend assets, set up the serverless Node.js backend handlers, and serve the application under a public domain.
