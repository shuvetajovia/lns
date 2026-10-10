# Mother Nature — Premium Native Foods

> *The First Step in Health.* Native grains, heirloom seeds & cold-pressed oils from the ancient soil of Kanchipuram, Tamil Nadu.

---

## Architecture

```mermaid
flowchart TB
    subgraph USER["👤 Customer"]
        B[Browser]
    end

    subgraph STOREFRONT["🛍️ Storefront — React + Vite (localhost:5174)"]
        direction TB
        Router["React Router DOM\n(/, /shop, /product/:id, /checkout)"]

        subgraph PAGES["Pages"]
            HP["🏠 HomePage\n(Hero, Categories, Bestsellers,\nBrand Story, Ingredient Spotlight)"]
            SP["🛒 ShopPage\n(Category Filter, Search, Sort)"]
            PD["📦 ProductDetailPage\n(Gallery, Variants, Dosha Info)"]
            CP["💳 CheckoutPage\n(Address, Pincode, Payment)"]
        end

        subgraph COMPONENTS["Shared Components"]
            NAV["Navbar"]
            CART["CartDrawer"]
            AUTH["AuthModal (OTP)"]
            PIN["PincodeModal"]
            TOAST["Toast Notifications"]
            CARD["ProductCard"]
        end

        subgraph CONTEXT["State Management"]
            CTX["ShopContext\n(cart, auth, pincode,\nsearch, toast)"]
        end

        subgraph DATA["Local Data Layer"]
            PROD["products.js\n(16 SKUs across 6 categories)"]
            AREAS["areas.csv\n(38 Tamil Nadu districts)"]
            PINCODES["pincodes.json\n(Tamil Nadu pincodes)"]
            OTP["otp_vault.json\n(OTP state)"]
        end
    end

    subgraph ADMIN["🖥️ Admin Portal — Electron + React (localhost:5180)"]
        direction TB
        EMAIN["electron-main.cjs\n(Window management,\nSecure file access)"]
        AREACT["Admin React SPA"]
        UPDATER["update_app.js\n(Auto-updater)"]
        EMAIN --> AREACT
        EMAIN --> UPDATER
    end

    subgraph EXTERNAL["☁️ External Services"]
        RAZORPAY["💳 Razorpay\nPayment Gateway SDK"]
        GITHUB["🐙 GitHub\nshuvetajovia/lns"]
    end

    B --> Router
    Router --> PAGES
    PAGES --> COMPONENTS
    PAGES --> CTX
    CTX --> DATA
    CP --> RAZORPAY
    AUTH --> OTP
    PIN --> PINCODES
    SP --> AREAS

    B -.->|"localhost:5180"| ADMIN
    STOREFRONT -.->|"git push lns"| GITHUB

    style USER fill:#f5ebd7,stroke:#c5a15b,color:#49352a
    style STOREFRONT fill:#faf6ef,stroke:#c5a15b,color:#49352a
    style ADMIN fill:#344b35,stroke:#c5a15b,color:#f5ebd7
    style EXTERNAL fill:#722f37,stroke:#c5a15b,color:#f5ebd7
    style PAGES fill:#fff8ef,stroke:#dfc58a,color:#49352a
    style COMPONENTS fill:#fff8ef,stroke:#dfc58a,color:#49352a
    style CONTEXT fill:#fff8ef,stroke:#dfc58a,color:#49352a
    style DATA fill:#fff8ef,stroke:#dfc58a,color:#49352a
```

---

## Project Structure

```
Mother Nature/
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx          # Hero, categories, bestsellers, brand story
│   │   ├── ShopPage.jsx          # Filterable product grid
│   │   ├── ProductDetailPage.jsx # Gallery, variants, Ayurvedic properties
│   │   └── CheckoutPage.jsx      # Address form + Razorpay payment
│   ├── components/
│   │   ├── Navbar.jsx            # Top bar + pincode delivery indicator
│   │   ├── CartDrawer.jsx        # Slide-out cart with free delivery bar
│   │   ├── AuthModal.jsx         # OTP-based login
│   │   ├── PincodeModal.jsx      # Delivery area checker
│   │   ├── ProductCard.jsx       # Reusable product tile
│   │   └── Toast.jsx             # Global toast notifications
│   ├── context/
│   │   └── ShopContext.jsx       # Global state (cart, auth, pincode, search)
│   └── data/
│       └── products.js           # Full product catalogue (16 SKUs, 6 categories)
├── public/
│   └── data/
│       ├── areas.csv             # 38 Tamil Nadu delivery districts
│       └── pincodes.json         # Pincode → district mapping
├── admin-portal/                 # Electron desktop admin app
│   ├── src/                      # Admin React SPA
│   ├── electron-main.cjs         # Electron main process
│   └── update_app.js             # Auto-updater
├── pincode.csv                   # Full India pincode database (165k rows)
├── architecture.md               # Detailed architecture notes
└── README.md                     # This file
```

---

## Product Categories

| Category | Products |
|---|---|
| 🌾 **Heritage Rice** | Karuppu Kavuni, Bamboo Rice, Nava 9-Grain Blend, Mappillai Samba, Kullakar |
| 🌱 **Ancient Millets** | Thinai (Foxtail), Kuthiraivali (Barnyard), Samai (Little), Varagu (Kodo) |
| 🍯 **Native Sweeteners** | Palm Jaggery (Karupatti), Palm Candy (Panangarkandu), Country Sugar |
| 🧂 **Essential Minerals** | Saindhava Lavana (Himalayan Pink Rock Salt) |
| 🌿 **Forest Harvest** | Pure Wild Forest Honey (Aranya Madhu) |
| 💧 **Cold Pressed Oils** | Wood-Pressed Black Sesame Oil, Virgin Wood-Pressed Coconut Oil |

---

## Getting Started

### Storefront (Web)

```bash
npm install
npm run dev
# → http://localhost:5174
```

### Admin Portal (Desktop App)

```bash
cd admin-portal
npm install
npm run dev        # Browser UI → http://localhost:5180
npm run electron   # Desktop window via Electron
```

### Build for Production

```bash
npm run build           # Storefront production bundle
cd admin-portal
npm run dist            # Electron packaged desktop app
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Storefront** | React 19, Vite 6, React Router DOM |
| **Admin Portal** | Electron 40, React 19, Vite 6 |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Payments** | Razorpay JS SDK |
| **CSV Parsing** | PapaParse |
| **Styling** | Vanilla CSS with custom design tokens (Ayurveda Royalty palette) |
| **Fonts** | Playfair Display, Cormorant Garamond, Outfit (Google Fonts) |

---

## Delivery Coverage

All 38 districts of Tamil Nadu are served. Pincode validation is performed locally using a comprehensive `pincodes.json` database for instant, zero-latency delivery checks.

---

## License

Private repository. All rights reserved.
