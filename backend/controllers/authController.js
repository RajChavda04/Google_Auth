const axios = require('axios');
const jwt = require('jsonwebtoken');
const { oauth2Client } = require('../utils/googleClient');
const User = require('../models/userModel');

/* GET Google Authentication API. */
exports.googleAuth = async (req, res, next) => {

    const code = req.query.code;
    if (!code) {
        return res.status(400).json({ message: "Authorization code missing" });
    }
    console.log(code);
    try {
        const googleRes = await oauth2Client.getToken(code);
        console.log(googleRes);
        oauth2Client.setCredentials(googleRes.tokens);
        const userRes = await axios.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${googleRes.tokens.access_token}`,
                },
            }
        );

        console.log(userRes);
        const { email, name, picture } = userRes.data;
        // console.log(userRes);
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                image: picture,
            });
        }
        const { _id } = user;
        const token = jwt.sign({ _id, email },
            process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_TIMEOUT,
        });
        res.status(200).json({
            message: 'success',
            token,
            user,
        });
    } catch (err) {
        console.error("Google OAuth Error:", err.response?.data || err.message);

        res.status(500).json({
            message: "Google login failed",
            error: err.response?.data || err.message,
        });
    }
};