#  Coders Gyan – Real-Time Collaborative Code Editor

Coders Gyan is a powerful **real-time collaborative code editor** that supports multiple programming languages and enables developers, students, and educators to write, compile, and execute code together seamlessly.

##  Features

-  **Multi-language Support**  
  Supports real-time coding and execution in popular languages like **Python, C++, Java, JavaScript**, and more.

-  **Live Collaboration**  
  Enables **30+ users** to code simultaneously with real-time synchronization using **WebSockets** and **Monaco Editor**.

-  **Secure Code Execution with Docker**  
  Each execution is sandboxed using **Docker containers** to ensure isolation, scalability, and security.

-  **Multi-user Sessions**  
  Unique room-based architecture allowing multiple users to join a common code room for collaborative problem-solving.

-  **Whiteboard Integration** *(planned)*  
  An **interactive whiteboard** for brainstorming ideas and visually solving coding problems together.

-  **Video Conferencing** *(planned)*  
  In-built **video chat support** to facilitate live discussions during collaborative coding sessions.

---

##  Tech Stack

| Frontend           | Backend           | Real-time & Execution       | DevOps         |
|--------------------|-------------------|------------------------------|----------------|
| React.js           | Node.js + Express | WebSockets (Socket.IO)       | Docker         |
| Tailwind CSS       | REST API          | Docker for multi-language support | Docker Compose |
| Monaco Editor      |                   |                              |                |

---

## 📸 Screenshots

### 🧠 Code Editor Interface
![Editor Screenshot](./assets/landingPageImage/auth1.png)

### 🤝 Real-time Collaboration View
![Collaboration Screenshot](./assets/laptop.png)

---

##  Setup Instructions

### Prerequisites

- Node.js (v16+)
- Docker & Docker Compose
- MongoDB (if user authentication is added)

### Clone the repository

```bash
git clone https://github.com/yourusername/coders-gyan.git
cd coders-gyan

# Install frontend dependencies
cd frontend
npm install
npm run dev

# Install backend dependencies
cd backend
npm install
npm run dev

```
### Upcoming Features

- Integrated video conferencing (Google Meet style)
- Code history and versioning
- Interview mode with real-time question sharing and timer
