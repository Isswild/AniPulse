AniPulse – Full-Stack Anime Hub

By James Wilds III

AniPulse is a full-stack web application that brings together anime fans through a searchable anime database, quizzes, discussions, user accounts, favorites, and a fan-art gallery.
Built as a complete end-to-end system with a custom backend, database schema, and responsive frontend.

Design Choices: 
I chose React with Vite for the frontend because it offers fast development, clean component structure, and smooth API integration. The backend uses Node and Express for flexibility, simple routing, and easy authentication. My PostgreSQL schema on Neon was designed to support users, anime, threads, favorites, and fan art in a clean relational structure.

Challenges:
My biggest challenges were deployment issues with environment variables and CORS, which caused the frontend and backend to not communicate at first. I also struggled with JWT authentication and file uploads, but solving them taught me a lot about secure routes and static asset handling. Designing SQL joins for discussions and fan art also pushed me to understand relational databases better.

Learning Outcomes:
I learned how full-stack systems communicate, how to structure a backend API, and how to manage authentication with JWT. Deployment across Railway, Vercel, and Neon taught me real-world hosting workflows. I also gained experience debugging, optimizing routes, and organizing a large React codebase.

Future Work:
With more time, I would add user profiles, better anime filtering, and real-time chat for discussions. I’d also like to improve the styling, add notifications, and integrate an external anime API for richer data. A future mobile version using React Native is another possible upgrade.

Quick Setup Instructions

Backend:
Go into the /anipulse folder, run npm install, then create a .env file with your DATABASE_URL and JWT_SECRET. Start the backend using npm start (default port: 8080).

Frontend:
Go into the /client folder, run npm install, and create a .env file with VITE_API_BASE_URL pointing to your backend. Start the frontend using npm run dev (default port: 5173).

Database:
Make sure your Neon PostgreSQL database has the required tables by running the provided SQL schema. Update DATABASE_URL in Railway or locally so your backend can connect properly.

Link to Live Web AniPulse: [meticulous-tranquility-production-7405.up.railway.app]

Link to AniPulse Video [https://uncg-my.sharepoint.com/:v:/g/personal/jhwilds_uncg_edu/IQCDthM9oYlXQol69vBKxC2ZAfmYyOsfcFM6rLoVlL8PCQk?e=KTVZS1]
