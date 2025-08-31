const User = require('../models/user');
const UserHistory = require('../models/user-history');


// Mock in-memory horoscope data (one per zodiac sign)
const horoscopeData = {
  'Aries': 'Today is a great day for new beginnings and adventures.',
  'Taurus': 'Focus on your relationships and financial stability.',
  'Gemini': 'Communication is key; reach out and connect with others.',
  'Cancer': 'Take time to care for yourself and your loved ones.',
  'Leo': 'Your leadership skills will be recognized; shine bright.',
  'Virgo': 'Pay attention to details and organize your tasks effectively.',
  'Libra': 'Seek balance and harmony in both work and personal life.',
  'Scorpio': 'Embrace transformation and trust your intuition.',
  'Sagittarius': 'Explore new ideas and expand your horizons.',
  'Capricorn': 'Hard work will pay off; stay focused and determined.',
  'Aquarius': 'Innovate and think outside the box today.',
  'Pisces': 'Let your creativity flow and express your emotions.'
};


// mock in-memory history data (last 7 days, from 2025-08-30 back)
const horoscopeHistory = {
  'Aries': [
    { date: '2025-08-30', horoscope: 'Aries horoscope for 2025-08-30' },
    { date: '2025-08-29', horoscope: 'Aries horoscope for 2025-08-29' },
    { date: '2025-08-28', horoscope: 'Aries horoscope for 2025-08-28' },
    { date: '2025-08-27', horoscope: 'Aries horoscope for 2025-08-27' },
    { date: '2025-08-26', horoscope: 'Aries horoscope for 2025-08-26' },
    { date: '2025-08-25', horoscope: 'Aries horoscope for 2025-08-25' },
    { date: '2025-08-24', horoscope: 'Aries horoscope for 2025-08-24' }
  ],
  'Taurus': [
    { date: '2025-08-30', horoscope: 'Taurus horoscope for 2025-08-30' },
    { date: '2025-08-29', horoscope: 'Taurus horoscope for 2025-08-29' },
    { date: '2025-08-28', horoscope: 'Taurus horoscope for 2025-08-28' },
    { date: '2025-08-27', horoscope: 'Taurus horoscope for 2025-08-27' },
    { date: '2025-08-26', horoscope: 'Taurus horoscope for 2025-08-26' },
    { date: '2025-08-25', horoscope: 'Taurus horoscope for 2025-08-25' },
    { date: '2025-08-24', horoscope: 'Taurus horoscope for 2025-08-24' }
  ],
  'Gemini': [
    { date: '2025-08-30', horoscope: 'Gemini horoscope for 2025-08-30' },
    { date: '2025-08-29', horoscope: 'Gemini horoscope for 2025-08-29' },
    { date: '2025-08-28', horoscope: 'Gemini horoscope for 2025-08-28' },
    { date: '2025-08-27', horoscope: 'Gemini horoscope for 2025-08-27' },
    { date: '2025-08-26', horoscope: 'Gemini horoscope for 2025-08-26' },
    { date: '2025-08-25', horoscope: 'Gemini horoscope for 2025-08-25' },
    { date: '2025-08-24', horoscope: 'Gemini horoscope for 2025-08-24' }
  ],
  'Cancer': [
    { date: '2025-08-30', horoscope: 'Cancer horoscope for 2025-08-30' },
    { date: '2025-08-29', horoscope: 'Cancer horoscope for 2025-08-29' },
    { date: '2025-08-28', horoscope: 'Cancer horoscope for 2025-08-28' },
    { date: '2025-08-27', horoscope: 'Cancer horoscope for 2025-08-27' },
    { date: '2025-08-26', horoscope: 'Cancer horoscope for 2025-08-26' },
    { date: '2025-08-25', horoscope: 'Cancer horoscope for 2025-08-25' },
    { date: '2025-08-24', horoscope: 'Cancer horoscope for 2025-08-24' }
  ],
  'Leo': [
    { date: '2025-08-30', horoscope: 'Leo horoscope for 2025-08-30' },
    { date: '2025-08-29', horoscope: 'Leo horoscope for 2025-08-29' },
    { date: '2025-08-28', horoscope: 'Leo horoscope for 2025-08-28' },
    { date: '2025-08-27', horoscope: 'Leo horoscope for 2025-08-27' },
    { date: '2025-08-26', horoscope: 'Leo horoscope for 2025-08-26' },
    { date: '2025-08-25', horoscope: 'Leo horoscope for 2025-08-25' },
    { date: '2025-08-24', horoscope: 'Leo horoscope for 2025-08-24' }
  ],
  'Virgo': [
    { date: '2025-08-30', horoscope: 'Virgo horoscope for 2025-08-30' },
    { date: '2025-08-29', horoscope: 'Virgo horoscope for 2025-08-29' },
    { date: '2025-08-28', horoscope: 'Virgo horoscope for 2025-08-28' },
    { date: '2025-08-27', horoscope: 'Virgo horoscope for 2025-08-27' },
    { date: '2025-08-26', horoscope: 'Virgo horoscope for 2025-08-26' },
    { date: '2025-08-25', horoscope: 'Virgo horoscope for 2025-08-25' },
    { date: '2025-08-24', horoscope: 'Virgo horoscope for 2025-08-24' }
  ],
  'Libra': [
    { date: '2025-08-30', horoscope: 'Libra horoscope for 2025-08-30' },
    { date: '2025-08-29', horoscope: 'Libra horoscope for 2025-08-29' },
    { date: '2025-08-28', horoscope: 'Libra horoscope for 2025-08-28' },
    { date: '2025-08-27', horoscope: 'Libra horoscope for 2025-08-27' },
    { date: '2025-08-26', horoscope: 'Libra horoscope for 2025-08-26' },
    { date: '2025-08-25', horoscope: 'Libra horoscope for 2025-08-25' },
    { date: '2025-08-24', horoscope: 'Libra horoscope for 2025-08-24' }
  ],
  'Scorpio': [
    { date: '2025-08-30', horoscope: 'Scorpio horoscope for 2025-08-30' },
    { date: '2025-08-29', horoscope: 'Scorpio horoscope for 2025-08-29' },
    { date: '2025-08-28', horoscope: 'Scorpio horoscope for 2025-08-28' },
    { date: '2025-08-27', horoscope: 'Scorpio horoscope for 2025-08-27' },
    { date: '2025-08-26', horoscope: 'Scorpio horoscope for 2025-08-26' },
    { date: '2025-08-25', horoscope: 'Scorpio horoscope for 2025-08-25' },
    { date: '2025-08-24', horoscope: 'Scorpio horoscope for 2025-08-24' }
  ],
  'Sagittarius': [
    { date: '2025-08-30', horoscope: 'Sagittarius horoscope for 2025-08-30' },
    { date: '2025-08-29', horoscope: 'Sagittarius horoscope for 2025-08-29' },
    { date: '2025-08-28', horoscope: 'Sagittarius horoscope for 2025-08-28' },
    { date: '2025-08-27', horoscope: 'Sagittarius horoscope for 2025-08-27' },
    { date: '2025-08-26', horoscope: 'Sagittarius horoscope for 2025-08-26' },
    { date: '2025-08-25', horoscope: 'Sagittarius horoscope for 2025-08-25' },
    { date: '2025-08-24', horoscope: 'Sagittarius horoscope for 2025-08-24' }
  ],
  'Capricorn': [
    { date: '2025-08-30', horoscope: 'Capricorn horoscope for 2025-08-30' },
    { date: '2025-08-29', horoscope: 'Capricorn horoscope for 2025-08-29' },
    { date: '2025-08-28', horoscope: 'Capricorn horoscope for 2025-08-28' },
    { date: '2025-08-27', horoscope: 'Capricorn horoscope for 2025-08-27' },
    { date: '2025-08-26', horoscope: 'Capricorn horoscope for 2025-08-26' },
    { date: '2025-08-25', horoscope: 'Capricorn horoscope for 2025-08-25' },
    { date: '2025-08-24', horoscope: 'Capricorn horoscope for 2025-08-24' }
  ],
  'Aquarius': [
    { date: '2025-08-30', horoscope: 'Aquarius horoscope for 2025-08-30' },
    { date: '2025-08-29', horoscope: 'Aquarius horoscope for 2025-08-29' },
    { date: '2025-08-28', horoscope: 'Aquarius horoscope for 2025-08-28' },
    { date: '2025-08-27', horoscope: 'Aquarius horoscope for 2025-08-27' },
    { date: '2025-08-26', horoscope: 'Aquarius horoscope for 2025-08-26' },
    { date: '2025-08-25', horoscope: 'Aquarius horoscope for 2025-08-25' },
    { date: '2025-08-24', horoscope: 'Aquarius horoscope for 2025-08-24' }
  ],
  'Pisces': [
    { date: '2025-08-30', horoscope: 'Pisces horoscope for 2025-08-30' },
    { date: '2025-08-29', horoscope: 'Pisces horoscope for 2025-08-29' },
    { date: '2025-08-28', horoscope: 'Pisces horoscope for 2025-08-28' },
    { date: '2025-08-27', horoscope: 'Pisces horoscope for 2025-08-27' },
    { date: '2025-08-26', horoscope: 'Pisces horoscope for 2025-08-26' },
    { date: '2025-08-25', horoscope: 'Pisces horoscope for 2025-08-25' },
    { date: '2025-08-24', horoscope: 'Pisces horoscope for 2025-08-24' }
  ]
};

const getTodayHoroscope = async (req, res) =>{
    try {
        const user = await User.findOne({email: req.email});//email present in jwt is set in request during token validation
        const today = new Date();
        today.setHours(0,0,0,0);
        let historyRecord = await UserHistory.findOne({userId: user._id, date: today});
        if(!historyRecord){//insert only if there is no record in history for user's today's horoscope
            UserHistory.create({userId: user._id, date: today, horoscope: horoscopeData[user.zodiac]});
        }
        res.status(200).json({horoscope: horoscopeData[user.zodiac]});
    } catch (error) {
        console.error(error);
        res.status(500).json({msg:'error occured while fetching zodiac details of the user'});
    }
};

const getHoroscopeHistory = async (req, res) =>{
    try {
        const user = await User.findOne({email: req.email});//email present in jwt is set in request during token validation
        res.status(200).json({horoscopeHistory: horoscopeHistory[user.zodiac]});
    } catch (error) {
        console.error(error);
        res.status(500).json({msg:'error occured while fetching zodiac details of the user'});
    }
};

module.exports = { getTodayHoroscope, getHoroscopeHistory };