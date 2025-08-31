require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./src/routes/auth');
const hosroscopeRouter = require('./src/routes/horoscope-routes');
const swaggerJSDOC = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const rateLimit = require('express-rate-limit');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRouter);
app.use('/api/horoscope', hosroscopeRouter);
mongoose.connect(MONGODB_URI);
mongoose.connection.once('open', async () => {
  await mongoose.model('UserHistory').syncIndexes();
});


const limtier = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes (time window in ms)
  max: 100,  // Max requests per window
  message: 'Too many requests from this IP, please try again later.',  // Custom error message
  standardHeaders: true,  // Include RateLimit-* headers in responses
});

app.use(limtier);

const swaggerOptions = {
    definition: {
    openapi: '3.0.0',
    info: {
        title: 'MyNaksh Assignment',
        version: '1.0.0'
    },
    servers: [{url: `http://localhost:${PORT}/api`}]
    },
    apis: ['./src/routes/*.js']
}

const swaggerUiOptions = {
  swaggerOptions: {
    supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],  // Enable for all methods
    persistAuthorization: true,  // Persist token across requests and page reloads
    displayRequestDuration: true  // Optional: Show request timing
  }
};

const swaggerSpec = swaggerJSDOC(swaggerOptions);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

app.listen(PORT, () => { console.log(`server is running on ${PORT}`) });
