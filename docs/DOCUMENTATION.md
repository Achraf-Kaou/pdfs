# Project Documentation

## 1. Architecture

The project follows a client-server architecture:

- **Angular frontend** (`/frontend`) consumes REST APIs.
- **Spring Boot backend** (`/backend`) exposes endpoints for users and PDF documents.
- **MongoDB** stores users and PDF document entities.

## 2. Backend Details

### 2.1 Main Modules

- `controller/`
  - `UserController` (`/api/users`)
  - `PdfController` (`/api/pdf`)
- `service/`
  - `UserService`
  - `PdfService`
- `repository/`
  - `UserRepository`
  - `PdfRepository`
- `entity/`
  - `User`
  - `PdfDocument`

### 2.2 Key Endpoints

#### User APIs (`/api/users`)

- `GET /api/users` → list users
- `POST /api/users` → create user
- `PUT /api/users/{id}` → update user
- `DELETE /api/users/{id}` → delete user
- `POST /api/users/login` → authenticate user
- `GET /api/users/count` → user count

#### PDF APIs (`/api/pdf`)

- `POST /api/pdf/upload` → upload PDF with metadata and user
- `GET /api/pdf` → list all PDFs
- `GET /api/pdf/{id}` → get PDF by ID
- `PUT /api/pdf/{id}` → replace PDF file and track user/date history
- `DELETE /api/pdf/{id}` → delete PDF
- `GET /api/pdf/filtered?titre=<text>` → filter by title
- `GET /api/pdf/pdfs/byUser?userId=<id>` → list PDFs by user history

### 2.3 Configuration

Backend properties (`backend/src/main/resources/application.properties`):

- `spring.data.mongodb.uri=mongodb://localhost:27017/Stage`
- `spring.application.name=test`

## 3. Frontend Details

### 3.1 Main Areas

- Pages:
  - Login
  - Home
  - Admin
  - My PDFs
  - PDF details/view pages
- Components:
  - User management components
  - PDF upload/list/edit/delete/viewer components
- Services:
  - `user.service.ts`
  - `Pdf.service.ts`

### 3.2 Routing

Defined in `frontend/src/app/app.routes.ts` and includes:

- `/` login
- `/home` user-facing PDF listing/search
- `/admin` admin page
- `/usersList` user management
- `/pdfUpload`, `/pdfList`, `/pdf/:id`, `/view/:id`

## 4. Local Setup

## 4.1 Prerequisites

- Java 17+
- Maven 3.9+
- Node.js 18+
- npm 9+
- MongoDB running locally

### 4.2 Run Backend

```bash
cd backend
mvn spring-boot:run
```

### 4.3 Run Frontend

```bash
cd frontend
npm install
npm start
```

## 5. Validation Commands

### Backend

```bash
cd backend
mvn test
```

### Frontend

```bash
cd frontend
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
```

## 6. Current Baseline Findings

During analysis, current repository baseline showed:

- Backend tests can run with Maven (`mvn test`).
- Frontend build currently fails due Angular bundle budget limits.
- Frontend tests currently fail due a component export/import mismatch in `mypdfs.component.spec.ts`.

These are pre-existing and unrelated to this documentation update.

## 7. Suggested Next Improvements

- Externalize secrets and sensitive configuration values to environment variables.
- Add DTOs and validation for request payloads.
- Implement proper password hashing and authentication hardening.
- Add CI checks for backend and frontend separately.
- Add API contract documentation (OpenAPI/Swagger).
