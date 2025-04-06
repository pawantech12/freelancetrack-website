# 🚀 FreelanceTrack

**FreelanceTrack** is a full-stack web application built for freelancers to manage and track their projects, clients, referrals, testimonials, and finances — all in one place. It helps you stay on top of your freelance workflow with an intuitive dashboard and powerful data insights.

## 🌐 Live Demo

>  _[Live Demo](https://freelancetrack-website.vercel.app/)_


## 🛠️ Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Authentication:** [Clerk](https://clerk.com/)
- **Backend:** [Node.js](https://nodejs.org/), [MongoDB](https://www.mongodb.com/)
- **ORM/ODM:** [Mongoose](https://mongoosejs.com/)


## 📦 Features

### 🔧 Project Management
- Add, view, update, and delete freelance projects.
- See project type (direct or referral), budget, deadline, and status.

### 👥 Client Management
- Add and manage clients related to your projects.
- Track active clients on the dashboard.

### 💸 Referral System
- Earn by referring others.
- View and manage all referrals you've made.

### 🌟 Testimonials
- Collect and manage testimonials from clients.
- Latest testimonials shown on dashboard for quick access.

### 📊 Finances
- View total revenue, direct and referral earnings.
- Monthly revenue chart with percentage breakdown.

### 📋 Dashboard Overview
- Displays:
  - Total number of projects
  - Number of active clients
  - Revenue breakdown (direct vs referral)
  - Revenue growth stats
  - Recent projects and testimonials
  - Project status (completed/pending)
  - Upcoming project deadlines (within 7 days)

### ✍️ CRUD Functionality
- Full create, read, update, delete operations for:
  - Projects
  - Clients
  - Referrals
  - Testimonials

## 🔐 Authentication

- User authentication is handled using **Clerk**.
- Each resource (project, client, etc.) is scoped to the authenticated user.

## ⚙️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/pawantech12/freelancetrack-website.git
   cd freelancetrack-website
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root and add:

   ```
   MONGODB_URI=your_mongodb_uri
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

4. **Run the development server:**
   ```bash
   pnpm run dev
   ```

5. **Visit:** [http://localhost:3000](http://localhost:3000)

## 🤝 Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue for suggestions and improvements.

## 📃 License

This project is free to use.

## 💼 Ideal For

- Freelancers managing multiple clients and projects
- Creators earning through direct work and referrals
- Portfolio builders seeking an all-in-one tracking solution

## 📬 Contact

If you have any questions or feedback, feel free to reach out:

**GitHub:** [@pawantech12](https://github.com/pawantech12)
