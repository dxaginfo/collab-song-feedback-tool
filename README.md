# Collaborative Song Feedback Tool

A web application enabling musicians to share works-in-progress and receive structured, time-stamped feedback directly on audio waveforms.

## 🎵 Features

- **Audio Upload & Playback**: Support for multiple audio formats (MP3, WAV, FLAC)
- **Waveform Visualization**: Interactive visual representation of audio files
- **Time-Stamped Comments**: Leave feedback at specific points in the audio
- **Version Control**: Track changes across multiple versions of a song
- **Collaboration**: Invite others to provide feedback on your music
- **Real-time Notifications**: Stay updated on new feedback and comments
- **Analytics**: Gain insights into feedback patterns and engagement

## 🛠️ Technology Stack

### Frontend
- React.js
- Redux for state management
- Material-UI for component library
- Wavesurfer.js for audio visualization
- Socket.io client for real-time updates

### Backend
- Node.js with Express.js
- JWT for authentication
- PostgreSQL for structured data
- AWS S3 for audio file storage
- Redis for caching and session management
- Socket.io for real-time communication

### DevOps
- Docker for containerization
- GitHub Actions for CI/CD
- AWS for hosting

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- PostgreSQL (v13 or later)
- Redis (v6 or later)
- AWS account (for S3 storage)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/dxaginfo/collab-song-feedback-tool.git
   cd collab-song-feedback-tool
   ```

2. Install dependencies
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables
   ```bash
   # Create .env file in the server directory
   cp server/.env.example server/.env
   # Edit the .env file with your configuration

   # Create .env file in the client directory
   cp client/.env.example client/.env
   # Edit the .env file with your configuration
   ```

4. Set up the database
   ```bash
   # Run database migrations
   cd server
   npm run migrate
   ```

5. Start the development servers
   ```bash
   # Start the backend server
   cd server
   npm run dev

   # In a separate terminal, start the frontend
   cd client
   npm start
   ```

6. Visit `http://localhost:3000` in your browser

## 📋 Project Structure

```
collab-song-feedback-tool/
├── client/                  # Frontend React application
│   ├── public/              # Static files
│   ├── src/                 # Source code
│   │   ├── components/      # UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # Redux store
│   │   ├── utils/           # Utility functions
│   │   └── App.js           # Main application component
│   └── package.json         # Frontend dependencies
├── server/                  # Backend Express application
│   ├── src/                 # Source code
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── middlewares/     # Express middlewares
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── app.js           # Express application setup
│   ├── migrations/          # Database migrations
│   └── package.json         # Backend dependencies
├── docker/                  # Docker configuration
│   ├── Dockerfile.client    # Frontend Dockerfile
│   ├── Dockerfile.server    # Backend Dockerfile
│   └── docker-compose.yml   # Docker Compose configuration
└── README.md                # Project documentation
```

## 🔒 Security Considerations

- All communication is secured via HTTPS
- User passwords are hashed and salted
- JWT tokens with short expiration times
- Rate limiting to prevent abuse
- Input validation on all endpoints
- CORS configuration to restrict access
- Regular security audits and vulnerability testing

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in and get JWT token
- `POST /api/auth/refresh` - Refresh JWT token

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/:id` - Get user by ID

### Projects
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Songs
- `GET /api/projects/:projectId/songs` - List songs in project
- `POST /api/projects/:projectId/songs` - Upload a new song
- `GET /api/songs/:id` - Get song details
- `PUT /api/songs/:id` - Update song details
- `DELETE /api/songs/:id` - Delete song

### Versions
- `GET /api/songs/:songId/versions` - List versions of a song
- `POST /api/songs/:songId/versions` - Create a new version
- `GET /api/versions/:id` - Get version details
- `DELETE /api/versions/:id` - Delete version

### Feedback
- `GET /api/versions/:versionId/feedback` - List feedback for a version
- `POST /api/versions/:versionId/feedback` - Add feedback
- `PUT /api/feedback/:id` - Update feedback
- `DELETE /api/feedback/:id` - Delete feedback
- `POST /api/feedback/:id/replies` - Reply to feedback

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

If you have any questions or feedback, please reach out to us at support@collabsongfeedback.com.

---

Made with ❤️ for musicians and producers