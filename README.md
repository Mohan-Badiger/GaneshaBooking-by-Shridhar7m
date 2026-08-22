# Ganesh Idol Catalog & WhatsApp Booking Website

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

---

## 🛠️ Step-by-Step Installation

### Prerequisites
- Node.js installed (v18+)
- Local MongoDB running at `mongodb://127.0.0.1:27017/` (or a MongoDB Atlas link)

### Step 1: Configure & Seed the Backend

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` configuration file (already initialized for development, but customizable):
   ```bash
   cp .env.example .env
   ```

4. Seed the database with the administrator account and 8 sample Ganesha models:
   ```bash
   npm run seed
   ```
   *Note: This generates default credentials:*
   - **Admin Username**: `admin@ganeshabooking.com`
   - **Admin Password**: `admin123`

5. Start the backend developer server:
   ```bash
   npm run dev
   ```
   *The API will boot on `http://localhost:5000`.*

---

### Step 2: Set Up and Run the Frontend

1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install client dependencies:
   ```bash
   npm install
   ```

3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *The client will open on `http://localhost:5173`. You can visit `/admin` to log in using the credentials above.*

---

## 🛡️ Admin Login Credentials
- **Email**: `admin@ganeshabooking.com`
- **Password**: `admin123`

---

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
