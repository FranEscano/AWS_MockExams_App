# 📚 AWS Certification Practice App

![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue)
![Testing-Library](https://img.shields.io/badge/Testing_Library-13.4.0-red)
![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E)
![License](https://img.shields.io/badge/License-MIT-green)

A responsive web application for practicing AWS certification exams with cloud-based score tracking and user authentication.

---

## ✨ Features

### 📝 Exam Simulation
- 23+ AWS practice exams
- Timed exam mode
- Multiple question types (single/multiple choice)
- Instant scoring after submission

### 📊 Progress Tracking
- Score and history stored in **Supabase** (cloud database)
- User-specific exam attempts with timestamps
- Visual indicators of performance

### 🔐 User Authentication
- Sign up / Log in with email & password
- Protected routes and session persistence
- Hosted with **Supabase Auth**

### 💻 User Experience
- Clean, intuitive interface
- Mobile-friendly responsive layout
- Restart, resume, or view past attempts

---

## 🛠️ Technologies

### Frontend
- React 18 (with TypeScript)
- CSS Modules
- Context API + Hooks

### Backend & Auth
- Supabase Auth (GoTrue)
- Supabase Database (PostgreSQL)

### Testing
- Jest
- React Testing Library
- Code coverage reporting

### Tooling
- Create React App
- Prettier + ESLint
- ts-node for exam data conversion

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- npm v8+

### Installation

```bash
git clone https://github.com/FranEscano/AWS_MockExams_App.git
cd AWS_MockExams_App
npm install
```

### Setup Supabase
1. Create a Supabase project.
2. Add environment variables:
  - REACT_APP_SUPABASE_URL
  - REACT_APP_SUPABASE_ANON_KEY
3. Ensure your Supabase instance includes:
  - exam_history table
  - Email/password auth enabled

### Convert Exam Data
```bash
npm run convert:exams
```

### Start the App
```bash
npm start
```
Visit: http://localhost:3000

🧪 Testing
```bash
Copy
Edit
npm test            # Run all tests
npm run test:watch  # Watch mode
npm run test:coverage  # Generate coverage report
```

## 📂 Project Structure
```bash
├── src/
│   ├── components/
│   ├── exams/
│   ├── views/
│   ├── context/
│   ├── supabase/
│   ├── App.tsx
│   └── index.tsx
├── public/
├── scripts/
│   └── convertExams.ts
├── .env
├── package.json
└── README.md
```

## 🛠️ Build for Production
```bash
npm run build
```

## 🤝 Contributing
1. Fork the project
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add amazing feature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## 📜 License
Distributed under the MIT License. See LICENSE for more information.

## ✉️ Contact
- Francisco Bejarano Escano - francisco.escano@2itesting.com
- GitHub Repo: FranEscano/AWS_MockExams_App