# DocuVault Platform

A full-stack document management application for uploading, browsing, filtering, and viewing PDF files with role-based user access.

## Recommended Repository Name

**docuvault-platform**

## Project Overview

This repository contains two applications:

- **backend/**: Spring Boot 3 REST API using MongoDB for users and PDF metadata/content.
- **frontend/**: Angular 18 standalone app for login, admin/user workflows, PDF upload, listing, filtering, and viewing.

## Core Features

- User management (create, edit, delete, list)
- User login endpoint
- PDF upload and metadata storage
- PDF listing and title-based filtering
- PDF update and deletion
- PDF retrieval by ID and by user history

## Tech Stack

- **Frontend**: Angular 18, TypeScript, Bootstrap, ngx-extended-pdf-viewer
- **Backend**: Java 17, Spring Boot 3.3, Spring Web, Spring Data MongoDB
- **Database**: MongoDB (`Stage` database by default)

## Repository Structure

- `/frontend` Angular client
- `/backend` Spring Boot API
- `/docs` Additional project documentation

## Quick Start

### 1) Backend

```bash
cd backend
mvn spring-boot:run
```

Runs on `http://localhost:8080` by default.

### 2) Frontend

```bash
cd frontend
npm install
npm start
```

Runs on `http://localhost:4200` by default.

## API Base URLs

- Users: `http://localhost:8080/api/users`
- PDFs: `http://localhost:8080/api/pdf`

## Notes

- Current backend config uses local MongoDB at `mongodb://localhost:27017/Stage`.
- Move sensitive values (for example JWT secret values) to environment variables before production deployment.
- See `docs/DOCUMENTATION.md` for architecture and endpoint details.
