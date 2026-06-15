# TaskPlanet Social Feed Application

A full stack social media feed app built with React, Material UI, Node.js, Express, MongoDB, JWT authentication, and image uploads with Multer.

## Features

- Signup and login with JWT authentication
- Protected feed route
- Post creation with optional image and text
- Like/unlike posts
- Comment posting with timestamp
- Infinite scroll pagination
- Search posts by username
- Dark mode toggle
- Responsive Material UI feed layout
- Instant UI updates for likes/comments
- Error handling and input validation

## Folder structure

```
projecttt/
  backend/
    controllers/
    middleware/
    models/
    routes/
    uploads/
    server.js
    package.json
    .env.example
  frontend/
    public/
    src/
      components/
      context/
      pages/
      services/
    package.json
    .env.example
  .gitignore
  README.md
```

## Getting started

### Backend

1. Navigate to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file from `.env.example` and set values:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=supersecretvalue
```

4. Start the backend server:

```bash
npm run dev
```

### Frontend

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file from `.env.example` if needed:

```env
VITE_API_URL=http://localhost:5000
```

4. Start the frontend:

```bash
npm run dev
```

## API documentation

### Authentication

- `POST /api/auth/signup`
  - Request body: `{ name, email, password }`
  - Response: `{ _id, name, email, token }`

- `POST /api/auth/login`
  - Request body: `{ email, password }`
  - Response: `{ _id, name, email, token }`

### Posts

- `GET /api/posts`
  - Query params: `page`, `limit`, `search`
  - Response: `{ page, limit, total, posts }`

- `POST /api/posts`
  - Request body: `text`, optional `image` multipart file
  - Response: created post object

- `GET /api/posts/:id`
  - Response: post object

- `PATCH /api/posts/:id/like`
  - Toggles like/unlike for authenticated user
  - Response: updated post object

- `POST /api/posts/:id/comment`
  - Request body: `{ comment }`
  - Response: updated post object

- `DELETE /api/posts/:id`
  - Deletes own post
  - Response: `{ message }`

## Deployment notes

### Frontend

- Deploy the `frontend` folder to Vercel.
- Use `frontend/vercel.json` to configure Vercel static build and client-side routing.
- Set the environment variable `VITE_API_URL` in Vercel to your deployed backend URL.
- Example: `https://your-backend-service.onrender.com`

### Backend

- Deploy the `backend` folder to Render.
- Use `render.yaml` at the repository root to configure the web service.
- In Render, create secrets named `MONGO_URI` and `JWT_SECRET` and map them to the backend service.
- The backend already uses `process.env.PORT` for Render compatibility.
- Build command: `npm install`
- Start command: `npm start`

### Database

- Use MongoDB Atlas.
- Add IP access or use the connection string with proper whitelist settings.

## Notes

- The backend serves uploaded images from `/uploads`.
- Render filesystem is ephemeral: uploads stored in `/uploads` will not survive redeploys or instance restarts. Use external storage (S3, Cloudinary, etc.) for production file persistence.
- The app uses local storage for JWT and user session data.
- Dark mode is persisted using local storage.
