# CropCare AI – Smart Farming Assistant

CropCare AI is a full-stack smart farming web platform designed to assist farmers with crop pathology assessments, certified agricultural medicine procurement, longitudinal recovery tracking, and agronomy expert consultations.

---

## 1. System Overview & Local Demo Capabilities

CropCare AI is built to run fully functional end-to-end in **Local Demo Mode** out of the box with zero required external accounts, API keys, or cloud billing:

| Feature / User Flow | Local Demo Status | Behavior |
|---|---|---|
| **Crop Image Upload** | **Fully Functional** | Accepts JPG, JPEG, and PNG images up to 10MB; stores them in `uploads/` with unique filenames. |
| **5-Question Diagnostic Flow** | **Fully Functional** | Captures crop name, visible symptoms, duration, affected acreage spread, and weather stress. |
| **Pathology Diagnosis** | **Safe Demo Mode** | Structured report based on reported symptoms and crop type. Clearly labeled as a Demo Assessment (`confidence: null`). No fabricated confidence scores. |
| **Grounded Treatments & Medicines** | **Fully Functional** | Resolves verified biological treatments, chemical contraindications, and certified medicines from `server/services/verifiedTreatments.js`. Withholds chemical advice for low confidence or unsupported crops. |
| **Longitudinal Recovery Tracking** | **Fully Functional** | Persists scans across server restarts. Supports uploading follow-up recovery photos and notes with side-by-side Before/After comparison. |
| **Medicine Marketplace & Cart** | **Fully Functional** | Single source of truth in SQLite (`/api/products`), category/crop filtering, persistent cart with 5% agricultural GST and free shipping thresholds (>= ₹799). |
| **Checkout & Order Creation** | **Demo Mode** | Validates shipping address and payment preference (COD / UPI demo). Generates persistent tracking IDs (`AGRI-EXP-XXXXXX`) and clears cart without charging money. |
| **Expert Consultations** | **Demo Request Mode** | Enforces present/future dates and physical farm coordinates. Stores booking requests in SQLite with simulated room links without charging fees or contacting real experts. |
| **Farmer Multi-Tenant Isolation** | **Fully Functional** | Farmer accounts, scans, cart items, orders, and appointments are partitioned per `farmer_id`. Competitor accounts cannot view or modify another farmer's data. |

---

## 2. Tech Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS 4, React Router 7, Lucide React
- **Backend**: Node.js v22+ (Native `node:sqlite` DatabaseSync in WAL mode), Express 5, Multer, CORS
- **AI Model Providers**: Google Gemini Multimodal Vision API, Custom REST Vision Microservices, Mock Vision Engine, Safe Demo Fallback
- **Testing**: Vitest, Supertest (40 automated tests across 7 test suites)
- **Linting & Code Quality**: Oxlint

---

## 3. Directory Structure

```
├── data/                    # Persistent SQLite database storage (cropcare.db, ignored in git)
├── server/
│   ├── app.js               # Express application configuration & safe error handling
│   ├── db.js                # SQLite schema definition, table initialization, and migrations
│   ├── index.js             # API server entrypoint (Port 5000)
│   ├── routes/
│   │   ├── auth.js          # Farmer registration, login, and profile
│   │   ├── bookings.js      # Consultation booking requests & validation
│   │   ├── cart.js          # Persistent cart management & tax/shipping calculation
│   │   ├── orders.js        # Order creation, checkout, & tracking
│   │   ├── products.js      # Certified medicines catalog (Single source of truth)
│   │   └── scans.js         # Leaf uploads, AI provider execution, & grounded treatments
│   └── services/
│       ├── ai/              # AI Model provider interface & implementations
│       │   └── index.js     # BaseModelProvider, DemoProvider, GeminiVisionProvider, CustomHttpProvider, MockAiProvider
│       └── verifiedTreatments.js # Verified agricultural disease and medicine registry
├── src/
│   ├── components/          # Reusable UI components (Navbar, CartDrawer, Footer, etc.)
│   ├── context/             # React Contexts (AuthContext, CartContext, CropContext)
│   ├── data/                # Initial seeds and fallback metadata
│   ├── layouts/             # FarmerLayout, AdminLayout, and MainLayout
│   ├── pages/               # Application routes & views
│   └── services/            # Frontend API client (api.js)
├── tests/                   # Automated Vitest + Supertest integration test suites
│   ├── booking-validation.test.js
│   ├── cart-totals.test.js
│   ├── e2e-flows.test.js          # Part 4: End-to-end user flows and security boundaries
│   ├── model-integration.test.js  # Part 3: AI provider, demo fallback, timeouts, low-confidence
│   ├── order-creation.test.js
│   ├── scan-persistence.test.js
│   └── upload-validation.test.js
├── uploads/                 # Local directory for uploaded crop leaf photos (ignored in git)
├── .env.example             # Template for local environment variables & live integrations
├── .gitignore               # Excludes .env, *.db, and uploads/ from Git
├── package.json             # Scripts & dependencies
└── vite.config.js           # Vite dev configuration with /api & /uploads proxy
```

---

## 4. Local Setup & Running Instructions

### 1. Prerequisites
- **Node.js**: v22.5.0 or higher (required for native `node:sqlite` `DatabaseSync`).
- **npm**: v10+

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
# Windows PowerShell
copy .env.example .env

# Linux / macOS
cp .env.example .env
```

*(Out of the box, `.env` defaults to safe demo mode with zero external dependencies).*

### 4. Run the Application

Run both backend and frontend concurrently with a single command:
```bash
npm run dev:all
```

Or run them in separate terminals:
```bash
# Terminal 1: Backend API (Port 5000)
npm run server

# Terminal 2: Vite Frontend (Port 5173)
npm run dev
```

Open **`http://localhost:5173`** in your browser. The Vite development server automatically proxies `/api/*` and `/uploads/*` requests to `http://localhost:5000`.

---

## 5. Testing & Quality Verification

Run all 40 automated integration tests covering end-to-end user flows, model integration, upload validation, cart calculations, order placement, and bookings:
```bash
npm test
```

Run code quality linting (Oxlint):
```bash
npm run lint
```

Build the production frontend bundle:
```bash
npm run build
```

---

## 6. GitHub Preparation & Data Safety

The repository is configured to safely push to GitHub without leaking secrets, private user data, or database files:

- **`.env` files**: All `.env`, `.env.local`, and custom environment files are excluded via `.gitignore`. Only `.env.example` with sanitized placeholders is tracked.
- **Local SQLite databases**: `data/*.db`, `data/*.db-shm`, and `data/*.db-wal` are excluded. `data/.gitkeep` preserves directory structure.
- **User-uploaded crop photos**: Files in `uploads/*` are excluded. `uploads/.gitkeep` preserves directory structure.
- **Dependencies & Build artifacts**: `node_modules/` and `dist/` are excluded.
- **Credentials Isolation**: Vision provider API keys and database credentials reside strictly server-side and are never exposed to client HTTP responses.

---

## 7. Optional Live Integrations & Setup Guide

All external services are **safely disabled by default** and operate in Demo Mode. To activate live integrations, configure the respective environment variables in `.env`:

### A. Google Gemini Multimodal Vision AI
1. **Account**: Sign up for Google AI Studio at [https://aistudio.google.com](https://aistudio.google.com).
2. **Key**: Generate an API key.
3. **Environment Setup**:
   ```env
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-1.5-flash
   ```
4. **Behavior**: CropCare AI will send leaf images and the farmer's 5 answers to Gemini for multimodal vision inference with strict timeouts (15s) and JSON normalization.

### B. Self-Hosted / Custom Vision Microservice
1. **Service**: Deploy an ONNX, PyTorch, or Fastify computer vision model service.
2. **Environment Setup**:
   ```env
   AI_PROVIDER=custom_http
   VISION_MODEL_ENDPOINT=https://your-vision-service.internal/predict
   VISION_API_KEY=your_optional_service_bearer_token
   VISION_MODEL_NAME=custom-onnx-detector
   ```

### C. Live Payment Gateway (e.g. Razorpay or Stripe)
1. **Account**: Create a merchant account at [https://dashboard.razorpay.com](https://dashboard.razorpay.com) or [https://dashboard.stripe.com](https://dashboard.stripe.com).
2. **Keys**: Retrieve Test/Live API Key ID and Secret.
3. **Environment Setup**:
   ```env
   PAYMENT_PROVIDER=razorpay
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
   ```
   *(Or for Stripe: `PAYMENT_PROVIDER=stripe`, `STRIPE_SECRET_KEY=sk_live_...`)*

### D. Live Video Consultations (e.g. Agora RTC)
1. **Account**: Register at [https://console.agora.io](https://console.agora.io).
2. **Project**: Create an RTC project to obtain App ID and App Certificate.
3. **Environment Setup**:
   ```env
   VIDEO_PROVIDER=agora
   AGORA_APP_ID=your_agora_app_id
   AGORA_APP_CERTIFICATE=your_agora_app_certificate
   ```

### E. Expert Calendar Scheduling (e.g. Google Calendar API)
1. **Account**: Enable the Google Calendar API in [Google Cloud Console](https://console.cloud.google.com).
2. **OAuth2**: Create OAuth 2.0 Client credentials.
3. **Environment Setup**:
   ```env
   CALENDAR_PROVIDER=google
   GOOGLE_CALENDAR_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   GOOGLE_CALENDAR_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALENDAR_REDIRECT_URI=http://localhost:5000/api/bookings/oauth2callback
   ```

---

## 8. Production Deployment & Persistent Storage Requirements

Because CropCare AI utilizes native SQLite (`data/cropcare.db`) and local filesystem image storage (`uploads/`), the production environment **must provide persistent disk storage**:

- **Persistent Volume Mounts**: Mount persistent storage for both `data/` and `uploads/` (e.g. AWS EBS, Railway Volume, Fly.io Volume, Docker Volume).
- **Process Manager**: Use PM2 (`npx pm2 start server/index.js --name "cropcare-api"`) or systemd on a Linux server.
- **Nginx Reverse Proxy**:
  ```nginx
  server {
      listen 80;
      server_name your-cropcare-domain.com;

      # Static production frontend bundle
      location / {
          root /var/www/cropcare/dist;
          try_files $uri $uri/ /index.html;
      }

      # Backend API endpoints
      location /api/ {
          proxy_pass http://127.0.0.1:5000/api/;
          proxy_http_version 1.1;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
      }

      # Uploaded plant photos
      location /uploads/ {
          proxy_pass http://127.0.0.1:5000/uploads/;
          proxy_set_header Host $host;
      }
  }
  ```
