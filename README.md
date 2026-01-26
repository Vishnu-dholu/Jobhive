# 🐝 JobHive - Full Stack Recruitment Portal

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![Java](https://img.shields.io/badge/Java-21-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg)

**JobHive** is a modern, containerized job recruitment platform that connects applicants with recruiters. Built with a **Spring Boot** backend and **React** frontend, it features secure role-based authentication, real-time job searching, application tracking, and automated email notifications.

---

## 📸 Screenshots

| **Landing Page** | **Job Feed** |
|:---:|:---:|
| ![Landing Page](https://via.placeholder.com/600x300?text=Landing+Page+Screenshot) | ![Job Feed](https://via.placeholder.com/600x300?text=Job+Feed+Screenshot) |

| **Recruiter Dashboard** | **Admin Panel** |
|:---:|:---:|
| ![Dashboard](https://via.placeholder.com/600x300?text=Recruiter+Dashboard) | ![Admin](https://via.placeholder.com/600x300?text=Admin+Panel) |

---

## 🚀 Key Features

### 🔐 Security & Authentication
* **Stateless Authentication:** Secure JWT (JSON Web Token) implementation with BCrypt password hashing.
* **Role-Based Access Control (RBAC):** Distinct portals and permission guards for **Applicants**, **Recruiters**, and **Admins**.
* **Secure File Handling:** UUID-based renaming for resume uploads to prevent filename collisions and ensure data integrity.

### 💼 For Recruiters
* **Post & Manage Jobs:** Create detailed job listings with salary, location, and type (Remote/Hybrid/Onsite).
* **Applicant Tracking System (ATS):** View all candidates for a specific job in a detailed, granular dashboard.
* **Hiring Workflow:** Update application status (Pending → Shortlisted → Accepted), which triggers automated email notifications to candidates.

### 👨‍💻 For Applicants
* **Dynamic Search:** Filter jobs by Keyword, Location, and Type using an optimized implementation of the **JPA Criteria API**.
* **One-Click Apply:** Seamless application process with resume file upload.
* **Application History:** Track status updates in real-time.
* **Saved Jobs:** Bookmark interesting roles for later using a specialized Many-to-Many relationship.

### 🛡️ Admin Panel
* **Platform Stats:** View real-time metrics for total users, jobs, and active applications.
* **User Management:** Ban malicious users or moderate inappropriate job postings.

---

## 🏗️ Architecture

The application follows a **Monolithic Architecture** designed for scalability, fully containerized using Docker.

* **Frontend:** React (Vite + TypeScript) + Tailwind CSS + DaisyUI.
* **Backend:** Spring Boot 3 (Java 21) exposing RESTful APIs.
* **Database:** PostgreSQL 15 (Relational Data).
* **Containerization:**
    * **Multi-Stage Builds:** The frontend is built with Node.js but served via a lightweight **Nginx** container to reduce image size.
    * **Docker Compose:** Orchestrates the Backend, Frontend, and Database networking and volume management.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Backend** | Java 21, Spring Boot 3, Spring Security 6, Spring Data JPA |
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, React Hook Form, Axios |
| **Database** | PostgreSQL |
| **DevOps** | Docker, Docker Compose, Nginx |
| **Tools** | Maven, Postman, Git, Mailtrap (SMTP Testing) |

---

## 🏁 Getting Started

The entire application can be spun up with a single command.

### Prerequisites
* **Docker Desktop** (Installed and running)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/yourusername/jobhive.git](https://github.com/yourusername/jobhive.git)
    cd jobhive
    ```

2.  **Configure Environment (Optional)**
    * The project comes with a default `docker-compose.yml` configured for development.
    * If you want to use email features, update the SMTP credentials in `backend/src/main/resources/application.properties`.

3.  **Run with Docker**
    ```bash
    docker-compose up --build
    ```
    * *Note: The first build might take a few minutes as it downloads dependencies.*

4.  **Access the App**
    * **Frontend:** `http://localhost:3000`
    * **Backend API:** `http://localhost:8080`
    * **Database:** Port `5432`

---

## 📚 API Documentation

The backend exposes the following key endpoints:

| Method | Endpoint | Description | Role |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate & get Token | Public |
| `GET` | `/api/jobs` | Search & Filter Jobs | Public |
| `POST` | `/api/jobs` | Post a new Job | Recruiter |
| `POST` | `/api/applications/{id}/apply` | Apply for a Job | Applicant |
| `PUT` | `/api/applications/{id}/status` | Update Candidate Status | Recruiter |
| `GET` | `/api/admin/stats` | View Platform Metrics | Admin |

---

## 🤝 Contributing

Contributions are welcome!
1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

### 🌟 Show your support

Give a ⭐️ if this project helped you!
