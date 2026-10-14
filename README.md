# 📦 FlowBox

A modern B2B inventory and multi-warehouse supply chain management SaaS built with the MERN stack.

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=json-web-tokens&logoColor=white)](https://jwt.io/)

[Live Demo- Available Soon....](#) · [Portfolio](https://hrushijdev.vercel.app/)

---

## ✨ Features

- **JWT Auth & User Isolation:** Strictly scoped data (`req.user._id`) across all inventory, warehouses, orders, and suppliers.
- **Analytics Dashboard:** Real-time KPIs, Recharts data visualizations (Monthly Revenue, Stock Levels, Order Status), and low-stock alerts.
- **Warehouse Transfers:** Move full or partial stock between facilities with automated capacity checks and load balancing.
- **Bulk CSV Import:** Fast bulk onboarding for Products and Suppliers using **PapaParse** and MongoDB `insertMany`.
- **Modern UI:** Clean dark/light mode interface built with Tailwind CSS and **shadcn/ui**.

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, shadcn/ui, Recharts, PapaParse, Lucide Icons
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs

---

## 🚀 Quick Start

**1. Clone the repository**

```bash
git clone [https://github.com/Hrushikeshj26/FlowBox.git](https://github.com/Hrushikeshj26/FlowBox.git)
cd FlowBox
```

**2. Setup Backend**

```bash
cd Backend
npm install
```

Create a `.env` file in `/server`:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

Run the server:

```bash
npm run dev
```

**3. Setup Frontend**

```bash
cd Frontend
npm install
npm run dev
```

---

## 👨‍💻 Author

**Hrushikesh Jadhav** — [hrushij.dev](https://hrushijdev.vercel.app/)
