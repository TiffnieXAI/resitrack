# Resi-Track: Community Disaster Monitoring and Response System

**Resi-Track** is a robust web-based disaster management platform designed specifically for the Philippine context. It enables Local Government Units (LGUs) and residents to collaborate in real-time during natural calamities such as typhoons, floods, and landslides.

By utilizing color-coded mapping and live data streaming via WebSockets, Resi-Track bridges the gap between emergency alerts and focused rescue operations, aiming to reduce casualties and strengthen community resilience.

---

## 🌟 Key Features

*   **🏠 Household Registry:** Residents can register their location using coordinates and provide emergency contact details.
*   **🚨 Incident Reporting:** Real-time reporting of localized disasters (Typhoons, Fire, Landslides, Earthquakes, and Floods) with severity and water-level tracking.
*   **🗺️ Interactive Safety Map:** A Leaflet-powered visual interface showing household status (Safe vs. Not Safe) for rapid rescue deployment.
*   **📊 LGU Admin Dashboard:** Comprehensive data metrics for authorities to monitor total incidents and affected populations at a glance.
*   **📡 Real-Time Sync:** Integrated WebSocket technology for low-latency updates, crucial during active disaster scenarios.
*   **🛡️ Secure Authentication:** Role-based access control (RBAC) using JWT (JSON Web Tokens) and BCrypt password encryption.

---

## 🛠 Tech Stack

### Frontend
*   **Framework:** React (Vite)
*   **Mapping:** Leaflet.js
*   **Communication:** WebSockets / StompJS
*   **Styling:** CSS3

### Backend
*   **Framework:** Spring Boot (Java)
*   **Build Tool:** Maven
*   **Security:** Spring Security + JWT
*   **Database:** MongoDB (NoSQL)

---

## 🚀 Setup and Installation

### Prerequisites
Before you begin, ensure you have the following installed:
*   **Java Development Kit (JDK) 17** or higher
*   **Node.js** (v16+) and **npm**
*   **Maven** (for backend dependencies)
*   **MongoDB** (Local instance or Atlas URI)

### 1. Backend Setup (Spring Boot)
1.  Navigate to the `backend` folder.
2.  Configure your MongoDB connection in `src/main/resources/application.properties`:
    ```properties
    spring.data.mongodb.uri=mongodb://localhost:27017/resitrack
    jwt.secret=YourKeyHere
    ```
3.  Install dependencies and run the server:
    ```bash
    mvn clean install
    mvn spring-boot:run
    ```
    *The server typically starts on port 8080.*

### 2. Frontend Setup (React + Vite)
1.  Navigate to the `frontend` folder.
2.  Install the required packages:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    *Open the provided local URL (usually http://localhost:5173) in your browser.*
