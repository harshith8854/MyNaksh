# Personalized Horoscope API

A simple backend API built with Node.js and Express.js that allows users to sign up, log in, and retrieve personalized daily horoscopes based on their zodiac sign (auto-calculated from birthdate). Horoscopes are mocked for simplicity but stored persistently in MongoDB. Authentication uses JWT, and the app follows a modular structure with controllers and routes.


## Features
- User signup with name, email, password, and birthdate (auto-calculates zodiac sign).
- User login with JWT token generation.
- Protected endpoint to fetch today's horoscope (mocked and stored in history).
- Protected endpoint to fetch the last 7 days' horoscope history.
- Duplicate prevention via unique indexes in MongoDB.
- Modular code structure for maintainability.
- IP based rate limiting.

## Prerequisites
- Node.js
- MongoDB (local or cloud instance, e.g., MongoDB Atlas)
- npm (comes with Node.js)

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/harshith8854/mynaksh.git
   cd MyNaksh
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Optional: override the values in `.env` file in the root directory. Please note that the default DB URI is configured to my personal mongoDB cluster and I will be invalidating it in 30 days. 

## Running the Application
1. Start the server:
   ```
   npm start  # Or node server.js
   ```
   The API will run on `http://localhost:3000` (or your specified PORT).

2. Test endpoints using swagger UI exposed by the application (see API Endpoints below).

## API Documentation
Access the interactive Swagger UI at `/swagger` to explore, test, and execute all API endpoints. This provides detailed documentation, request/response schemas, and the ability to try out calls directly in your browser.

## API Endpoints
All endpoints are prefixed with `/api`. For interactive testing, use the Swagger UI at `/swagger`.

- **POST /auth/signup**: Create a new user.
  - Body: `{ "name": "John Doe", "email": "john@example.com", "password": "securepass", "birthdate": "1990-07-25" }`
  - Response: JWT token and user details (zodiac auto-calculated).

- **POST /auth/login**: Authenticate a user.
  - Body: `{ "email": "john@example.com", "password": "securepass" }`
  - Response: JWT token and user details.

**NOTE: To set the header in /horoscope/ endpoints, click on authorize button on top right corner of the swagger ui and enter the token value recevied in either of the above endpoints(login/signup).**

- **GET /horoscope/today**: Fetch today's horoscope (authenticated).
  - Headers: `Authorization: <jwt-token>`
  - Response: `{ "zodiac": "Leo", "horoscope": "Your leadership skills will shine today." }`

- **GET /horoscope/history**: Fetch last 7 days horoscopes (authenticated).
  - Headers: `Authorization: <jwt-token>`
  - Response: `{ "zodiac": "Leo", "history": [ { "date": "2025-08-30", "horoscope": "..." }, ... ] }`

## Technologies Used
- **Node.js & Express.js**: For the server and routing.
- **MongoDB & Mongoose**: For data storage (users and horoscope history).
- **JWT (jsonwebtoken)**: For authentication.
- **Argon2**: For password hashing.
- **Other**: dotenv for environment variables, express-rate-limit for rate limiting.

## Design Decisions
- Modular structure separates concerns (routes for endpoints, controllers for logic) for easier maintenance.
- Zodiac calculation uses a simple JS function based on birthdate ranges.
- Horoscope data is mocked and stored in MongoDB with unique indexes to prevent duplicates;
- dates are normalized as strings ("YYYY-MM-DD") to avoid timezone issues and redundant entries in user history for same day.
- JWT for stateless authentication keeps the app lightweight.
- Used MongoDB Atlas cluster for DB for quick setup.

## Improvements with More Time

- **Password Strength Validation**: Implement checks for password strength during signup and updates, ensuring criteria such as minimum length (e.g., 8 characters), inclusion of uppercase and lowercase letters, numbers, and special characters. Respond with detailed error messages if the password does not meet the requirements.

- **Additional Authentication Features**: Add support for forgot password (via email reset links) and edit password functionalities, including secure token generation and expiration for resets.

- **Storage of Previous Password Hashes**: Store hashes of the user's previous passwords (limited to the last 5 for efficiency) in the user model to prevent reuse during password changes or resets.

- **Access Token Management**: Store issued access tokens in a dedicated MongoDB collection, invalidate any active older tokens upon new logins, and generate a fresh token for each successful authentication session.

- **Idle Timeout (ITO) Implementation**: Enforce idle timeouts by tracking last activity in JWT payloads and invalidating sessions after a predefined period of inactivity (e.g., 15 minutes).

- **Asymmetric Algorithm for JWT Signing**: Switch to an asymmetric signing algorithm (e.g., RS256) for JWTs, using private/public key pairs for improved security and verification.

- **Extended JWT Parameters**: Incorporate additional claims in JWTs, such as audience (aud), issuer (iss), subject (sub), and others, to add context and enable stricter validation.

- **Exposed Endpoints for User History**: Add new protected endpoints to read from the user history collection, allowing queries by user ID with optional filters (e.g., date ranges).

- **Test Case Development**: Write comprehensive unit and integration test cases using frameworks like Jest and Supertest to cover authentication flows, endpoint behaviors, and error handling.

- **Switch to Local MongoDB**: Configure the application to use a local MongoDB instance instead of MongoDB Atlas for development and testing, updating the connection string in the `.env` file accordingly.

These enhancements will make the API more robust, secure, and developer-friendly. Implementation should prioritize testing to avoid regressions, and updates to the README and Swagger documentation are recommended to reflect the changes.

## Scaling Considerations
- DB schemas scale well even if each user gets personlized horoscope.
- Inevitable change i.e, implementing new business logic and controllers to generate personlized horoscope will be required.
- Existing validations would work with future implementation as well by just reusing them in the new routes.