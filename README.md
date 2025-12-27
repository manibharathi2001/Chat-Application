# Chat Application 💬

A real-time Chat Application built with the MERN stack (well, Express & React) featuring real-time messaging, user authentication, and profile customization.

## ✨ Features

- **Real-time Messaging**: Instant message delivery using Socket.io.
- **Authentication**: Secure user login and registration with JWT.
- **Profile Management**: Profile picture uploads powered by Cloudinary.
- **Online Presence**: Real-time tracking of online users.
- **Responsive Design**: Built with Tailwind CSS for a seamless experience across devices.

## 🚀 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Socket.io-client, Axios, React Hot Toast.
- **Backend**: Node.js, Express, Socket.io, Mongoose, JWT, Bcryptjs, Cloudinary.
- **Database**: MongoDB.

## 📂 Project Structure

```text
├── client/          # Vite + React Frontend
│   ├── src/
│   │   ├── context/ # State management (Zustand or Context API)
│   │   ├── lib/     # Utilities and API config
│   │   └── ...      # Components and Pages
├── server/          # Express + Node.js Backend
│   ├── controllers/ # Business logic
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API endpoints
│   ├── lib/         # Database and third-party integrations (Cloudinary, DB etc.)
│   └── ...
└── README.md
```

## 🛠️ Getting Started

### Prerequisites

- Node.js installed
- MongoDB URI
- Cloudinary account for file uploads

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Chat-Application
   ```

2. **Setup the Backend**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory and add your credentials:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   FRONTEND_URL=http://localhost:5173
   ```

3. **Setup the Frontend**
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Running Locally

1. **Start the Backend Server**
   ```bash
   cd server
   npm run server
   ```

2. **Start the Frontend Client**
   ```bash
   cd client
   npm run dev
   ```

## 🌐 Deployment

The application is configured for deployment on Vercel (see `vercel.json` in both client and server directories).
