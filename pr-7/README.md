```markdown
# Student Management API (Lab Project)

A backend service for managing students, authentication, monitoring, logging, and automated testing.  
Built with Node.js, Express, TypeScript, Sequelize, PostgreSQL, Jest, and Swagger.

---

## ✨ Features

### **Authentication & Authorization**
- Register new users with roles (`student`, `teacher`, `admin`).
- Login with email and password → returns a JWT token.
- Role-based access control for protected endpoints.

### **Student Management**
- Full CRUD operations for students (`GET`, `POST`, `PUT`, `DELETE`).
- Protected routes requiring valid JWT and appropriate role permissions.

### **Logging**
- Winston logger configured for different environments:
  - **Development:** logs to console.
  - **Production:** logs to files:
    - `logs/combined.log`
    - `logs/error.log`

### **Monitoring**
- Real-time server metrics available at:
  ```
http://localhost:3000/status
  ```
- Powered by `express-status-monitor`.

### **API Documentation**
- Swagger UI available at:
  ```
http://localhost:3000/api/docs
  ```

### **Testing**
- Jest + Supertest for unit and integration tests.
- Covers:
  - Authentication service
  - Student validator
  - Student endpoints
  - Server behavior

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd <project-folder>
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment variables
Create a `.env` file in the project root:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5433
DB_NAME=students_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your_secret_key
```

### 4. Run the server (development mode)
```bash
npm run dev
```

Expected output:
```
Server running at http://localhost:3000
Database connected
Tables created (sync)
```

### 5. Run the server (production mode)
```bash
NODE_ENV=production npm run dev
```

Logs will be written to:
- `logs/combined.log`
- `logs/error.log`

---

## 🧪 Testing & Coverage

### **Run all tests**
```bash
npm test
```

Expected result:
```
Test Suites: 3 passed, 3 total
Tests:       8 passed, 8 total
```

### **Run tests in watch mode**
```bash
npm run test:watch
```

### **Generate coverage report**
```bash
npm run test:cov
```

Coverage output will appear in the `coverage/` folder and in the console.

---

## 📖 API Documentation (Swagger)

1. Start the server:
   ```bash
   npm run dev
   ```
2. Open Swagger UI:
   ```
   http://localhost:3000/api/docs
   ```

### **Available Endpoints**

#### **Auth**
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT

#### **Students**
- `GET /api/students` — Get all students
- `POST /api/students` — Create a new student
- `GET /api/students/{id}` — Get student by ID
- `PUT /api/students/{id}` — Update student
- `DELETE /api/students/{id}` — Delete student

#### **Protected Students**
- `GET /api/students-protected` — Requires JWT
- `POST /api/students-protected` — Requires JWT + role

### **Testing Protected Endpoints**
1. Login using:
   ```
   POST /api/auth/login
   ```
2. Copy the returned JWT.
3. Click **Authorize** in Swagger UI.
4. Paste:
   ```
   Bearer <your_token>
   ```

---

## 📊 Monitoring

Open:
```
http://localhost:3000/status
```

You will see real-time metrics such as:
- CPU usage
- Memory usage
- Response times
- Active requests

---

## ✅ Checklist for Verification

1. `npm run dev` → server starts successfully
2. `http://localhost:3000/api/docs` → Swagger UI loads
3. Register a user → login → obtain JWT
4. Authorize in Swagger → test protected endpoints
5. `http://localhost:3000/status` → monitoring dashboard works
6. `npm test` → all tests pass
7. `npm run test:cov` → coverage report generated
8. Production mode logs appear in `logs/` folder

---

## 📌 Notes

- Ensure PostgreSQL is running and accessible with the credentials in `.env`.
- Create the `logs` folder manually or rely on automatic creation by the logger.
- You can use Swagger UI or `curl` to test API endpoints.
- For database changes, use your migration script:
  ```bash
  npm run migrate
  ```

---

## 📜 Useful NPM Scripts

```json
"scripts": {
  "dev": "nodemon src/server.ts",
  "migrate": "ts-node src/db/migrate.ts",
  "test": "jest --passWithNoTests",
  "test:watch": "jest --watchAll",
  "test:cov": "jest --coverage"
}
```

