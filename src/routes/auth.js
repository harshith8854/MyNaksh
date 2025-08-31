const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth-controller');
const { body, validationResult } = require('express-validator');

const emailValidationChain = () => body('email').exists().withMessage('Email is required').isEmail().withMessage('Email is invalid');
const passwordValidationChain = () => body('password')
                                        .customSanitizer(value => {
                                            try {
                                                return Buffer.from(value,'base64').toString('utf-8');
                                            } catch (error) {
                                                throw new Error('Invalid base64 encoded password');
                                            }
                                        })
                                        .isLength({min: 8}).withMessage('password must be of atleast 8 characters');
const nameValidationChain = () =>  body('name').exists().withMessage('Name is required')
                                    .isString().withMessage('Name must be a string')
                                    .isLength({min: 3}).withMessage('Name must be of more than 3 characters');
const birthDateValidationChain = () => body('birthdate').exists().withMessage('Birthdate is required').isISO8601().withMessage('Birthdate must be a valid ISO 8601 date');

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account if the email doesn't already exist. Validates input fields, computes zodiac sign from birthdate, generates a JWT token, and returns it with user details.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - birthdate
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name (validated for length and format)
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: User's email address (must be valid email)
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 description: User's password (validated for strength; will be hashed). Must be a base64 encoded value
 *                 example: U2VjdXJlUGFzczEyMyE=
 *               birthdate:
 *                 type: string
 *                 format: date
 *                 description: User's birthdate in YYYY-MM-DD format (must be in the past)
 *                 example: 1990-01-01
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJpYXQiOjE3MjUwOTgzNDAsImV4cCI6MTcyNTEwMTk0MH0.abc123
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     zodiac:
 *                       type: string
 *                       example: Capricorn
 *       409:
 *         description: Conflict - User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: user already exists
 *       400:
 *         description: Validation error (e.g., invalid input)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: internal server error
 */
router.post('/signup', [
        nameValidationChain(),
        emailValidationChain(),
        passwordValidationChain(),
        birthDateValidationChain()
    ], validate, AuthController.signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate a user
 *     description: Logs in a user by validating email and password. If credentials are correct, generates a JWT token and returns it with user details.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address (must be valid email)
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 description: User's password (validated against stored hash). Must be base64 encoded value
 *                 example: U2VjdXJlUGFzczEyMyE=
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJpYXQiOjE3MjUwOTgzNDAsImV4cCI6MTcyNTEwMTk0MH0.abc123
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *       401:
 *         description: Unauthorized - Incorrect password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: incorrect password details
 *       404:
 *         description: Not Found - User details not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: user details not found
 *       400:
 *         description: Validation error (e.g., invalid input)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: internal server error
 */
router.post('/login', [
   emailValidationChain(),
   passwordValidationChain() 
], validate, AuthController.login);

function validate(req, res, next) {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return res.status(400).json(errors);
    }
    next();
}

module.exports = router;

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Enter your JWT token(can be fetched from login/signup endpoint response) in the text input below.
 */
