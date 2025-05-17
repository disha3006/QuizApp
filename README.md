# QuizzyPop 🎮⚡

A real-time multiplayer quiz game built with React, Socket.io, and Express. Players join rooms, answer trivia questions, and compete to reach the winning score first!
![image](https://github.com/user-attachments/assets/eaa71f6b-b192-4fca-abaa-3c183daf3d91)
![image](https://github.com/user-attachments/assets/0adc705c-132c-40b0-bce4-c37151c3ba2d)


## Features ✨
- Real-time gameplay with WebSockets
- Multiplayer rooms(join with friends via room codes)
- Timed questions (10 seconds per question)
- Live scoreboard with player rankings
- Winner announcement when a player reaches 5 points
- Sleek UI with animations and responsive design

## Tech Stack 🛠️
| Frontend               | Backend              |
|------------------------|----------------------|
| React + Vite           | Express.js           |
| Socket.io Client       | Socket.io Server     |
| CSS Modules            | Node.js              |
| React Toastify         | CORS                 |

## Installation 

1. Clone the repository
bash
git clone https://github.com/your-username/quizzy-pop.git
cd quizzy-pop

3. Set up the Backend
bash
cd backend
npm install
npm start
(Runs on http://localhost:5000)

4. Set up the Frontend
bash
cd ../frontend
npm install
npm run dev
