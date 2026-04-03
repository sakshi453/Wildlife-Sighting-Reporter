# Wildlife-Sighting-Reporter
The Wildlife Sighting Reporter is a full-stack platform that enables users to log animal sightings with GPS-tagged photos and metadata. Built with a React frontend and Node/MongoDB backend, it visualizes biodiversity through an interactive map dashboard, providingconservationistswith real-time data to track migration and protect endangered species.
# Wildlife Sighting Reporter 🌿
## Tech Wasps — Urban Biodiversity Platform

A full-stack citizen science web application empowering urban residents to capture, geotag, and share wildlife encounters within city limits.

### Tech Stack
- **Frontend:** React.js + Vite + Tailwind CSS (Glassmorphic UI)
- **Backend:** Node.js + Express
- **Database:** MongoDB with Mongoose ODM
- **External APIs:** Cloudinary (image hosting), Leaflet.js (mapping), JWT (auth)

### Quick Start

#### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (free tier works)

#### 1. Setup Server
```bash
cd server
cp .env .env.local  # Edit with your credentials
npm install
npm run seed       # Populate with 50 sample sightings
npm run dev        # Starts on http://localhost:5000
```

#### 2. Setup Client
```bash
cd client
npm install
npm run dev        # Starts on http://localhost:5173
```

#### 3. Demo Login
```
Email: nature@demo.com
Password: demo1234
```

### Project Structure
```
Wildlife/
├── client/          (React + Vite frontend)
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── hooks/
│       ├── api/
│       └── utils/
└── server/          (Express API backend)
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middleware/
    ├── config/
    └── scripts/
```

### Key Features
- 📸 Smart Sighting Form with drag-and-drop photo upload
- 📍 Automatic GPS geotagging
- 🗺️ Live interactive community map with filters
- 👤 Personal dashboard and digital field guide
- 📊 Biodiversity analytics engine with trend analysis
- 🔐 JWT-based authentication

### Environment Variables (server/.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/wildlife
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
CLIENT_URL=http://localhost:5173
```

---
Built with 💚 by **Tech Wasps** 🐝
