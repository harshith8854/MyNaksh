1. signup 
    - user should not be created when if mail already exists
    - send jwt in response
    - set minlength for user password
    - encrypt/hash the password while storing
    - receive base64 encoded password
2. login
    - validate user password
    - send jwt in response

3.Endpoint: GET /horoscope/today
Authenticated users can fetch their zodiac’s daily horoscope.

Mock a horoscope text per zodiac sign using in-memory data or JSON.



can be improved: 
to check password strength and respond accordingly
to add more features like forgot password, edit password
to store hashed of previous password and make sure user doesn't repeat the password
to store access tokens issued to user, to invalidate older tokens that are active and issue new token for every login
to implement ITO
to use assymetric algorithm to sign the jwt
to use other params in jwt like audience, issuer etc.
to include authorize in swagger ui which sets jwt in authorization header for each endpoint under horoscope route
to expose endpoints to read user history collection
to write test cases
to use local mongoDB instead of atlas


### Design Decisions
In building this Node.js Express API with MongoDB (via Mongoose) and JWT authentication, key choices included modularizing into controllers/routes for maintainability, auto-calculating zodiac from birthdate using a simple JavaScript function, and initially mocking horoscope data in-memory before shifting to persistent storage in a dedicated `UserHoroscopeHistory` collection. We used unique compound indexes (e.g., on `userId` and normalized `date` strings) for duplicate prevention, opting for string-based dates ("YYYY-MM-DD") to avoid timezone issues. JWT was selected for stateless auth, with middleware for protected endpoints. This setup prioritizes simplicity, security, and ease of extension while meeting the 2-2.5 hour coding constraint.

### Improvements You’d Make with More Time
With additional time, I'd integrate a real external horoscope API (e.g., via API Ninjas) for dynamic content instead of placeholders, add Redis caching for frequent reads (e.g., today's horoscope), implement pagination and filtering for the history endpoint, enhance error handling with a global middleware and logging (e.g., Winston), write unit/integration tests using Jest/Mocha, and bolster security with input validation (e.g., Joi), rate limiting, and refresh tokens for JWT.

### Scaling for Personalized Horoscopes
Currently, the system scales well with zodiac-specific horoscopes (only 12 variants, easily cached or pre-generated daily). For truly personalized ones (e.g., based on user birth charts, preferences, or AI generation), scaling would require generating unique content per user (potentially via ML models or advanced APIs), increasing computational load and storage (e.g., one entry per user per day in MongoDB, ballooning to millions for large user bases). To handle this, I'd use queue systems (e.g., BullMQ) for async generation, shard the database for history, implement aggressive caching (e.g., Redis TTL for daily data), and monitor with tools like Prometheus to manage costs and performance spikes during peak times.