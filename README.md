# 🌎 LocalFinder: Discover Local Businesses

![image](https://github.com/user-attachments/assets/16b3d530-b778-49e4-9b89-202ac4195968)

Project link: https://local-business-finder-app-7db1.vercel.app/

## 📌 Overview

LocalFinder is a modern, location-based business discovery application that helps users quickly find and explore local establishments around them. Built with a sleek user interface and powerful location features, it makes discovering new places effortless and enjoyable.

## ✨ Key Features

- **Interactive Map Integration** - Visual exploration of businesses on an interactive map
- **Intelligent Filtering** - Find places by category, rating, and distance
- **Detailed Business Profiles** - View comprehensive information including ratings, reviews, photos, and contact details
- **Real-time Location Search** - Use your current location or search for any area
- **Responsive Design** - Seamless experience across desktop and mobile devices
- **Business Dashboard** - For business owners to manage their listings

## 🛠️ Tech Stack

### Frontend

- Next.js 15
- React 19
- Tailwind CSS 4
- Framer Motion for animations
- Leaflet for interactive maps
- Clerk for authentication

### Backend

- Node.js with Express
- MongoDB with Mongoose
- Google Places API integration
- JWT for authentication

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database
- Google Places API key
- Clerk account for authentication

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/localfinder.git
   cd localfinder
   ```

2. **Set up the backend**

   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI, Google API keys, etc.
   ```

3. **Set up the frontend**

   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with your API URL and Clerk keys
   ```

4. **Run the application**

   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Open your browser**
   Visit `http://localhost:3000` to see the application

## 🖥️ Usage

1. **Finding Businesses**

   - Allow location access or search for a specific area
   - Use the category filters to narrow down results
   - Adjust distance and rating filters as needed
   - Click on map markers or list items to view details

2. **Business Details**

   - View photos, hours, contact information, and directions
   - Read and submit reviews
   - Share business information with others

3. **Business Owner Features**
   - Register as a business owner
   - Add and manage business listings
   - Respond to reviews
   - Update business information

