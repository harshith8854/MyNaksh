const User = require("../models/user");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const getZodiacSign = require("../utils/zodiac-sign");

const secret = process.env.SECRET || 'secret';

const signup = async (req, res) => {
    const { name, email, password, birthdate } = req.body;
    try {
        // user should not be created if mail already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ msg: 'user already exists' });
        } else {
            const zodiac = getZodiacSign(new Date(birthdate));
            user = await User.create({ name, email, password, birthdate, zodiac });
            // send jwt in response
            const payload = { name: user.name, email: user.email };
            const jwtToken = jwt.sign(payload, secret, { expiresIn: '1h' });
            res.json({ token: jwtToken, user: { name, email, zodiac } });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'internal server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email: email });
        if (user) {
            // validate user password
            if(await argon2.verify(user.password, password)){
                const payload = { name: user.name, email: user.email };
                const jwtToken = jwt.sign(payload, secret, { expiresIn: '1h' });
                // - send jwt in response
                res.json({ token: jwtToken, user: { email, name: user.name } });
            } else {
                res.status(401).json({msg: 'incorrect password details'});
            }
        } else {
            console.log('user with email %s not found', email);
            res.status(404).json({ msg: 'user details not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'internal server error' });
    }
}

module.exports = { signup, login };