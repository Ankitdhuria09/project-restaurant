# 🍽️ Restaurant Menu & Order Management System

This is a full-stack web application for managing restaurant menus and customer orders. It includes features for creating and managing menu items, placing orders, and viewing real-time order updates.

## 📁 GitHub Repository

🔗 [Project GitHub Link](https://github.com/Ankitdhuria09/project-restaurant)

## Live Deployed using Render 

🔗 [project-restaurant](https://project-restaurant-fuv3.onrender.com)

## 📌 Features

- Add, edit, and delete menu items
- Filter menu items by category
- Place customer orders with optional notes
- View a live-updating list of items in an order
- Store order and menu data using MongoDB
- Backend built with Node.js and Express
- Frontend built with React and plain CSS

## 🛠️ Technologies Used

**Frontend:**
- React
- Vite
- Plain CSS

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose

## 🚀 Getting Started

### Prerequisites

- Node.js
- MongoDB
- Git

### Clone the repository

```bash
git clone https://github.com/Ankitdhuria09/project-restaurant.git
cd project-restaurant
```

### Install dependencies

```bash
# For backend
cd backend
npm install

# For frontend
cd ../frontend
npm install
```

### Start development servers

```bash
# In one terminal: start MongoDB
mongod

# In another terminal: start backend
cd backend
npm run dev

# In a third terminal: start frontend
cd frontend
npm run dev
```

## 🧪 Testing

Manually test:
- Adding/removing menu items
- Creating and deleting orders
- UI responsiveness

## 🧩 Project Structure

```
project-restaurant/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js
│
├── frontend/
│   ├── components/
│   ├── pages/
│   └── App.jsx
│
└── README.md
```

## 🐞 Issues & Fixes

During development, I faced issues such as:
- Not able create stating for ui - used lovable ai to get some refernce of ui of the project
- Line Ending Warnings (CRLF vs LF) Git warning: “LF will be replaced by CRLF” - Added .gitattributes:
- MongoDB connection timeouts — fixed by ensuring MongoDB was running locally
- React state not updating UI — resolved with useEffect and component state fixes

Thanks to ChatGPT for guidance in debugging these issues.

## 📜 License

This project is for educational purposes. All rights reserved © 2025.
