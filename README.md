# Modern Online Voting System

A secure, intuitive, and responsive Online Voting System built using the MERN stack (MongoDB, Express.js, React.js, Node.js). This platform allows administrators to create and manage elections while providing students with a seamless voting experience.

## 🚀 Features

### For Administrators
*   **Dashboard:** Overview of active and closed elections.
*   **Manage Elections:** Create new elections with start/end times and descriptions.
*   **Manage Candidates:** Add candidates to specific elections with their details, department, and manifesto.
*   **Control Election Status:** Manually open or close elections.
*   **Live Results:** View real-time voting results and percentages for any active or closed election.
<img width="1403" height="813" alt="image" src="https://github.com/user-attachments/assets/3121a7b6-536d-4840-adcf-6c359c4d8eef" />
<img width="1122" height="631" alt="image" src="https://github.com/user-attachments/assets/234995f7-e6ba-4cb1-b21c-87ad4f7076aa" />
<img width="1557" height="850" alt="image" src="https://github.com/user-attachments/assets/6804e066-ec04-429d-a286-b2509cb27518" />

### For Students (Voters)
*   **Secure Authentication:** JWT-based login and registration.
*   **Active Elections:** Browse currently open elections.
*   **Candidate Profiles:** View candidate details, department, and manifesto before voting.
*   **Vote Casting:** Secure, one-time voting mechanism per election.
*   **Results:** View final results once an election has closed.

## 🛠️ Tech Stack

### Frontend
*   **React:** UI library
*   **Vite:** Build tool and development server
*   **React Router:** For seamless navigation
*   **Axios:** HTTP client for API requests
*   **Vanilla CSS:** Custom-designed premium, glassmorphism UI
<img width="1770" height="876" alt="image" src="https://github.com/user-attachments/assets/a97ab67e-589e-4250-86fc-825282ba1d76" />
<img width="1727" height="856" alt="image" src="https://github.com/user-attachments/assets/57b9c465-ca5c-4258-958d-acc99f77c4eb" />

### Backend
*   **Node.js & Express:** Server environment and framework
*   **MongoDB & Mongoose:** NoSQL database and object data modeling
*   **JSON Web Tokens (JWT):** Secure user authentication
*   **Bcrypt.js:** Password hashing
*   **Express Validator:** Request data validation

## ⚙️ Installation & Setup

### Prerequisites
*   [Node.js](https://nodejs.org/) installed
*   A [MongoDB](https://www.mongodb.com/) URI (local or Atlas)

### 1. Clone the repository
\`\`\`bash
git clone <your-repo-url>
cd "Online Voting System"
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`
Create a \`.env\` file in the \`backend\` directory with the following variables:
\`\`\`env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
VITE_API_URL=http://localhost:5173
\`\`\`
Start the backend server:
\`\`\`bash
npm run dev
\`\`\`

### 3. Frontend Setup
Open a new terminal window.
\`\`\`bash
cd frontend/frontend
npm install
\`\`\`
Create a \`.env\` file in the \`frontend/frontend\` directory with the following variable:
\`\`\`env
VITE_API_URL=http://localhost:3000/api
\`\`\`
Start the frontend development server:
\`\`\`bash
npm run dev
\`\`\`

## 📝 Usage Guide

1.  **Register:** Create an account as either an \`Admin\` or \`Student\`.
2.  **Admin Flow:** Log in as an admin to create an election and add candidates. Once set up, ensure the election is "Open".
3.  **Voter Flow:** Log in as a student to explore open elections, view candidate manifestos, and cast your vote.
4.  **Results:** Admins can view live results at any time. Students can view results only after the admin marks the election as "Closed".

## 🛡️ Security Measures
*   Passwords are hashed using \`bcrypt.js\` before being stored in the database.
*   API endpoints are protected using JWT token verification.
*   Server is protected with \`helmet\` for HTTP headers and \`express-rate-limit\` to prevent brute-force attacks.
*   Database enforces unique constraints to ensure a user can only vote once per election.

## 💡 Future Enhancements
*   Email verification during registration.
*   Exporting election results to CSV/PDF.
*   Enhanced visual analytics (Pie charts/Bar graphs) for election results.
