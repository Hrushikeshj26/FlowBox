# 📦 FlowBox

A modern B2B inventory and multi-warehouse supply chain management SaaS built with the MERN stack.

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
