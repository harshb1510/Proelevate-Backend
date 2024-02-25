
# Proelevate

## Overview
This project is a backend application that provides APIs for managing user authentication, user information, job listings, and user likes. It is built using Express.js framework for Node.js.

## Prerequisites
- Node.js installed on your machine
- MongoDB database running locally or accessible via connection URL
- `.env` file containing environment variables (See `.env.example` for reference)

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/harshb1510/Proelevate-Backend
   ```

2. Install dependencies:
   ```
   cd <project_directory>
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the project root
   - Add necessary environment variables (See `.env.example` for reference)

## Usage
1. Start the server:
   ```
   node index.ts
   ```
   or
   ```
   nodemon index.ts
   ```

3. Access the APIs:
   - Use a tool like Postman or any HTTP client to interact with the APIs
   - Base URL: `http://localhost:PORT/v1`

## Usage
 Deployment: The backend is deployed on render
  - Deployed Link:https://proelevate-backend.onrender.com/
   

## API Documentation
- **Authentication:**
  - `POST /auth/login`: Log in a user.
  - `POST /auth/register`: Register a new user.
  - `GET /auth/user/info`: Get user information.
  - `PUT /auth/user/update`: Update user information.
  - `GET /auth/user/restUrl/authenticate/:token`: Check token expiry status.
  - `POST /auth/user/resetPassword/:token`: Reset user password.
  - `POST /auth/user/forgotPassword`: Create reset password URL.

- **Job Listings:**
  - `POST /job/create`: Create a new job listing.
  - `GET /job/getJobs/:id`: Get a job listing by ID.
  - `PUT /job/updateJobs/:id`: Update a job listing by ID.
  - `DELETE /job/deleteJobs/:id`: Delete a job listing by ID.
  - `PUT /job/jobs/:id/addUser`: Add a user to a job listing.

- **User Likes:**
  - `POST /auth/likeUser`: Like a user.

## Middleware
- **authenticateToken**: Middleware function to authenticate JWT token for protected routes.

## Folder Structure
- `auth/`: Contains authentication-related files (routes, controllers, helpers).
- `Job/`: Contains job-related files (routes, controllers, helpers).
- `DB/`: Contains database connection files.
- `middleware/`: Contains middleware functions.
- `validators/`: Contains request validators.
- `store/`: Contains enums, interfaces, and other shared files.
- `controller/`: Contains API controller files.
- `helper/`: Contains helper functions used by controllers.
- `logger/`: Contains logging configuration files.


