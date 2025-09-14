# 📚 Book Tracker API

A simple and secure **Express.js REST API** for managing books and users.  
This project supports **user authentication**, **book CRUD operations**, **image uploads**, and **JWT-based authorization**.

---

## ✨ Features

- 👤 **User Authentication**

  - Register new users
  - Secure login with JWT
  - Password hashing with bcrypt

- 📚 **Book Management**

  - Create, read, update, and delete books
  - Upload cover images (with validation & storage)
  - Search & paginate books

- 🔒 **Security & Validation**

  - JWT-based authentication middleware
  - Input validation with express-validator
  - Custom error handling

- ⚡ **Other Goodies**
  - Structured controllers & routes
  - Async error handling wrapper
  - Static serving for book cover images

---

## 🛠️ Tech Stack

- **Node.js** + **Express.js** – Backend framework
- **MongoDB + Mongoose** – Database & ORM
- **Multer** – File uploads
- **bcryptjs** – Password hashing
- **jsonwebtoken** – JWT authentication
- **dotenv** – Environment variables

---

## ⚙️ Installation & Setup

1. Clone the repo:

   ```bash
   git clone https://github.com/Vooldz/personal-library-manager.git
   cd personal-library-manager
   ```

2. Install dependencies

```bash
   npm install
```

3. Create a .env file in the root with:

```bash
   PORT=5000
    MONGO_URL=mongodb://your-url
    JWT_SECRET=04233ba8756cac4c97d07a5e36789b0d8acc073b8eb2fb969dc5bd5db9f99a2686ff8e901cd25a5c66348dd8b7ebd7c0231eb9a9dac9709c5bb48a2446569774
```

4. Start the server:

```bash
    npm run dev
```

## 📖 API Endpoints

### 🔑 Authentication (Public)

- **POST** `/api/users/register` → Register a new user
- **POST** `/api/users/login` → Login & get token

### 👤 Users (Test Only)

- **GET** `/api/users/get-all-users` → Get all users

### 📚 Books (Protected – requires JWT)

- **POST** `/api/books` → Create a book (with `cover` image)
- **GET** `/api/books` → Get paginated books (supports `?page=1&limit=10&search=keyword`)
- **GET** `/api/books/:bookId` → Get single book by ID
- **PATCH** `/api/books/:bookId` → Update book (with optional new cover)
- **DELETE** `/api/books/:bookId` → Delete a book

---

## 🔒 Authentication

Use **Bearer Token** in headers:

```http
Authorization: Bearer <your_jwt_token>
```

## 📸 File Uploads

- Cover images are stored in: `/uploads/books/`
- File restrictions:
  - Only images (`jpg, jpeg, png, gif`)
  - Max size: **5MB**

---

## 📌 Indexes

To improve query performance, I add indexes for `Book` collection:

- 🏎️ `userId + createdAt` → Quickly fetch recent books for a user And Fast lookup of books by a user
- 🏎️ `userId + title` → Efficient search for a book by title for a user
- 🏎️ Text index (`userId + title + author`) → Supports full-text search for titles and authors

---
