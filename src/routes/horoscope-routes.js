const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { body, validationResult, header } = require('express-validator');
const { getTodayHoroscope, getHoroscopeHistory } = require('../controllers/horoscope-controller');

const secret = process.env.SECRET || 'secret';

const tokenValidation = () => header('Authorization').exists().withMessage('Authorization header is required')
                                .customSanitizer(value => { if(value.startsWith('Bearer ')) return value.split(' ')[1]; })
                                .isJWT().withMessage('Invalid Authorization Header');

                                /**
 * @swagger
 * /horoscope/today:
 *   get:
 *     summary: Get today's horoscope
 *     description: Retrieves the horoscope for the current day for the authenticated user. Requires a valid JWT token.
 *     tags: [Horoscope]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Today's horoscope data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 horoscope:
 *                   type: string
 *                   description: Horoscope text for today
 *                   example: "A great day ahead!"
 *       401:
 *         description: Unauthorized - Invalid or missing token
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
 *                   example: error occured while fetching zodiac details of the user
 */
router.get('/today', tokenValidation(), validate, getTodayHoroscope);

/**
 * @swagger
 * /horoscope/history:
 *   get:
 *     summary: Get horoscope history
 *     description: Retrieves the historical horoscope data for the authenticated user. Requires a valid JWT token.
 *     tags: [Horoscope]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Horoscope history data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 horoscopeHistory:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: 2025-08-29
 *                       horoscope:
 *                         type: string
 *                         example: "Yesterday was challenging but rewarding."
 *       401:
 *         description: Unauthorized - Invalid or missing token
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
 *                   example: error occured while fetching zodiac details of the user
 */
router.get('/history', tokenValidation(), validate, getHoroscopeHistory);

function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json(errors);
    }
    try {
        const decoded = jwt.verify(req.headers.authorization, secret);
        req.email = decoded.email;
    } catch (error) {
        if(error instanceof jwt.TokenExpiredError){
            return res.status(401).json({ msg: 'token has expired!' });
        }
        console.error(error);
        return res.status(500).json({msg: 'Error occured while validating the token'});
    }
    next();
}

module.exports = router;