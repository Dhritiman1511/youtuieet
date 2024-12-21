
# youTuieet

A comprehensive backend for a video hosting platform, inspired by YouTube, developed as part of the "Chai aur Code" series by Hitesh Choudhary. This project extends the original implementation by adding remaining features and enhancements.

## Features

- User Authentication: Sign up and login functionality with secure password hashing.
- Video Management: Upload, view, and manage videos.
- Interactions: Like, dislike, comment, and reply to videos.
- Subscriptions: Subscribe to channels to receive updates.
- Token Management: Implements access and refresh tokens for secure API interactions.

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- Bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB instance running

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Dhritiman1511/youtuieet.git
   ```

2. Navigate to the project directory:

   ```bash
   cd youtuieet
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables by creating a `.env` file in the root directory. Include the following variables:

   ```env
   PORT=your_port_number
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

### Running the Application

Start the development server:

```bash
npm run dev
```

The server should now be running at `http://localhost:your_port_number`.

## API Endpoints

- **Authentication**
  - `POST /api/signup` - Register a new user
  - `POST /api/login` - Authenticate a user and retrieve tokens

- **Videos**
  - `POST /api/videos` - Upload a new video
  - `GET /api/videos/:id` - Retrieve video details
  - `DELETE /api/videos/:id` - Delete a video

- **Interactions**
  - `POST /api/videos/:id/like` - Like a video
  - `POST /api/videos/:id/dislike` - Dislike a video
  - `POST /api/videos/:id/comments` - Add a comment
  - `POST /api/videos/:id/comments/:commentId/replies` - Reply to a comment

- **Subscriptions**
  - `POST /api/subscribe/:channelId` - Subscribe to a channel
  - `DELETE /api/unsubscribe/:channelId` - Unsubscribe from a channel

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure that all new features are covered with appropriate tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Hitesh Choudhary](https://github.com/hiteshchoudhary) for the original "Chai aur Code" series and inspiration.
